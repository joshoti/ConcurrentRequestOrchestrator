import { SimulationConfigState } from '../pages/config/types';
import { DEFAULTS } from '../pages/config/constants';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8080';

// ==================== HTTP API ====================

/**
 * Fetch default configuration from backend
 * Falls back to frontend defaults if backend is unavailable
 */
export const fetchConfig = async (): Promise<SimulationConfigState> => {
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
    return data as SimulationConfigState;
  } catch (error) {
    console.warn('Failed to fetch config from backend, using frontend defaults:', error);
    // Fallback to frontend defaults
    return DEFAULTS;
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

export type SimulationEventType = 
  | 'consumer_created'
  | 'consumer_removed'
  | 'job_created'
  | 'job_assigned'
  | 'job_completed'
  | 'job_failed'
  | 'paper_refilled'
  | 'simulation_started'
  | 'simulation_completed'
  | 'simulation_error'
  | 'stats_update';

export interface SimulationEvent {
  type: SimulationEventType;
  timestamp: number;
  data: any;
}

export interface SimulationStats {
  totalJobsProcessed: number;
  activeConsumers: number;
  queueLength: number;
  avgJobCompletionTime: number;
  failedJobs: number;
}

/**
 * WebSocket connection manager for simulation streaming
 */
export class SimulationWebSocket {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  
  // Event handlers
  private onEventCallback?: (event: SimulationEvent) => void;
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
        this.socket = new WebSocket(`${WS_BASE_URL}/simulate`);

        this.socket.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          
          // Send config to start simulation
          this.send({ type: 'start', config });
          
          if (this.onConnectedCallback) {
            this.onConnectedCallback();
          }
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            
            // Handle different message types
            if (message.type === 'stats_update' && this.onStatsCallback) {
              this.onStatsCallback(message.data);
            } else if (this.onEventCallback) {
              this.onEventCallback(message);
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
          this.attemptReconnect(config);
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
    this.send({ type: 'pause' });
  }

  /**
   * Resume simulation
   */
  resume() {
    this.send({ type: 'resume' });
  }

  /**
   * Stop simulation and disconnect
   */
  disconnect() {
    if (this.socket) {
      this.send({ type: 'stop' });
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Register event handler for simulation events
   */
  onEvent(callback: (event: SimulationEvent) => void) {
    this.onEventCallback = callback;
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
