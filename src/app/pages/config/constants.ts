import { SimulationConfigState, ValidationRanges } from './types';

export const DEFAULTS: SimulationConfigState = {
  // Consumers
  printRate: 5,
  consumerCount: 2,
  autoScaling: false,
  refillRate: 0.05,
  paperCapacity: 200,
  paperCount: 50,
  // Producers
  jobSpeed: 100,
  jobCount: 10,
  fixedArrival: false,
  maxQueue: -1,
  minPapers: 5,
  maxPapers: 15
};

export const RANGES: ValidationRanges = {
  printRate: { min: 4, max: 10 },
  consumerCount: { min: 1, max: 5 },
  refillRate: { min: 0.05, max: 1 },
  paperCapacity: { min: 50, max: 200 },
  paperCount: { min: 1, max: 100 },
  jobSpeed: { min: 1, max: 300 },
  minPapers: { min: 5, max: 10 },
  maxPapers: { min: 15, max: 30 },
};
