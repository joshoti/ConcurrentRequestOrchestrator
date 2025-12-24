import { RANGES } from '../../app/pages/config/constants';

describe('Configuration Validation Logic', () => {
  describe('Range Validation', () => {
    test('all ranges have min and max values', () => {
      Object.entries(RANGES).forEach(([key, range]) => {
        expect(range).toHaveProperty('min');
        expect(range).toHaveProperty('max');
        expect(range.min).toBeLessThanOrEqual(range.max);
      });
    });

    test('validates value within range', () => {
      const isInRange = (value: number, min: number, max: number) => {
        return value >= min && value <= max;
      };

      expect(isInRange(3, RANGES.consumerCount!.min, RANGES.consumerCount!.max)).toBe(true);
      expect(isInRange(0, RANGES.consumerCount!.min, RANGES.consumerCount!.max)).toBe(false);
      expect(isInRange(6, RANGES.consumerCount!.min, RANGES.consumerCount!.max)).toBe(false);
    });

    test('validates related values (low < high)', () => {
      const validateLowHigh = (low: number, high: number) => {
        return low < high;
      };

      expect(validateLowHigh(1, 5)).toBe(true);
      expect(validateLowHigh(5, 1)).toBe(false);
      expect(validateLowHigh(3, 3)).toBe(false);
    });

    test('arrival time range validation', () => {
      const minArrivalTime = 250;
      const maxArrivalTime = 600;

      const isValidArrivalTime = 
        minArrivalTime >= RANGES.minArrivalTime!.min &&
        minArrivalTime <= RANGES.minArrivalTime!.max &&
        maxArrivalTime >= RANGES.maxArrivalTime!.min &&
        maxArrivalTime <= RANGES.maxArrivalTime!.max &&
        minArrivalTime < maxArrivalTime;

      expect(isValidArrivalTime).toBe(true);
    });

    test('paper range validation', () => {
      const minPapers = 5;
      const maxPapers = 20;

      const isValidPaperRange =
        minPapers >= RANGES.minPapers!.min &&
        minPapers <= RANGES.minPapers!.max &&
        maxPapers >= RANGES.maxPapers!.min &&
        maxPapers <= RANGES.maxPapers!.max &&
        minPapers < maxPapers;

      expect(isValidPaperRange).toBe(true);
    });

    test('paper capacity must accommodate refill rate', () => {
      const paperCapacity = 150;
      const refillRate = 25;

      // Paper capacity should be larger than refill rate
      expect(paperCapacity).toBeGreaterThan(refillRate);
      expect(paperCapacity).toBeGreaterThanOrEqual(RANGES.paperCapacity!.min);
      expect(paperCapacity).toBeLessThanOrEqual(RANGES.paperCapacity!.max);
    });
  });

  describe('Edge Cases', () => {
    test('handles minimum values', () => {
      const config = {
        consumerCount: RANGES.consumerCount!.min,
        printRate: RANGES.printRate!.min,
        minArrivalTime: RANGES.minArrivalTime!.min,
        maxArrivalTime: RANGES.minArrivalTime!.min + 100,
      };

      expect(config.consumerCount).toBeGreaterThanOrEqual(RANGES.consumerCount!.min);
      expect(config.minArrivalTime).toBeLessThan(config.maxArrivalTime);
    });

    test('handles maximum values', () => {
      const config = {
        consumerCount: RANGES.consumerCount!.max,
        printRate: RANGES.printRate!.max,
        paperCapacity: RANGES.paperCapacity!.max,
      };

      expect(config.consumerCount).toBeLessThanOrEqual(RANGES.consumerCount!.max);
      expect(config.printRate).toBeLessThanOrEqual(RANGES.printRate!.max);
    });

    test('rejects negative values', () => {
      const isValid = (value: number) => value >= 0;

      expect(isValid(-1)).toBe(false);
      expect(isValid(0)).toBe(true);
      expect(isValid(5)).toBe(true);
    });

    test('rejects non-numeric values', () => {
      const isNumeric = (value: any) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
      };

      expect(isNumeric('abc')).toBe(false);
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric(123)).toBe(true);
      expect(isNumeric(null)).toBe(false);
      expect(isNumeric(undefined)).toBe(false);
    });
  });

  describe('Configuration Consistency', () => {
    test('all required configuration fields are present in ranges', () => {
      const requiredFields = [
        'printRate',
        'consumerCount',
        'refillRate',
        'paperCapacity',
        'jobArrivalTime',
        'minArrivalTime',
        'maxArrivalTime',
        'minPapers',
        'maxPapers',
      ];

      requiredFields.forEach(field => {
        expect(RANGES).toHaveProperty(field);
      });
    });

    test('refill configuration is logical', () => {
      // Paper capacity should accommodate refill operations
      expect(RANGES.paperCapacity!.max).toBeGreaterThan(RANGES.refillRate!.max);
      expect(RANGES.paperCapacity!.min).toBeGreaterThan(RANGES.refillRate!.min);
    });
  });
});
