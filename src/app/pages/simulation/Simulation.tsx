import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mantine/core';
import { 
  simulationWS, 
  LogEvent,
  ConsumerUpdate,
  JobUpdate,
  SimulationStats,
  FinalStatistics
} from '../../api/api';
import { SimulationConfigState } from '../config/types';
import { useConfig } from '../../context/ConfigContext';
import { SimulationHeader } from './components/SimulationHeader';
import { SimulationTimer } from './components/SimulationTimer';
import { SimulationVisualization } from './components/SimulationVisualization';
import { SimulationStatsDisplay } from './components/SimulationStatsDisplay';
import { EventLogsPanel } from './components/EventLogsPanel';
import { QueueDisplay } from './components/QueueDisplay';
import { ConsumerPool } from './components/ConsumerPool';
import { TIMER_UPDATE_INTERVAL } from './constants';
import mockEventsData from './mock-events.json';

// Type for WebSocket messages
type WebSocketMessage =
  | { type: 'log'; data: LogEvent }
  | { type: 'consumer_update'; data: ConsumerUpdate }
  | { type: 'consumers_update'; data: ConsumerUpdate[] }
  | { type: 'job_update'; data: JobUpdate }
  | { type: 'jobs_update'; data: JobUpdate[] }
  | { type: 'stats_update'; data: SimulationStats }
  | { type: 'simulation_started'; data: { timestamp: number } }
  | { type: 'simulation_complete'; data: { duration: number } }
  | { type: 'statistics'; data: any };

