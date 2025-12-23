import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Title, Box, Group, Button } from '@mantine/core';
import { ReportSection } from './components/ReportSection';
import { REPORT_DATA } from './data';
import { ReportSectionData } from './types';
import WatchImg from '../../assets/images/patek.webp';
import ConsumerImg from '../../assets/images/consumer-picture.jpg';
import ProducerImg from '../../assets/images/producer-picture.png';

// Backend statistics structure
interface PrinterStats {
  id: number;
  jobs_served: number;
  paper_used: number;
  avg_service_time_sec: number;
  utilization: number;
}

interface BackendStatistics {
  simulation_duration_sec: number;
  total_jobs_arrived: number;
  total_jobs_served: number;
  total_jobs_dropped: number;
  total_jobs_removed: number;
  job_arrival_rate_per_sec: number;
  job_drop_probability: number;
  avg_inter_arrival_time_sec: number;
  avg_system_time_sec: number;
  system_time_std_dev_sec: number;
  avg_queue_wait_time_sec: number;
  avg_queue_length: number;
  max_queue_length: number;
  printers: PrinterStats[];
  paper_refill_events: number;
  total_refill_service_time_sec: number;
  papers_refilled: number;
}

const SimulationReport: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get statistics from navigation state
  const statistics = (location.state as { statistics?: BackendStatistics })?.statistics;

  // Transform backend data into report sections
  const reportData = useMemo((): ReportSectionData[] => {
    if (!statistics) {
      // Use dummy data if no statistics provided
      return REPORT_DATA;
    }

    // System Timing Section
    const systemTimingSection: ReportSectionData = {
      title: 'System Timing',
      imageSrc: WatchImg,
      stats: [
        { label: 'Simulation Duration', value: `${statistics.simulation_duration_sec.toFixed(1)} sec` },
        { label: 'Average Inter-arrival Time', value: `${statistics.avg_inter_arrival_time_sec.toFixed(3)} sec` },
        { label: 'Average System Time', value: `${statistics.avg_system_time_sec.toFixed(2)} sec` },
        { label: 'System Time Standard Deviation', value: `${statistics.system_time_std_dev_sec.toFixed(2)} sec` },
        { label: 'Average Queue Wait Time', value: `${statistics.avg_queue_wait_time_sec.toFixed(2)} sec` },
      ],
    };

    // Consumer Performance Section - dynamically add stats for each printer
    const consumerStats = statistics.printers.flatMap((printer) => [
      { label: `Jobs Served by Printer ${printer.id}`, value: `${printer.jobs_served}` },
      { label: `Total Paper Used by Printer ${printer.id}`, value: `${printer.paper_used}` },
      { label: `Avg Service Time (Printer ${printer.id})`, value: `${printer.avg_service_time_sec.toFixed(2)} sec` },
      { label: `Utilization (Printer ${printer.id})`, value: `${(printer.utilization * 100).toFixed(1)}%` },
    ]);

    // Add overall consumer stats
    consumerStats.push(
      { label: 'Paper Refill Events', value: `${statistics.paper_refill_events}` },
      { label: 'Total Refill Service Time', value: `${statistics.total_refill_service_time_sec.toFixed(2)} sec` },
      { label: 'Total Papers Refilled', value: `${statistics.papers_refilled}` },
    );

    const consumerSection: ReportSectionData = {
      title: 'Consumer\nPerformance',
      imageSrc: ConsumerImg,
      stats: consumerStats,
    };

    // Job Flow Stats Section
    const jobFlowSection: ReportSectionData = {
      title: 'Job Flow Stats',
      imageSrc: ProducerImg,
      stats: [
        { label: 'Total Jobs Arrived', value: `${statistics.total_jobs_arrived}` },
        { label: 'Total Jobs Served', value: `${statistics.total_jobs_served}` },
        { label: 'Total Jobs Dropped', value: `${statistics.total_jobs_dropped}` },
        { label: 'Total Jobs Removed', value: `${statistics.total_jobs_removed}` },
        { label: 'Job Arrival Rate (λ)', value: `${statistics.job_arrival_rate_per_sec.toFixed(3)} jobs/sec` },
        { label: 'Job Drop Probability', value: `${statistics.total_jobs_dropped} (${(statistics.job_drop_probability * 100).toFixed(2)}%)` },
        { label: 'Average Queue Length', value: `${statistics.avg_queue_length.toFixed(2)}` },
        { label: 'Max Queue Length', value: `${statistics.max_queue_length}` },
      ],
    };

    return [systemTimingSection, consumerSection, jobFlowSection];
  }, [statistics]);

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <Container size="md">
        {/* Main Page Title */}
        <Title order={1} size="2.5rem" fw={700} c="gray.9" ta="center" mb="xl">
          Simulation Report
        </Title>

        {/* Render each report section */}
        {reportData.map((section, index) => (
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