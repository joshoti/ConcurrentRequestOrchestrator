import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SimulationConfigState } from '../pages/config/types';
import { DEFAULTS } from '../pages/config/constants';
import { fetchConfig } from '../api/api';

interface ConfigContextType {
  config: SimulationConfigState;
  setConfig: (config: SimulationConfigState) => void;
  isLoading: boolean;
  refreshConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SimulationConfigState>(DEFAULTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshConfig = async () => {
    setIsLoading(true);
    try {
      const fetchedConfig = await fetchConfig();
      setConfig(fetchedConfig);
    } catch (err) {
      console.error("Failed to fetch config", err);
      setConfig(DEFAULTS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, setConfig, isLoading, refreshConfig }}>
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
