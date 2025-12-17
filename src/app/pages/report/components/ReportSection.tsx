import React from 'react';
import { Paper, Box, Group, Stack, Text, Title, Divider } from '@mantine/core';
import { ReportSectionData } from '../types';

export const ReportSection: React.FC<ReportSectionData> = ({ title, imageSrc, icon, stats }) => {
  return (
    <Paper shadow="sm" p="xl" radius="lg" mb="xl" style={{ border: '1px solid #e9ecef' }}>
      <Group align="flex-start" gap="xl" wrap="nowrap">
        {/* Left: Image and Title (Sticky) */}
        <Stack align="center" gap="md" style={{ minWidth: '160px', position: 'sticky', top: '2rem', alignSelf: 'flex-start' }}>
          <Title order={2} size="xl" fw={700} c="gray.9" ta="center" style={{ whiteSpace: 'pre-line' }}>
            {title}
          </Title>
          <Box
            component="img"
            src={imageSrc}
            alt={title}
            style={{ width: '160px', height: 'auto', objectFit: 'contain' }}
          />
        </Stack>

        {/* Right: Statistics List */}
        <Stack gap={0} style={{ flex: 1 }}>
          {stats.map((stat, index) => (
            <React.Fragment key={index}>
              <Group justify="space-between" py="md" wrap="nowrap">
                <Text 
                  size="sm" 
                  fw={600}
                  c="gray.8"
                >
                  {stat.label}
                </Text>
                <Text size="sm" fw={700} c="gray.9">
                  {stat.value}
                </Text>
              </Group>
              {index < stats.length - 1 && <Divider color="gray.2" />}
            </React.Fragment>
          ))}
        </Stack>
      </Group>
    </Paper>
  );
};
