import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mantine/core';
import { 
  simulationWS, 
  LogEvent,
  ConsumerUpdate,
  JobUpdate,
  SimulationStats 
} from '../../api/api';
import { SimulationConfigState } from '../config/types';
import { SimulationHeader } from './components/SimulationHeader';
import { SimulationTimer } from './components/SimulationTimer';
import { SimulationVisualization } from './components/SimulationVisualization';
import { SimulationStatsDisplay } from './components/SimulationStatsDisplay';
import { EventLogsPanel } from './components/EventLogsPanel';
import { QueueDisplay } from './components/QueueDisplay';
import { ConsumerPool } from './components/ConsumerPool';
import { EVENT_LOG_MAX_SIZE, TIMER_UPDATE_INTERVAL, MOCK_JOBS, MOCK_CONSUMERS, MOCK_EVENTS } from './constants';

const Simulation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get config from navigation state or redirect back if not provided
  const config = (location.state as { config?: SimulationConfigState })?.config;
  
  const [isConnected, setIsConnected] = useState(false);
  const [time, setTime] = useState<number>(0);
  const [events, setEvents] = useState<LogEvent[]>(MOCK_EVENTS);
  const [stats, setStats] = useState<SimulationStats>({
    totalJobsProcessed: 0,
    activeConsumers: 0,
    queueLength: 0,
    avgJobCompletionTime: 0,
    failedJobs: 0,
  });
  
  const [jobs, setJobs] = useState<JobUpdate[]>(MOCK_JOBS);
  const [consumers, setConsumers] = useState<ConsumerUpdate[]>(MOCK_CONSUMERS);

  // Redirect if no config provided
  useEffect(() => {
    if (!config) {
      console.error('No configuration provided');
      navigate('/configuration');
    }
  }, [config, navigate]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => prev + 0.01);
    }, TIMER_UPDATE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    if (!config) return;

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
        setEvents(prev => [...prev, log].slice(-EVENT_LOG_MAX_SIZE));
      });

      simulationWS.onConsumerUpdate((consumer: ConsumerUpdate) => {
        setConsumers(prev => prev.map(c => c.id === consumer.id ? consumer : c));
      });

      simulationWS.onConsumersUpdate((consumers: ConsumerUpdate[]) => {
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
    simulationWS.disconnect();
    navigate('/configuration');
  }, [navigate]);

  if (!config) {
    return null;
  }

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
