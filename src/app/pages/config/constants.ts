import { SimulationConfigState, ValidationRanges } from './types';

export const DEFAULTS: SimulationConfigState = {
  // Consumers
  printRate: 5,
  consumerCount: 2,
  autoScaling: false,
  refillRate: 25,
  paperCapacity: 150,
  paperCount: 50,
  // Producers
  jobSpeed: 500,
  jobCount: 10,
  fixedArrival: true,
  minArrivalTime: 300,
  maxArrivalTime: 600,
  maxQueue: -1,
  minPapers: 5,
  maxPapers: 15
};

export const RANGES: ValidationRanges = {
  printRate: { min: 4, max: 10 },
  consumerCount: { min: 1, max: 5 },
  refillRate: { min: 15, max: 30 },
  paperCapacity: { min: 50, max: 200 },
  paperCount: { min: 1, max: 100 },
  jobSpeed: { min: 200, max: 800 },
  minArrivalTime: { min: 200, max: 400 },
  maxArrivalTime: { min: 500, max: 800 },
  minPapers: { min: 5, max: 10 },
  maxPapers: { min: 15, max: 30 },
};
