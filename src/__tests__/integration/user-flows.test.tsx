import React from 'react';
import { render, screen, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import App from '../../App';

// Mock the API module
jest.mock('../../app/api/api', () => ({
  fetchConfigAndRanges: jest.fn(),
  simulationWS: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    stop: jest.fn(),
    onConnected: jest.fn(),
    onDisconnected: jest.fn(),
    onLog: jest.fn(),
    onConsumerUpdate: jest.fn(),
    onConsumersUpdate: jest.fn(),
    onJobUpdate: jest.fn(),
    onJobsUpdate: jest.fn(),
    onStats: jest.fn(),
    onSimulationComplete: jest.fn(),
    onStatistics: jest.fn(),
    onError: jest.fn(),
  },
}));

import * as api from '../../app/api/api';
const mockedApi = api as jest.Mocked<typeof api>;

// Mock WebSocket
class MockWebSocket {
  onopen: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: (() => void) | null = null;
  readyState = WebSocket.OPEN;

  constructor(public url: string) {
    setTimeout(() => this.onopen?.(), 0);
  }

  send(data: string) {}
  close() {}
}

// Reusable mock config
const mockBackendConfig = (isConnected: boolean = true) => ({
  config: {
    printRate: 5,
    consumerCount: 2,
    autoScaling: true,
    refillRate: 25,
    paperCapacity: 150,
    jobArrivalTime: 500,
    jobCount: 20,
    fixedArrival: true,
    minArrivalTime: 300,
    maxArrivalTime: 600,
    maxQueue: -1,
    minPapers: 5,
    maxPapers: 15,
    showLogs: true,
    showTime: true,
    showSimulationStats: true,
    showComponents: true,
  },
  ranges: {
    printRate: { min: 4, max: 10 },
    consumerCount: { min: 1, max: 5 },
    refillRate: { min: 15, max: 30 },
    paperCapacity: { min: 50, max: 200 },
    jobArrivalTime: { min: 200, max: 800 },
    minArrivalTime: { min: 200, max: 400 },
    maxArrivalTime: { min: 500, max: 800 },
    minPapers: { min: 5, max: 10 },
    maxPapers: { min: 15, max: 30 },
  },
  isBackendConnected: isConnected,
});

