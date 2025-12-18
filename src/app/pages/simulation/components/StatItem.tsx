import React from 'react';
import { Stack, Text } from '@mantine/core';

interface StatItemProps {
  label: string;
  value: string | number;
  isDanger?: boolean;
}

export const StatItem: React.FC<StatItemProps> = ({ label, value, isDanger = false }) => (
  <Stack align="center" gap={2}>
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