const Simulation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { config: contextConfig, isBackendConnected } = useConfig();
  
  // Get config from navigation state or fallback to context
  const config = (location.state as { config?: SimulationConfigState })?.config || contextConfig;
  
  const [isConnected, setIsConnected] = useState(false);
  const [time, setTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [events, setEvents] = useState<LogEvent[]>([]);
  const [stats, setStats] = useState<SimulationStats>({
    jobsProcessed: 0,
    jobsReceived: 0,
    queueLength: 0,
    avgCompletionTime: 0,
    papersUsed: 0,
    refillEvents: 0,
    avgServiceTime: 0,
  });
  
  const [jobs, setJobs] = useState<JobUpdate[]>([]);
  const [consumers, setConsumers] = useState<ConsumerUpdate[]>([]);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning) return;
    
    const timer = setInterval(() => {
      setTime(prev => prev + 0.01);
    }, TIMER_UPDATE_INTERVAL);
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Play mock simulation using pre-recorded events
  const playMockSimulation = useCallback(() => {
    const events = mockEventsData as WebSocketMessage[];
    let eventIndex = 0;
    let lastTimestamp = 0;

    const processNextEvent = () => {
      if (eventIndex >= events.length) {
        console.log('Mock simulation complete');
        return;
      }

      const event = events[eventIndex];
      eventIndex++;

      // Calculate delay based on timestamp difference
      const currentTimestamp = (event.type === 'log' && 'data' in event) 
        ? (event.data as LogEvent).timestamp 
        : ('data' in event && 'timestamp' in event.data) 
          ? (event.data as any).timestamp 
          : lastTimestamp;
      
      const delay = currentTimestamp - lastTimestamp;
      lastTimestamp = currentTimestamp;

      // Process event based on type
      switch (event.type) {
        case 'log':
          setEvents(prev => [...prev, event.data]);
          break;
        case 'consumer_update':
          setConsumers(prev => {
            const exists = prev.find(c => c.id === event.data.id);
            if (exists) {
              return prev.map(c => c.id === event.data.id ? event.data : c);
            } else {
              return [...prev, event.data];
            }
          });
          break;
        case 'consumers_update':
          setConsumers(event.data);
          break;
        case 'job_update':
          setJobs(prev => [...prev, event.data]);
          break;
        case 'jobs_update':
          setJobs(event.data);
          break;
        case 'stats_update':
          setStats(event.data);
          break;
        case 'simulation_complete':
          setIsTimerRunning(false);
          break;
        case 'statistics':
          // Navigate to report with dummy data
          navigate('/report', { state: { statistics: null } });
          return;
      }

      // Schedule next event (speed up by dividing delay)
      setTimeout(processNextEvent, Math.max(1, delay / 2));
    };

    processNextEvent();
  }, [navigate]);

  // Setup WebSocket connection or mock simulation
  useEffect(() => {
    // If backend is not connected, use mock events
    if (!isBackendConnected) {
      console.log('Backend offline - using mock events');
      setIsConnected(false);
      playMockSimulation();
      return;
    }

    const setupWebSocket = async () => {
      // Register event handlers
      simulationWS.onConnected(() => {
        console.log('Connected to simulation');
        setIsConnected(true);
      });

      simulationWS.onDisconnected(() => {
        console.log('Disconnected from simulation');
        setIsConnected(false);
      });

      // Register handlers for different message types
      simulationWS.onLog((log: LogEvent) => {
        setEvents(prev => [...prev, log]);
        // setEvents(prev => [...prev, log].slice(-EVENT_LOG_MAX_SIZE));
      });

      simulationWS.onConsumerUpdate((consumer: ConsumerUpdate) => {
        setConsumers(prev => {
          const exists = prev.find(c => c.id === consumer.id);
          if (exists) {
            // Update existing consumer (status change, paper refill, etc.)
            return prev.map(c => c.id === consumer.id ? consumer : c);
          } else {
            // Add new consumer (scaling up)
            return [...prev, consumer];
          }
        });
      });

      simulationWS.onConsumersUpdate((consumers: ConsumerUpdate[]) => {
        // Replace entire consumer list (used for scaling down or full state sync)
        setConsumers(consumers);
      });

      simulationWS.onJobUpdate((job: JobUpdate) => {
        setJobs(prev => [...prev, job]);
      });

      simulationWS.onJobsUpdate((jobs: JobUpdate[]) => {
        setJobs(jobs);
      });

      simulationWS.onStats((newStats: SimulationStats) => {
        setStats(newStats);
      });

      simulationWS.onSimulationComplete((data) => {
        console.log('Simulation complete:', data);
        setIsTimerRunning(false);
      });

      simulationWS.onStatistics((finalStats: FinalStatistics) => {
        console.log('Final statistics received:', finalStats);
        // Navigate to report page with statistics
        navigate('/report', { state: { statistics: finalStats } });
      });

      simulationWS.onError((error) => {
        console.error('WebSocket error:', error);
        // If WebSocket fails, fallback to mock
        console.log('WebSocket failed - falling back to mock events');
        setIsConnected(false);
        playMockSimulation();
      });

      // Connect and start simulation
      try {
        await simulationWS.connect(config);
      } catch (error) {
        console.error('Failed to connect:', error);
        // Fallback to mock simulation
        console.log('Connection failed - using mock events');
        setIsConnected(false);
        playMockSimulation();
      }
    };

    setupWebSocket();

    // Cleanup on unmount
    return () => {
      simulationWS.disconnect();
    };
  }, [config, isBackendConnected, navigate, playMockSimulation]);

  const handleStop = useCallback(() => {
    if (isBackendConnected) {
      // Send stop command to backend
      // Backend will send final statistics, which triggers navigation to report page
      simulationWS.stop();
    } else {
      // In mock mode, navigate directly to report with dummy data
      navigate('/report', { state: { statistics: null } });
    }
  }, [isBackendConnected, navigate]);

  return (
    <Box style={{ display: 'flex', flexDirection: 'row', height: '100vh', backgroundColor: '#f8f9fa', overflow: 'hidden' }}>
      
      {/* ================= LEFT PANEL: DASHBOARD ================= */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem', gap: '1.2rem', overflowY: 'auto' }}>
        
        <SimulationHeader isConnected={isConnected} />

        {config.showTime && <SimulationTimer time={time} onStop={handleStop} />}

        {config.showComponents && <SimulationVisualization />}

        {/* Queue and Consumer Pool Row */}
        <Box style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
          <Box style={{ flex: '1 1 60%', minWidth: 0 }}>
            <QueueDisplay jobs={jobs} />
          </Box>
          <Box style={{ flex: '1 1 40%', minWidth: 0 }}>
            <ConsumerPool consumers={consumers} />
          </Box>
        </Box>

        {config.showSimulationStats && <SimulationStatsDisplay stats={stats} />}
      </Box>

      {/* ================= RIGHT PANEL: EVENT LOGS ================= */}
      {config.showLogs && <EventLogsPanel events={events} showTime={config.showTime} />}

    </Box>
  );
};

export default Simulation;
