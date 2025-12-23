import { SimulationConfigState, ValidationRanges } from '../pages/config/types';
import { DEFAULTS, RANGES } from '../pages/config/constants';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws';

// ==================== HTTP API ====================

/**
 * Fetch configuration and ranges from backend
 * Falls back to frontend defaults if backend is unavailable
 */
export const fetchConfigAndRanges = async (): Promise<{ config: SimulationConfigState; ranges: ValidationRanges }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      config: data.config || DEFAULTS,
      ranges: data.ranges || RANGES
    };
  } catch (error) {
    console.warn('Failed to fetch config from backend, using frontend defaults:', error);
    // Fallback to frontend defaults
    return {
      config: DEFAULTS,
      ranges: RANGES
    };
  }
};

/**
 * Update configuration on backend
 */
export const updateConfig = async (config: SimulationConfigState): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/config/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Failed to update config:', error);
    return false;
  }
};

// ==================== WebSocket API ====================

// ==================== Message Types ====================

// Log event - displayed in EventLogsPanel
export interface LogEvent {
  timestamp: number; // in milliseconds
  message: string;   // formatted message to display
}

// Consumer update - controls ConsumerPool display
export interface ConsumerUpdate {
  id: number;
  papersLeft: number;
  status: 'serving' | 'waiting_refill' | 'idle';
  currentJobId?: number; // Which job is currently being served (null/undefined if idle)
}

// Job update - controls QueueDisplay
export interface JobUpdate {
  id: number;
  papersRequired: number;
}

// Stats update - controls SimulationStatsDisplay
export interface SimulationStats {
  jobsProcessed: number;
  jobsReceived: number;
  queueLength: number;
  avgCompletionTime: number;
  papersUsed: number;
  refillEvents: number;
  avgServiceTime: number;
}

// Final statistics report
export interface FinalStatistics {
  total_jobs_generated: number;
  total_jobs_completed: number;
  total_jobs_dropped: number;
  avg_turnaround_time: number;
  avg_service_time: number;
  avg_queue_wait_time: number;
  total_papers_used: number;
  total_refill_events: number;
  printers_used: {
    [key: string]: {
      jobs_served: number;
      papers_used: number;
      total_service_time: number;
      refill_count: number;
    };
  };
}

// WebSocket message types from backend
export type WebSocketMessage =
  | { type: 'log'; data: LogEvent }
  | { type: 'consumer_update'; data: ConsumerUpdate }
  | { type: 'consumers_update'; data: ConsumerUpdate[] }
  | { type: 'job_update'; data: JobUpdate }
  | { type: 'jobs_update'; data: JobUpdate[] } // Full queue state (jobs waiting in queue only)
  | { type: 'stats_update'; data: SimulationStats }
  | { type: 'simulation_started'; data: { timestamp: number } }
  | { type: 'simulation_complete'; data: { duration: number } }
  | { type: 'statistics'; data: FinalStatistics }
  | { type: 'params'; params: any }; // Configuration parameters from backend

// Legacy export for backwards compatibility
export interface SimulationEvent {
  timestamp: number;
  message: string;
}

/**
 * WebSocket connection manager for simulation streaming
 */
export class SimulationWebSocket {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 1;
  private reconnectDelay = 2000;
  
  // Event handlers
  private onLogCallback?: (log: LogEvent) => void;
  private onConsumerUpdateCallback?: (consumer: ConsumerUpdate) => void;
  private onConsumersUpdateCallback?: (consumers: ConsumerUpdate[]) => void;
  private onJobUpdateCallback?: (job: JobUpdate) => void;
  private onSimulationStartedCallback?: (data: { timestamp: number }) => void;
  private onSimulationCompleteCallback?: (data: { duration: number }) => void;
  private onStatisticsCallback?: (stats: FinalStatistics) => void;
  private onParamsCallback?: (params: any) => void;
  private onJobsUpdateCallback?: (jobs: JobUpdate[]) => void;
  private onStatsCallback?: (stats: SimulationStats) => void;
  private onConnectedCallback?: () => void;
  private onDisconnectedCallback?: () => void;
  private onErrorCallback?: (error: Event) => void;

  /**
   * Connect to WebSocket and start simulation with given config
   */
  connect(config: SimulationConfigState): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(`${WS_BASE_URL}/simulation`);

        this.socket.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          
          // Send config to start simulation
          this.send({ command: 'start', config });
          
          if (this.onConnectedCallback) {
            this.onConnectedCallback();
          }
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            console.log('Received (raw):', event.data);
            
