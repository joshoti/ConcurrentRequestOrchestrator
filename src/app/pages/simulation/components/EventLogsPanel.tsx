import React, { useEffect, useRef } from 'react';
import { Box, Title, Stack, Text } from '@mantine/core';
import { LogEvent } from '../../../api/api';

interface EventLogsPanelProps {
  events: LogEvent[];
  showTime: boolean;
}

// Helper to format timestamp with leading zeros for alignment
const formatTimestamp = (ms: number): string => {
  const formatted = ms.toFixed(3).padStart(12, '0');
  return formatted + 'ms';
};

export const EventLogsPanel: React.FC<EventLogsPanelProps> = ({ events, showTime }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    <Box style={{ width: '400px', backgroundColor: '#333333', color: 'white', display: 'flex', flexDirection: 'column', height: '100vh', boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.3)' }}>
      <Box p="xl" style={{ borderBottom: '1px solid #4b5563' }}>
        <Title order={2} size="xl" fw={700} c="white">Event Logs</Title>
      </Box>
      
      <Box style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        <Stack gap="0" ff="monospace" fz="sm" style={{ opacity: 0.9 }}>
          {events.length === 0 ? (
            <Text c="gray.5">No events yet...</Text>
          ) : (
            events.map((event, index) => (
              <Box key={index}>
                <Text c="white" style={{ lineHeight: 1.6, padding: '0.5rem 0' }}>
                  {showTime && `${formatTimestamp(event.timestamp)}: `}
                  {event.message}
                </Text>
                {index < events.length - 1 && (
                  <Box style={{ 
                    height: '1px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    margin: '0.25rem 0'
                  }} />
                )}
              </Box>
            ))
          )}
          <div ref={bottomRef} />
        </Stack>
      </Box>
    </Box>
  );
};
