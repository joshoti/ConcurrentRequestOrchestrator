import React from 'react';
import { Paper, Title, Grid, Stack, Text } from '@mantine/core';
import { SimulationStats } from '../../../api/api';
import { STATS_THRESHOLDS } from '../constants';

interface SimulationStatsDisplayProps {
  stats: SimulationStats;
}

export const SimulationStatsDisplay: React.FC<SimulationStatsDisplayProps> = ({ stats }) => {
  return (
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
          <StatItem 
            label="Queue length" 
            value={stats.queueLength} 
            isDanger={stats.queueLength > STATS_THRESHOLDS.QUEUE_LENGTH_DANGER} 
          />
        </Grid.Col>
        <Grid.Col span="auto">
          <StatItem 
            label="Avg completion (ms)" 
            value={stats.avgJobCompletionTime.toFixed(2)} 
            isDanger={stats.avgJobCompletionTime > STATS_THRESHOLDS.AVG_COMPLETION_DANGER} 
          />
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
