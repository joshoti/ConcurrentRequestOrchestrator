import React from 'react';
import { Paper, Title, Grid } from '@mantine/core';
import { SimulationStats } from '../../../api/api';
import { STATS_THRESHOLDS } from '../constants';
import { StatItem } from './StatItem';

interface SimulationStatsDisplayProps {
  stats: SimulationStats;
}

export const SimulationStatsDisplay: React.FC<SimulationStatsDisplayProps> = ({ stats }) => {
  return (
    <Paper shadow="sm" radius="lg" className="simulation-card">
      <Title order={3} size="lg" mb="lg" fw={700}>Statistics</Title>
      
      <Grid gutter="xl" justify="center">
        <Grid.Col span="auto">
          <StatItem label="Jobs processed" value={stats.jobsProcessed} />
        </Grid.Col>
        <Grid.Col span="auto">
          <StatItem label="Jobs received" value={stats.jobsReceived} />
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
            label="Avg completion (s)" 
            value={(stats.avgCompletionTime / 1000).toFixed(2)} 
            isDanger={stats.avgCompletionTime > STATS_THRESHOLDS.AVG_COMPLETION_DANGER * 1000} 
          />
        </Grid.Col>
        <Grid.Col span="auto">
          <StatItem label="Papers used" value={stats.papersUsed} />
        </Grid.Col>
        <Grid.Col span="auto">
          <StatItem label="Refill events" value={stats.refillEvents} />
        </Grid.Col>
        <Grid.Col span="auto">
          <StatItem label="Avg service (s)" value={`${(stats.avgServiceTime / 1000).toFixed(2)}`} />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};
