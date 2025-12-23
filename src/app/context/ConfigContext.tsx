import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SimulationConfigState, ValidationRanges } from '../pages/config/types';
import { DEFAULTS, RANGES } from '../pages/config/constants';
import { fetchConfigAndRanges } from '../api/api';

interface ConfigContextType {
  config: SimulationConfigState;
  setConfig: (config: SimulationConfigState) => void;
  ranges: ValidationRanges;
  isLoading: boolean;
  isBackendConnected: boolean;
  refreshConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SimulationConfigState>(DEFAULTS);
  const [ranges, setRanges] = useState<ValidationRanges>(RANGES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  const refreshConfig = async () => {
    setIsLoading(true);
    try {
      const { config: fetchedConfig, ranges: fetchedRanges, isBackendConnected: connected } = await fetchConfigAndRanges();
      
      setConfig(fetchedConfig);
      setIsBackendConnected(connected);
      
      // Use backend ranges if available, otherwise use frontend RANGES
      if (fetchedRanges) {
        setRanges(fetchedRanges);
      }
    } catch (err) {
      console.error("Failed to fetch config", err);
      setConfig(DEFAULTS);
      setRanges(RANGES);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, setConfig, ranges, isLoading, isBackendConnected, refreshConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