            // Route messages to appropriate handlers
            switch (message.type) {
              case 'log':
                if (this.onLogCallback) this.onLogCallback(message.data);
                break;
              case 'consumer_update':
                if (this.onConsumerUpdateCallback) this.onConsumerUpdateCallback(message.data);
                break;
              case 'consumers_update':
                if (this.onConsumersUpdateCallback) this.onConsumersUpdateCallback(message.data);
                break;
              case 'job_update':
                if (this.onJobUpdateCallback) this.onJobUpdateCallback(message.data);
                break;
              case 'jobs_update':
                if (this.onJobsUpdateCallback) this.onJobsUpdateCallback(message.data);
                break;
              case 'stats_update':
                if (this.onStatsCallback) this.onStatsCallback(message.data);
                break;
              case 'simulation_started':
                console.log('Simulation started:', message.data);
                if (this.onSimulationStartedCallback) this.onSimulationStartedCallback(message.data);
                break;
              case 'simulation_complete':
                console.log('Simulation completed:', message.data);
                if (this.onSimulationCompleteCallback) this.onSimulationCompleteCallback(message.data);
                break;
              case 'statistics':
                console.log('Final statistics:', message.data);
                if (this.onStatisticsCallback) this.onStatisticsCallback(message.data);
                break;
              case 'params':
                console.log('Simulation params:', (message as any).params);
                if (this.onParamsCallback) this.onParamsCallback((message as any).params);
                break;
              default:
                console.warn('Unknown message type:', message);
            }
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          if (this.onErrorCallback) {
            this.onErrorCallback(error);
          }
          reject(error);
        };

        this.socket.onclose = () => {
          console.log('WebSocket disconnected');
          if (this.onDisconnectedCallback) {
            this.onDisconnectedCallback();
          }
          
          // Attempt reconnection
          // this.attemptReconnect(config);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Attempt to reconnect to WebSocket
   */
  private attemptReconnect(config: SimulationConfigState) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
      
      setTimeout(() => {
        this.connect(config);
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  /**
   * Send message through WebSocket
   */
  send(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  /**
   * Pause simulation
   */
  pause() {
    this.send({ command: 'pause' });
  }

  /**
   * Resume simulation
   */
  resume() {
    this.send({ command: 'resume' });
  }

  /**
   * Stop simulation (backend will send final statistics)
   */
  stop() {
    this.send({ command: 'stop' });
  }

  /**
   * Disconnect WebSocket connection
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Register handler for log events (displayed in EventLogsPanel)
   */
  onLog(callback: (log: LogEvent) => void) {
    this.onLogCallback = callback;
  }

  /**
   * Register handler for single consumer update
   */
  onConsumerUpdate(callback: (consumer: ConsumerUpdate) => void) {
    this.onConsumerUpdateCallback = callback;
  }

  /**
   * Register handler for full consumer list update
   */
  onConsumersUpdate(callback: (consumers: ConsumerUpdate[]) => void) {
    this.onConsumersUpdateCallback = callback;
  }

  /**
   * Register handler for single job update
   */
  onJobUpdate(callback: (job: JobUpdate) => void) {
    this.onJobUpdateCallback = callback;
  }

  /**
   * Register handler for simulation started event
   */
  onSimulationStarted(callback: (data: { timestamp: number }) => void) {
    this.onSimulationStartedCallback = callback;
  }

  /**
   * Register handler for simulation complete event
   */
  onSimulationComplete(callback: (data: { duration: number }) => void) {
    this.onSimulationCompleteCallback = callback;
  }

  /**
   * Register handler for final statistics
   */
  onStatistics(callback: (stats: FinalStatistics) => void) {
    this.onStatisticsCallback = callback;
  }

  /**
   * Register handler for simulation parameters
   */
  onParams(callback: (params: any) => void) {
    this.onParamsCallback = callback;
  }

  /**
   * Register handler for full job queue update
   */
  onJobsUpdate(callback: (jobs: JobUpdate[]) => void) {
    this.onJobsUpdateCallback = callback;
  }

  /**
   * Register handler for stats updates
   */
  onStats(callback: (stats: SimulationStats) => void) {
    this.onStatsCallback = callback;
  }

  /**
   * Register handler for connection established
   */
  onConnected(callback: () => void) {
    this.onConnectedCallback = callback;
  }

  /**
   * Register handler for disconnection
   */
  onDisconnected(callback: () => void) {
    this.onDisconnectedCallback = callback;
  }

  /**
   * Register handler for errors
   */
  onError(callback: (error: Event) => void) {
    this.onErrorCallback = callback;
  }

  /**
   * Get current connection state
   */
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export const simulationWS = new SimulationWebSocket();
