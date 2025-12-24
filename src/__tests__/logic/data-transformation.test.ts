import { DUMMY_REPORT_DATA } from '../../app/pages/report/data';

describe('Data Transformation Logic', () => {
  describe('Report Data Generation', () => {
    test('DUMMY_REPORT_DATA has correct structure', () => {
      expect(DUMMY_REPORT_DATA).toHaveLength(3);
      
      // System Timing section
      expect(DUMMY_REPORT_DATA[0].title).toBe('System Timing');
      expect(DUMMY_REPORT_DATA[0].stats).toHaveLength(5);
      expect(DUMMY_REPORT_DATA[0].stats[0]).toHaveProperty('label');
      expect(DUMMY_REPORT_DATA[0].stats[0]).toHaveProperty('value');
      
      // Consumer Performance section
      expect(DUMMY_REPORT_DATA[1].title).toBe('Consumer\nPerformance');
      expect(DUMMY_REPORT_DATA[1].stats.length).toBeGreaterThan(0);
      
      // Job Flow Stats section
      expect(DUMMY_REPORT_DATA[2].title).toBe('Job Flow Stats');
      expect(DUMMY_REPORT_DATA[2].stats).toHaveLength(8);
    });

    test('DUMMY_REPORT_DATA matches backend statistics format', () => {
      const systemTimingLabels = DUMMY_REPORT_DATA[0].stats.map(s => s.label);
      expect(systemTimingLabels).toContain('Simulation Duration');
      expect(systemTimingLabels).toContain('Average Inter-arrival Time');
      expect(systemTimingLabels).toContain('Average System Time');
      expect(systemTimingLabels).toContain('System Time Standard Deviation');
      expect(systemTimingLabels).toContain('Average Queue Wait Time');

      const jobFlowLabels = DUMMY_REPORT_DATA[2].stats.map(s => s.label);
      expect(jobFlowLabels).toContain('Total Jobs Arrived');
      expect(jobFlowLabels).toContain('Total Jobs Served');
      expect(jobFlowLabels).toContain('Total Jobs Dropped');
      expect(jobFlowLabels).toContain('Job Arrival Rate (λ)');
      expect(jobFlowLabels).toContain('Average Queue Length');
      expect(jobFlowLabels).toContain('Max Queue Length');
    });

    test('DUMMY_REPORT_DATA has valid numeric values', () => {
      DUMMY_REPORT_DATA.forEach(section => {
        section.stats.forEach(stat => {
          // Extract numeric part from value (e.g., "32.6 sec" -> "32.6")
          const numericMatch = stat.value.match(/[\d.]+/);
          if (numericMatch) {
            const numericValue = parseFloat(numericMatch[0]);
            expect(numericValue).toBeGreaterThanOrEqual(0);
            expect(numericValue).not.toBeNaN();
          }
        });
      });
    });
  });

  describe('Backend Statistics Transformation', () => {
    test('transforms backend printer stats correctly', () => {
      const mockBackendStats = {
        printers: [
          {
            id: 1,
            jobs_served: 6,
            paper_used: 137,
            avg_service_time_sec: 4.57,
            utilization: 0.842,
          },
          {
            id: 2,
            jobs_served: 8,
            paper_used: 121,
            avg_service_time_sec: 3.03,
            utilization: 0.744,
          },
        ],
      };

      // Simulate transformation
      const printerStats = mockBackendStats.printers.flatMap(printer => [
        { label: `Jobs Served by Printer ${printer.id}`, value: `${printer.jobs_served}` },
        { label: `Total Paper Used by Printer ${printer.id}`, value: `${printer.paper_used}` },
        { label: `Avg Service Time (Printer ${printer.id})`, value: `${printer.avg_service_time_sec.toFixed(2)} sec` },
        { label: `Utilization (Printer ${printer.id})`, value: `${(printer.utilization * 100).toFixed(1)}%` },
      ]);

      expect(printerStats).toHaveLength(8); // 4 stats * 2 printers
      expect(printerStats[0]).toEqual({
        label: 'Jobs Served by Printer 1',
        value: '6',
      });
      expect(printerStats[3]).toEqual({
        label: 'Utilization (Printer 1)',
        value: '84.2%',
      });
    });

    test('handles variable number of printers', () => {
      const createPrinterStats = (numPrinters: number) => {
        const printers = Array.from({ length: numPrinters }, (_, i) => ({
          id: i + 1,
          jobs_served: 5,
          paper_used: 100,
          avg_service_time_sec: 3.0,
          utilization: 0.8,
        }));

        return printers.flatMap(printer => [
          { label: `Jobs Served by Printer ${printer.id}`, value: `${printer.jobs_served}` },
          { label: `Total Paper Used by Printer ${printer.id}`, value: `${printer.paper_used}` },
          { label: `Avg Service Time (Printer ${printer.id})`, value: `${printer.avg_service_time_sec.toFixed(2)} sec` },
          { label: `Utilization (Printer ${printer.id})`, value: `${(printer.utilization * 100).toFixed(1)}%` },
        ]);
      };

      expect(createPrinterStats(1)).toHaveLength(4);
      expect(createPrinterStats(3)).toHaveLength(12);
      expect(createPrinterStats(5)).toHaveLength(20);
    });

    test('formats percentages correctly', () => {
      const utilization = 0.63912;
      const formatted = `${(utilization * 100).toFixed(1)}%`;
      expect(formatted).toBe('63.9%');

      const dropProbability = 0;
      const formattedProb = `${(dropProbability * 100).toFixed(2)}%`;
      expect(formattedProb).toBe('0.00%');
    });

    test('formats time values with proper precision', () => {
      const duration = 32.6498;
      expect(duration.toFixed(1)).toBe('32.6');

      const avgTime = 0.2143821;
      expect(avgTime.toFixed(3)).toBe('0.214');

      const serviceTime = 4.567891;
      expect(serviceTime.toFixed(2)).toBe('4.57');
    });
  });
});
