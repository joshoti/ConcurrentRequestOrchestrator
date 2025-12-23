import { ReportSectionData } from './types';
import WatchImg from '../../assets/images/patek.webp';
import ConsumerImg from '../../assets/images/consumer-picture.jpg';
import ProducerImg from '../../assets/images/producer-picture.png';

export const DUMMY_REPORT_DATA: ReportSectionData[] = [
  {
    title: 'System Timing',
    imageSrc: WatchImg,
    stats: [
      { label: 'Simulation Duration', value: '17.6 sec' },
      { label: 'Average Inter-arrival Time', value: '0.214 sec' },
      { label: 'Average System Time', value: '15.3 sec' },
      { label: 'System Time Standard Deviation', value: '0 sec' },
      { label: 'Average Queue Wait Time', value: '11.7 sec' },
    ],
  },
  {
    title: 'Consumer\nPerformance',
    imageSrc: ConsumerImg,
    stats: [
      { label: 'Jobs Served by Printer 1', value: '6' },
      { label: 'Total Paper Used by Printer 1', value: '137' },
      { label: 'Avg Service Time (Printer 1)', value: '4.57 sec' },
      { label: 'Utilization (Printer 1)', value: '84.2%' },
      { label: 'Jobs Served by Printer 2', value: '8' },
      { label: 'Total Paper Used by Printer 2', value: '121' },
      { label: 'Avg Service Time (Printer 2)', value: '3.03 sec' },
      { label: 'Utilization (Printer 2)', value: '74.4%' },
      { label: 'Jobs Served by Printer 3', value: '6' },
      { label: 'Total Paper Used by Printer 3', value: '104' },
      { label: 'Avg Service Time (Printer 3)', value: '3.47 sec' },
      { label: 'Utilization (Printer 3)', value: '63.9%' },
      { label: 'Paper Refill Events', value: '3' },
      { label: 'Total Refill Service Time', value: '9.34 sec' },
      { label: 'Total Papers Refilled', value: '233' },
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
      { label: 'Job Arrival Rate (λ)', value: '0.614 jobs/sec' },
      { label: 'Job Drop Probability', value: '0 (0.00%)' },
      { label: 'Average Queue Length', value: '7.17' },
      { label: 'Max Queue Length', value: '14' },
    ],
  },
];
