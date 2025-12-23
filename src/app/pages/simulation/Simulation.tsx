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
import { EVENT_LOG_MAX_SIZE, TIMER_UPDATE_INTERVAL } from './constants';

const Simulation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { config: contextConfig } = useConfig();
  
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

  // Setup WebSocket connection
  useEffect(() => {
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
      });

      // Connect and start simulation
      try {
        await simulationWS.connect(config);
      } catch (error) {
        console.error('Failed to connect:', error);
      }
    };

    setupWebSocket();

    // Cleanup on unmount
    return () => {
      simulationWS.disconnect();
    };
  }, [config]);

  const handleStop = useCallback(() => {
    // Send stop command to backend
    // Backend will send final statistics, which triggers navigation to report page
    simulationWS.stop();
  }, []);

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