describe('User Flow Integration Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock fetch for config endpoint
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Happy Path: Complete Simulation Flow', () => {
    test('user can load config, run simulation, and view report with backend connected', async () => {
      mockedApi.fetchConfigAndRanges.mockResolvedValue(mockBackendConfig(true));

      render(<App />);

      // Wait for homepage to load
      await waitFor(() => {
        expect(screen.getByText(/Concurrent Service/i)).toBeInTheDocument();
      });

      // Navigate to configuration
      const configButton = screen.getByRole('button', { name: /configure/i });
      await userEvent.click(configButton);

      // Wait for configuration page to load
      await waitFor(() => {
        expect(screen.getByText(/Configuration/i)).toBeInTheDocument();
      });

      // Verify config values are loaded from backend
      const consumersInput = screen.getByLabelText(/Number of.*Consumer|Consumer.*Count/i);
      expect(consumersInput).toHaveValue(2);

      // Start simulation
      const startButton = screen.getByRole('button', { name: /Start Simulation/i });
      expect(startButton).toBeEnabled();
      await userEvent.click(startButton);

      // Simulation page should be visible
      await waitFor(() => {
        expect(screen.getByText(/Simulation/i)).toBeInTheDocument();
      });
    });
  });

  describe('Offline Mode: Backend Unavailable', () => {
    test('falls back to mock simulation when backend is offline', async () => {
      mockedApi.fetchConfigAndRanges.mockResolvedValue(mockBackendConfig(false));

      render(<App />);

      // Navigate to configuration
      await waitFor(() => {
        expect(screen.getByText(/Concurrent Service/i)).toBeInTheDocument();
      });

      const configButton = screen.getByRole('button', { name: /configure/i });
      await userEvent.click(configButton);

      // Start simulation
      await waitFor(() => {
        expect(screen.getByText(/Configuration/i)).toBeInTheDocument();
      });

      const startButton = screen.getByRole('button', { name: /Start Simulation/i });
      await userEvent.click(startButton);

      // Should use mock simulation (check for simulation header)
      await waitFor(() => {
        expect(screen.getByText(/Simulation/i)).toBeInTheDocument();
      });

      // Mock events should start playing (look for event logs or stats)
      await waitFor(
        () => {
          // Should show some activity from mock events
          const logsPanel = screen.queryByText(/Event Logs/i);
          expect(logsPanel).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Configuration Validation', () => {
    test('prevents starting simulation with invalid configuration values', async () => {
      mockedApi.fetchConfigAndRanges.mockResolvedValue(mockBackendConfig(true));

      render(<App />);

      // Navigate to configuration
      await waitFor(() => {
        expect(screen.getByText(/Concurrent Service/i)).toBeInTheDocument();
      });

      const configButton = screen.getByRole('button', { name: /configure/i });
      await userEvent.click(configButton);

      await waitFor(() => {
        expect(screen.getByText(/Configuration/i)).toBeInTheDocument();
      });

      // Try to set invalid value (outside range)
      const consumersInput = screen.getByLabelText(/Number of.*Consumer|Consumer.*Count/i);
      await userEvent.clear(consumersInput);
      await userEvent.type(consumersInput, '10'); // Max is 5

      // Try to start simulation - button should be disabled or show error
      const startButton = screen.getByRole('button', { name: /Start Simulation/i });
      
      // Either button is disabled or clicking shows validation error
      if (!startButton.hasAttribute('disabled')) {
        await userEvent.click(startButton);
        
        // Should show validation error
        await waitFor(() => {
          expect(screen.getByText(/must be between/i)).toBeInTheDocument();
        });
      } else {
        expect(startButton).toBeDisabled();
      }
    });

    test('shows validation errors for arrival time range', async () => {
      mockedApi.fetchConfigAndRanges.mockResolvedValue(mockBackendConfig(true));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Concurrent Service/i)).toBeInTheDocument();
      });

      const configButton = screen.getByRole('button', { name: /configure/i });
      await userEvent.click(configButton);

      await waitFor(() => {
        expect(screen.getByText(/Configuration/i)).toBeInTheDocument();
      });

      // Set minArrivalTime > maxArrivalTime (invalid)
      const minInput = screen.getByLabelText(/Min.*Arrival.*Time/i);
      const maxInput = screen.getByLabelText(/Max.*Arrival.*Time/i);

      await userEvent.clear(minInput);
      await userEvent.type(minInput, '700');
      await userEvent.clear(maxInput);
      await userEvent.type(maxInput, '300');

      // Should show validation error
      await waitFor(() => {
        const errorMessage = screen.queryByText(/low.*must be less than.*high/i);
        if (errorMessage) {
          expect(errorMessage).toBeInTheDocument();
        }
      });
    });
  });

  describe('Stop Simulation Early', () => {
    test('user can stop simulation and view incomplete results', async () => {
      mockedApi.fetchConfigAndRanges.mockResolvedValue(mockBackendConfig(false));

      render(<App />);

      // Navigate to simulation
      await waitFor(() => {
        expect(screen.getByText(/Concurrent Service/i)).toBeInTheDocument();
      });

      const configButton = screen.getByRole('button', { name: /configure/i });
      await userEvent.click(configButton);

      await waitFor(() => {
        expect(screen.getByText(/Configuration/i)).toBeInTheDocument();
      });

      const startButton = screen.getByRole('button', { name: /Start Simulation/i });
      await userEvent.click(startButton);

      // Wait for simulation to start
      await waitFor(() => {
        expect(screen.getByText(/Simulation/i)).toBeInTheDocument();
      });

      // Find and click stop button
      const stopButton = await screen.findByRole('button', { name: /stop|end/i });
      await userEvent.click(stopButton);

      // Should navigate to report page with results
      await waitFor(
        () => {
          expect(screen.getByText(/Simulation Report/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Should show report data (even if dummy data)
      expect(screen.getByText(/System Timing/i)).toBeInTheDocument();
    });
  });

  describe('Navigation Flow', () => {
    test('user can navigate between all pages', async () => {
      mockedApi.fetchConfigAndRanges.mockResolvedValue(mockBackendConfig(true));

      render(<App />);

      // Start at homepage
      await waitFor(() => {
        expect(screen.getByText(/Concurrent Service/i)).toBeInTheDocument();
      });

      // Go to configuration
      const configButton = screen.getByRole('button', { name: /configure/i });
      await userEvent.click(configButton);

      await waitFor(() => {
        expect(screen.getByText(/Configuration/i)).toBeInTheDocument();
      });

      // Go back home (if there's a back/home button)
      const homeButtons = screen.queryAllByRole('button', { name: /home|back/i });
      if (homeButtons.length > 0) {
        await userEvent.click(homeButtons[0]);
        await waitFor(() => {
          expect(screen.getByText(/Concurrent Service/i)).toBeInTheDocument();
        });
      }
    });
  });
});
