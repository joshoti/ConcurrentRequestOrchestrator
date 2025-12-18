import React from 'react';
import { Paper, Group, Box, Stack, Text } from '@mantine/core';
import ProducerImg from '../../../assets/images/producer-picture.png';
import ConsumerImg from '../../../assets/images/consumer-picture.jpg';
import RefillerImg from '../../../assets/images/refiller-picture.png';
import '../Simulation.css';

export const SimulationVisualization: React.FC = () => {
  return (
    <Paper shadow="sm" radius="lg" className="simulation-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            style={{ width: '110px', height: 'auto', objectFit: 'contain' }}
          />
        </Stack>

      </Group>
    </Paper>
  );
};
