import React from 'react';
import { Paper, Title, Stack, Group, Box, Text } from '@mantine/core';
import QueueHeadArrow from '../../../assets/images/queue-head.png'
import { Image } from '@mantine/core';

interface Job {
  id: number;
  pages: number;
}

interface QueueDisplayProps {
  jobs: Job[];
}

export const QueueDisplay: React.FC<QueueDisplayProps> = ({ jobs }) => {
  const displayJobs = jobs.slice(0, 8).reverse(); // Show first 8 jobs

  return (
    <Paper shadow="sm" p="xl" radius="lg" style={{ border: '1px solid #e9ecef', height: '100%' }}>
      <Group mb="md" gap="md" justify="space-between">
        <Title order={3} size="xl" fw={700}>Job Queue</Title>
        {displayJobs.length > 0 && (
          <Image
            src={QueueHeadArrow}
            alt="Queue Head Arrow"
            h={28}
            w="auto"
            fit="contain"
          />
        )}
      </Group>
      
      <Group gap="xs" wrap="wrap" justify="flex-end">
        {displayJobs.length === 0 ? (
          <Text c="dimmed" size="sm">No jobs in queue</Text>
        ) : (
          displayJobs.map((job, index) => (
            <Box
              key={job.id}
              p="xs"
              style={{
                border: index === displayJobs.length - 1 ? '2px solid #868e96' : '2px solid #dee2e6',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                textAlign: 'center'
              }}
            >
              <Text fw={700} size="sm" c="gray.9" mb={10}>Job{job.id}</Text>
              <Text size="xs" c="gray.6">{job.pages}<br />pages</Text>
            </Box>
          ))
        )}
      </Group>
    </Paper>
  );
};
