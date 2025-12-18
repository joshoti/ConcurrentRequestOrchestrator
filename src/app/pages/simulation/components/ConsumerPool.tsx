import React, { useState, useEffect } from 'react';
import { Paper, Title, Stack, Group, Box, Text } from '@mantine/core';
import '../Simulation.css';

export type ConsumerStatus = 'serving' | 'waiting_refill' | 'idle';

interface Consumer {
  id: number;
  papersLeft: number;
  status: ConsumerStatus; // Backend determines this
  currentJobId?: number; // Which job is currently being served
}

interface ConsumerPoolProps {
  consumers: Consumer[];
}

export const ConsumerPool: React.FC<ConsumerPoolProps> = ({ consumers }) => {
  const [showStatus, setShowStatus] = useState(true);

  // Toggle between status and papers every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowStatus(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper shadow="sm" radius="lg" className="simulation-card" style={{ height: '100%' }}>
      <Title order={3} size="lg" mb="md" fw={700}>Consumer Pool</Title>
      
      <Group gap="xs" wrap="wrap">
        {consumers.length === 0 ? (
          <Text c="dimmed" size="sm">No active consumers</Text>
        ) : (
          consumers.map((consumer) => {
            // Determine styling and text based on backend-provided status
            const getConsumerDisplay = (status: ConsumerStatus, showStatus: boolean) => {
              const papersText = `${consumer.papersLeft}\npapers\nleft`;
              
              switch (status) {
                case 'waiting_refill':
                  return { 
                    bg: '#c92a2a', 
                    text: showStatus ? 'Waiting\nfor\nrefill' : papersText
                  };
                case 'serving':
                  const statusText = consumer.currentJobId ? `Serving\nJob\n${consumer.currentJobId}` : 'Serving';
                  return { 
                    bg: '#18426aff', 
                    text: showStatus ? statusText : papersText
                  };
                case 'idle':
                  return { 
                    bg: '#495057', 
                    text: showStatus ? '\n\nIdle' : papersText
                  };
                default:
                  return { 
                    bg: '#495057', 
                    text: papersText
                  };
              }
            };

            const style = getConsumerDisplay(consumer.status, showStatus);
            
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
