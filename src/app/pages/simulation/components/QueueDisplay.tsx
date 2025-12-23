import React from 'react';
import { Paper, Title, Group, Box, Text } from '@mantine/core';
import QueueHeadArrow from '../../../assets/images/queue-head.png'
import { Image } from '@mantine/core';
import { JobUpdate } from '../../../api/api';
import '../Simulation.css';

interface QueueDisplayProps {
  jobs: JobUpdate[];
}

export const QueueDisplay: React.FC<QueueDisplayProps> = ({ jobs }) => {
  const displayJobs = jobs.slice(0, 8).reverse(); // Show first 8 jobs

  return (
    <Paper shadow="sm" radius="lg" className="simulation-card" style={{ height: '100%' }}>
      <Group mb="md" gap="md" justify="space-between">
        <Title order={3} size="lg" fw={700}>Job Queue</Title>
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
              <Text size="xs" c="gray.6">{job.papersRequired}<br />pages</Text>
            </Box>
          ))
        )}
      </Group>
    </Paper>
  );
};
