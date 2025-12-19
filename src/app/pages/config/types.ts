// The shape of the full configuration object
export interface SimulationConfigState {
  // Consumers
  printRate: number;
  consumerCount: number;
  autoScaling: boolean;
  refillRate: number;
  paperCapacity: number;
  // Producers
  jobArrivalTime: number;
  jobCount: number;
  fixedArrival: boolean;
  minArrivalTime: number;
  maxArrivalTime: number;
  maxQueue: number;
  minPapers: number;
  maxPapers: number;
  // Interface
  showTime: boolean;
  showSimulationStats: boolean;
  showLogs: boolean;
  showComponents: boolean;
}

// Validation ranges (min/max)
export interface RangeDefinition {
  min: number;
  max: number;
}

// Mapping keys to their ranges (optional, as booleans don't have ranges)
export type ValidationRanges = Partial<Record<keyof SimulationConfigState, RangeDefinition>>;

// Tracking errors: keys match the config, values are error messages
export type FormErrors = Partial<Record<keyof SimulationConfigState, string>>;

// Valid section names for the "Reset Section" logic
export type SectionKey = 'consumers' | 'producers' | 'interface';

// The Cache for Undo logic
export type UndoCache = Record<SectionKey, Partial<SimulationConfigState> | null>;

// Individual field undo cache
export type FieldUndoCache = Partial<Record<keyof SimulationConfigState, number | boolean>>;
