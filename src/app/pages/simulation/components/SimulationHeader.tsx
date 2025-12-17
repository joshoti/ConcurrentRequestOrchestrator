import React from 'react';
import { Group, Title, Badge } from '@mantine/core';
import { IconPower } from '@tabler/icons-react';

interface SimulationHeaderProps {
  isConnected: boolean;
}

export const SimulationHeader: React.FC<SimulationHeaderProps> = ({ isConnected }) => {
  return (
    <Group justify="space-between" align="center">
      <Title order={1} size="2.5rem" fw={700} c="black">
        Simulation Running
      </Title>
      
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
  );
};
