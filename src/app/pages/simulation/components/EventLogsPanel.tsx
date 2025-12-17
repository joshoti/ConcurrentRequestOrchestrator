import React from 'react';
import { Box, Title, Stack, Text, Group } from '@mantine/core';
import { SimulationEvent } from '../../../api/api';

interface EventLogsPanelProps {
  events: SimulationEvent[];
  showTime: boolean;
}

export const EventLogsPanel: React.FC<EventLogsPanelProps> = ({ events, showTime }) => {
  return (
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
                  {showTime ? new Date(event.timestamp).toLocaleTimeString() : `${event.timestamp}ms`}:
                </Text>
                <Text c="white">{event.type} - {JSON.stringify(event.data)}</Text>
              </Group>
            ))
          )}
          <Box h={40} />
        </Stack>
      </Box>
    </Box>
  );
};
