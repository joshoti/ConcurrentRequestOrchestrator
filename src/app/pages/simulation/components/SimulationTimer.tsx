import React from 'react';
import { Paper, Group, Text, Button } from '@mantine/core';

interface SimulationTimerProps {
  time: number;
  onStop: () => void;
}

export const SimulationTimer: React.FC<SimulationTimerProps> = ({ time, onStop }) => {
  return (
    <Paper shadow="sm" p="xl" radius="lg" style={{ border: '1px solid #e9ecef' }}>
      <Group justify="space-between" align="center">
        <Text size="xl" fw={700} c="black" ff="monospace">
          Time: {time.toFixed(4)} s
        </Text>
        <Button 
          onClick={onStop}
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
  );
};
