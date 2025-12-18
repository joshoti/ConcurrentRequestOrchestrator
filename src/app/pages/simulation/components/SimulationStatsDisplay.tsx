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
            label="Avg completion (s)" 
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
          <StatItem label="Avg service (s)" value={`${stats.avgJobCompletionTime.toFixed(2)}`} />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};
