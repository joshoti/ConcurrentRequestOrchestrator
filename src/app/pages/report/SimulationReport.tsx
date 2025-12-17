import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Box, Group, Button } from '@mantine/core';
import { ReportSection } from './components/ReportSection';
import { REPORT_DATA } from './data';

const SimulationReport: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <Container size="md">
        {/* Main Page Title */}
        <Title order={1} size="2.5rem" fw={700} c="gray.9" ta="center" mb="xl">
          Simulation Report
        </Title>

        {/* Render each report section */}
        {REPORT_DATA.map((section, index) => (
          <ReportSection key={index} {...section} />
        ))}

        {/* "Go to home" Button */}
        <Group justify="center" mt="xl">
          <Button
            onClick={() => navigate('/')}
            size="lg"
            radius="xl"
            color="dark"
            fw={600}
            px="xl"
            style={{ boxShadow: '1px 5px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.06)' }}
          >
            Go to home
          </Button>
        </Group>
      </Container>
    </Box>
  );
};

export default SimulationReport;