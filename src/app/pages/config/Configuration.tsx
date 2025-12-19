import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Box, Loader, Center, Stack, Text } from '@mantine/core';
import './Configuration.css';
import ProducerImg from '../../assets/images/producer-picture.png';
import ConsumerImg from '../../assets/images/consumer-picture.jpg';
import InterfaceImg from '../../assets/images/interface-picture.png';

// Import types and constants
import { 
  SimulationConfigState, 
  FormErrors, 
  SectionKey, 
  UndoCache, 
  FieldUndoCache 
} from './types';
import { DEFAULTS, RANGES } from './constants';
import { useConfig } from '../../context/ConfigContext';

// Import components
import { SectionHeader } from './components/SectionHeader';
import { ConsumersSection } from './components/ConsumersSection';
import { ProducersSection } from './components/ProducersSection';
import { InterfaceSection } from './components/InterfaceSection';
import { ConfigBottomBar } from './components/ConfigBottomBar';

const SimulationConfig: React.FC = () => {
  const navigate = useNavigate();
  const { config: contextConfig, setConfig: setContextConfig, isLoading: contextLoading } = useConfig();
  
  // State
  const [values, setValues] = useState<SimulationConfigState>(contextConfig);
  const [errors, setErrors] = useState<FormErrors>({});
  const [undoCache, setUndoCache] = useState<UndoCache>({ 
    consumers: null, 
    producers: null,
    interface: null 
  });
  const [fieldUndoCache, setFieldUndoCache] = useState<FieldUndoCache>({});

  // Refs for scrolling
  const consumersRef = useRef<HTMLDivElement>(null);
  const producersRef = useRef<HTMLDivElement>(null);
  const interfaceRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize values from context when context config changes
  useEffect(() => {
    setValues(contextConfig);
  }, [contextConfig]);

  // Generic Input Handler with Validation
  const handleChange = (field: keyof SimulationConfigState, newVal: string | number | boolean) => {
    // Determine the actual value (handle number parsing)
    let val: number | boolean;
    
    if (typeof newVal === 'boolean') {
      val = newVal;
    } else {
      val = Number(newVal);
    }

    if (newVal !== '') {
      setValues(prev => ({ ...prev, [field]: val }));
    }

    // Validation Logic
    // Special validation for maxQueue: must be -1 or >= 5
    if (field === 'maxQueue' && typeof val === 'number') {
      if (val !== -1 && val < 5) {
        setErrors(prev => ({ ...prev, [field]: 'Must be -1 or >= 5' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    } else {
      // Standard range validation for other numeric fields
      const range = RANGES[field];
      if (range && typeof val === 'number') {
        const { min, max } = range;
        if (val < min || (max !== -1 && val > max)) {
          setErrors(prev => ({ ...prev, [field]: `Must be between ${min} and ${max}` }));
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
        }
      }
    }
  };

  // Reset Logic (Single Field) with Undo
  const toggleFieldReset = (field: keyof SimulationConfigState) => {
    if (fieldUndoCache[field] !== undefined) {
      // PERFORM UNDO: Restore value from cache
      handleChange(field, fieldUndoCache[field]!);
      setFieldUndoCache(prev => {
        const newCache = { ...prev };
        delete newCache[field];
        return newCache;
      });
    } else {
      // PERFORM RESET: Save current value first
      setFieldUndoCache(prev => ({ ...prev, [field]: values[field] }));
      handleChange(field, DEFAULTS[field]);
    }
  };

  // Section Reset with UNDO Logic
  const toggleSectionReset = (section: SectionKey, fields: (keyof SimulationConfigState)[]) => {
    if (undoCache[section]) {
      // PERFORM UNDO: Restore values from cache
      const cachedData = undoCache[section];
      if (cachedData) {
        setValues(prev => ({ ...prev, ...cachedData }));
        setUndoCache(prev => ({ ...prev, [section]: null }));
        
        // Clear errors for these fields on undo
        setErrors(prev => {
          const newErrors = { ...prev };
          fields.forEach(f => delete newErrors[f]);
          return newErrors;
        });
      }
    } else {
      // PERFORM RESET: Save current state first
      const currentSectionState: Partial<SimulationConfigState> = {};
      fields.forEach(f => {
        (currentSectionState[f] as any) = values[f]; 
      });
      
      setUndoCache(prev => ({ ...prev, [section]: currentSectionState }));
      
      const newValues = { ...values };
      fields.forEach(f => {
        (newValues[f] as any) = DEFAULTS[f];
      });
      setValues(newValues);
      
      // Clear errors on reset
      setErrors(prev => {
        const newErrors = { ...prev };
        fields.forEach(f => delete newErrors[f]);
        return newErrors;
      });
    }
  };

  // Scroll Helpers
  const skipTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Handle navigation to simulation
  const handleBeginSimulation = () => {
    // Update context with current values before navigating
    setContextConfig(values);
    navigate('/simulate', { state: { config: values } });
  };

  if (contextLoading) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Loader size="xl" />
          <Text size="lg" fw={500}>Loading Configuration...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box className="config-container">
      
      <Box className="config-scroll-area">
        <Container size="xl" px="xl" py={40}>
          
          <Title order={1} size="3.5rem" fw={700} ta="center" mb={80}>
            Simulation Configuration
          </Title>

          {/* ================= CONSUMERS SECTION ================= */}
          <Box ref={consumersRef} className="section-container">
            <SectionHeader
              title="Consumers"
              imageSrc={ConsumerImg}
              imageAlt="Consumers Server Rack"
              section="consumers"
              hasUndo={!!undoCache.consumers}
              onSectionReset={() => toggleSectionReset('consumers', ['printRate', 'consumerCount', 'autoScaling', 'refillRate', 'paperCapacity'])}
              onSkipToNext={() => skipTo(producersRef)}
              onSkipAll={() => skipTo(bottomRef)}
              skipLabel="Skip to Producers"
            />

            <ConsumersSection
              values={values}
              errors={errors}
              fieldUndoCache={fieldUndoCache}
              handleChange={handleChange}
              toggleFieldReset={toggleFieldReset}
            />
          </Box>

          {/* ================= PRODUCERS SECTION ================= */}
          <Box ref={producersRef} className="section-container">
            <SectionHeader
              title="Producers"
              imageSrc={ProducerImg}
              imageAlt="Producers Laptops"
              section="producers"
              hasUndo={!!undoCache.producers}
              onSectionReset={() => toggleSectionReset('producers', ['fixedArrival', 'jobArrivalTime', 'minArrivalTime', 'maxArrivalTime', 'jobCount', 'minPapers', 'maxPapers', 'maxQueue'])}
              onSkipToNext={() => skipTo(interfaceRef)}
              onSkipAll={() => skipTo(bottomRef)}
              skipLabel="Skip to Interface"
            />

            <ProducersSection
              values={values}
              errors={errors}
              fieldUndoCache={fieldUndoCache}
              handleChange={handleChange}
              toggleFieldReset={toggleFieldReset}
            />
          </Box>

          {/* ================= INTERFACE SECTION ================= */}
          <Box ref={interfaceRef} className="section-container">
            <SectionHeader
              title="Interface"
              imageSrc={InterfaceImg}
              imageAlt="Interface Layout"
              section="interface"
              hasUndo={!!undoCache.interface}
              onSectionReset={() => toggleSectionReset('interface', ['showTime', 'showSimulationStats', 'showLogs', 'showComponents'])}
              onSkipAll={() => skipTo(bottomRef)}
            />

            <InterfaceSection
              values={values}
            />
          </Box>
          
          <Box ref={bottomRef} h={40}></Box>
        </Container>
      </Box>

      {/* ================= FIXED BOTTOM BAR ================= */}
      <ConfigBottomBar
        hasErrors={Object.keys(errors).length > 0}
        onBack={() => navigate('/')}
        onBeginSimulation={handleBeginSimulation}
      />
    </Box>
  );
};

export default SimulationConfig;
