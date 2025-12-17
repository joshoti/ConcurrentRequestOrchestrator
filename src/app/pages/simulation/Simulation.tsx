import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Title, Text, Badge, Group, Paper, Stack, Grid, Center } from '@mantine/core';
import { IconPower, IconTool } from '@tabler/icons-react';
import { 
  simulationWS, 
  SimulationEvent, 
  SimulationStats 
} from '../../api/api';
import { SimulationConfigState } from '../config/types';
import ProducerImg from '../../assets/images/producer-picture.png';
import ConsumerImg from '../../assets/images/consumer-picture.jpg';
import RefillerImg from '../../assets/images/refiller-picture.png';

interface LogEntry {
  timestamp: string;
  message: string;
}

const Simulation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get config from navigation state or redirect back if not provided
  const config = (location.state as { config?: SimulationConfigState })?.config;
  
  const [isConnected, setIsConnected] = useState(false);
  const [time, setTime] = useState<number>(0);
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [stats, setStats] = useState<SimulationStats>({
    totalJobsProcessed: 0,
    activeConsumers: 0,
    queueLength: 0,
    avgJobCompletionTime: 0,
    failedJobs: 0,
  });

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
    }, 10);
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

      simulationWS.onEvent((event: SimulationEvent) => {
        console.log('Simulation event:', event);
        setEvents(prev => [...prev, event].slice(-50)); // Keep last 50 events
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
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem', gap: '1.5rem', overflowY: 'auto' }}>
        
        {/* Header Section */}
        <Group justify="space-between" align="center">
          <Title order={1} size="2.5rem" fw={700} c="black">
            Simulation Running
          </Title>
          
          {/* Status Badge */}
          <Badge 
            size="lg" 
            color={isConnected ? 'green' : '#bf2d2d'}
            variant="filled"
            style={{ fontWeight: 700, fontSize: '0.75rem' }}
            leftSection={<IconPower size={16} />}
          >
            {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </Badge>
        </Group>

        {/* Timer Section */}
        {config.showTime && (
          <Paper shadow="sm" p="xl" radius="lg" style={{ border: '1px solid #e9ecef' }}>
            <Group justify="space-between" align="center">
              <Text size="xl" fw={700} c="black" ff="monospace">
                Time: {time.toFixed(4)} s
              </Text>
              <Button 
                onClick={handleStop}
                color="red" 
                variant="light"
                radius="xl"
                size="sm"
                fw={700}
                style={{ borderColor: '#fecaca', backgroundColor: '#fef2f2' }}
                c="red.9"
              >
                End simulation
              </Button>
            </Group>
          </Paper>
        )}

        {/* Visualization Section */}
        {config.showComponents && (
          <Paper shadow="sm" p={40} radius="lg" style={{ border: '1px solid #e9ecef', minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Group gap={20} align="center" style={{ width: '100%', maxWidth: '1200px' }}>
                
                {/* 1. PRODUCER */}
                <Stack align="center" gap="md">
                  <Text fw={700} size="lg">Producer</Text>
                  <Box>
                    <Box
                      component="img"
                      src={ProducerImg}
                      alt="Producer Laptop"
                      style={{ width: '96px', height: 'auto', objectFit: 'contain' }}
                    />
                  </Box>
                </Stack>

                {/* Line -> Job Queue -> Line */}
                <Group gap={0} style={{ flex: 1, alignItems: 'center' }}>
                  <Box style={{ height: '2px', backgroundColor: '#d1d5db', flex: 1 }} />
                  <Paper 
                    px="xl" 
                    py="sm" 
                    radius="sm"
                    style={{ border: '2px solid #e5e7eb', minWidth: '120px', textAlign: 'center' }}
                  >
                    <Text fw={700} c="gray.7" style={{ whiteSpace: 'nowrap' }}>Job queue</Text>
                  </Paper>
                  <Box style={{ height: '2px', backgroundColor: '#d1d5db', flex: 1 }} />
                </Group>

                {/* 2. CONSUMERS */}
                <Stack align="center" gap="md">
                  <Text fw={700} size="lg">Consumers</Text>
                  <Box
                    component="img"
                    src={ConsumerImg}
                    alt="Consumer Servers"
                    style={{ width: '128px', height: 'auto', objectFit: 'contain' }}
                  />
                </Stack>

                {/* Line -> Refill Queue -> Line */}
                <Group gap={0} style={{ flex: 1, alignItems: 'center' }}>
                  <Box style={{ height: '2px', backgroundColor: '#d1d5db', flex: 1 }} />
                  <Paper 
                    px="xl" 
                    py="sm" 
                    radius="sm"
                    style={{ border: '2px solid #e5e7eb', minWidth: '120px', textAlign: 'center' }}
                  >
                    <Text fw={700} c="gray.7" style={{ whiteSpace: 'nowrap' }}>Refill queue</Text>
                  </Paper>
                  <Box style={{ height: '2px', backgroundColor: '#d1d5db', flex: 1 }} />
                </Group>

                {/* 3. PAPER REFILLER */}
                <Stack align="center" gap="md">
                  <Text fw={700} size="lg" ta="center" style={{ lineHeight: 1.2 }}>
                    Paper Refiller
                  </Text>
                  <Box
                    component="img"
                    src={RefillerImg}
                    alt="Paper Refiller"
                    style={{ width: '128px', height: 'auto', objectFit: 'contain' }}
                  />
                </Stack>

              </Group>
          </Paper>
        )}

        {/* Statistics Section */}
        {config.showSimulationStats && (
          <Paper shadow="sm" p="xl" radius="lg" style={{ border: '1px solid #e9ecef' }}>
            <Title order={3} size="xl" mb="xl" fw={700}>Statistics</Title>
            
            <Grid gutter="xl" justify="center">
              <Grid.Col span="auto">
                <StatItem label="Jobs processed" value={stats.totalJobsProcessed} />
              </Grid.Col>
              <Grid.Col span="auto">
                <StatItem label="Jobs received" value={stats.totalJobsProcessed + stats.queueLength} />
              </Grid.Col>
              <Grid.Col span="auto">
                <StatItem label="Queue length" value={stats.queueLength} isDanger={stats.queueLength > 10} />
              </Grid.Col>
              <Grid.Col span="auto">
                <StatItem label="Avg completion (ms)" value={stats.avgJobCompletionTime.toFixed(2)} isDanger={stats.avgJobCompletionTime > 20} />
              </Grid.Col>
              <Grid.Col span="auto">
                <StatItem label="Papers used" value={0} />
              </Grid.Col>
              <Grid.Col span="auto">
                <StatItem label="Refill events" value={0} />
              </Grid.Col>
              <Grid.Col span="auto">
                <StatItem label="Avg service (ms)" value={`${stats.avgJobCompletionTime.toFixed(0)}`} />
              </Grid.Col>
            </Grid>
          </Paper>
        )}
      </Box>

      {/* ================= RIGHT PANEL: EVENT LOGS ================= */}
      {config.showLogs && (
        <Box style={{ width: '400px', backgroundColor: '#333333', color: 'white', display: 'flex', flexDirection: 'column', height: '100vh', boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.3)' }}>
          <Box p="xl" style={{ borderBottom: '1px solid #4b5563' }}>
            <Title order={2} size="xl" fw={700} c="white">Event Logs</Title>
          </Box>
          
          <Box style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
            <Stack gap="md" ff="monospace" fz="sm" style={{ opacity: 0.9 }}>
              {events.length === 0 ? (
                <Text c="gray.5">No events yet...</Text>
              ) : (
                events.map((event, index) => (
                  <Group key={index} gap="xs" align="flex-start" wrap="nowrap">
                    <Text c="gray.5" style={{ whiteSpace: 'nowrap' }}>
                      {config.showTime ? new Date(event.timestamp).toLocaleTimeString() : `${event.timestamp}ms`}:
                    </Text>
                    <Text c="white">{event.type} - {JSON.stringify(event.data)}</Text>
                  </Group>
                ))
              )}
              <Box h={40} />
            </Stack>
          </Box>
        </Box>
      )}

    </Box>
  );
};

// --- Helper Component for Stats ---
const StatItem = ({ label, value, isDanger = false }: { label: string, value: string | number, isDanger?: boolean }) => (
  <Stack align="center" gap={4}>
    <Text 
      size="xs" 
      fw={600} 
      c="gray.6" 
      tt="uppercase" 
      ta="center"
      style={{ letterSpacing: '0.05em', height: '2rem', display: 'flex', alignItems: 'flex-end', paddingBottom: '0.25rem' }}
    >
      {label}
    </Text>
    <Text size="xl" fw={700} c={isDanger ? 'red.5' : 'black'}>
      {value}
    </Text>
  </Stack>
);

export default Simulation;
