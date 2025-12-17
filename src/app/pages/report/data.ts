import { ReportSectionData } from './types';
import WatchImg from '../../assets/images/patek.webp';
import ConsumerImg from '../../assets/images/consumer-picture.jpg';
import ProducerImg from '../../assets/images/producer-picture.png';

export const REPORT_DATA: ReportSectionData[] = [
  {
    title: 'System Timing',
    imageSrc: WatchImg,
    stats: [
      { label: 'Simulation Duration', value: '38.4 sec' },
      { label: 'Average Inter-arrival Time', value: '0.635 sec' },
      { label: 'Average System Time', value: '12.8 sec' },
      { label: 'System Time Standard Deviation', value: '0 sec' },
      { label: 'Average Queue Wait Time', value: '9.93 sec' },
    ],
  },
  {
    title: 'Consumer\nPerformance',
    imageSrc: ConsumerImg,
    stats: [
      { label: 'Jobs Served by Printer 1', value: '10' },
      { label: 'Total Paper Used by Printer 1', value: '128' },
      { label: 'Jobs Served by Printer 2', value: '10' },
      { label: 'Total Paper Used by Printer 2', value: '104' },
      { label: 'Avg Service Time (Printer 1)', value: '3.2 sec' },
      { label: 'Avg Service Time (Printer 2)', value: '2.6 sec' },
      { label: 'Utilization (Printer 1)', value: '83%' },
      { label: 'Utilization (Printer 2)', value: '67.5%' },
      { label: 'Paper Refill Events', value: '4' },
      { label: 'Total Refill Service Time', value: '12 sec' },
      { label: 'Total Papers Refilled', value: '210' },
    ],
  },
  {
    title: 'Job Flow Stats',
    imageSrc: ProducerImg,
    stats: [
      { label: 'Total Jobs Arrived', value: '20' },
      { label: 'Total Jobs Served', value: '20' },
      { label: 'Total Jobs Dropped', value: '0' },
      { label: 'Total Jobs Removed', value: '0' },
      { label: 'Job Arrival Rate (λ)', value: '0.519 jobs/sec' },
      { label: 'Job Drop Probability', value: '0 (0.00%)' },
      { label: 'Average Queue Length', value: '16.51' },
      { label: 'Max Queue Length', value: '24' },
    ],
  },
];
