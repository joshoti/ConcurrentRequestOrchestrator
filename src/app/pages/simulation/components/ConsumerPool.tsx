import React from 'react';
import { Paper, Title, Stack, Group, Box, Text } from '@mantine/core';

export type ConsumerStatus = 'serving' | 'waiting_refill' | 'idle';

interface Consumer {
  id: number;
  papersLeft: number;
  status: ConsumerStatus; // Backend determines this
}

interface ConsumerPoolProps {
  consumers: Consumer[];
}

export const ConsumerPool: React.FC<ConsumerPoolProps> = ({ consumers }) => {
  return (
    <Paper shadow="sm" p="xl" radius="lg" style={{ border: '1px solid #e9ecef', height: '100%' }}>
      <Title order={3} size="xl" mb="md" fw={700}>Consumer Pool</Title>
      
      <Group gap="xs" wrap="wrap">
        {consumers.length === 0 ? (
          <Text c="dimmed" size="sm">No active consumers</Text>
        ) : (
          consumers.map((consumer) => {
            // Determine styling based on backend-provided status
            const getConsumerStyle = (status: ConsumerStatus) => {
              switch (status) {
                case 'waiting_refill':
                  return { bg: '#c92a2a', text: 'Waiting\nfor\nrefill' }; // Dark red
                case 'serving':
                  return { bg: '#18426aff', text: `${consumer.papersLeft}\npapers\nleft` }; // Dark blue
                default:
                  return { bg: '#18426aff', text: `${consumer.papersLeft}\npapers\nleft` };
              }
            };

            const style = getConsumerStyle(consumer.status);
            
            return (
              <Box
                key={consumer.id}
                p="xs"
                style={{
                  borderRadius: '8px',
                  backgroundColor: style.bg,
                  textAlign: 'center',
                  transition: 'background-color 0.3s ease'
                }}
              >
                <Text fw={700} size="sm" c="white" mb={10}>C {consumer.id}</Text>
                <Text size="xs" c="white" opacity={0.9} style={{ whiteSpace: 'pre-line' }}>
                  {style.text}
                </Text>
              </Box>
            );
          })
        )}
      </Group>
    </Paper>
  );
};
