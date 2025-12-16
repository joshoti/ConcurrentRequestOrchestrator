import React from 'react';
import { Stack, Box, Text, Button, SegmentedControl } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons-react';
import { SimulationConfigState, FormErrors, FieldUndoCache } from '../types';
import { InputGroup } from './InputGroup';

interface ProducersSectionProps {
  values: SimulationConfigState;
  errors: FormErrors;
  fieldUndoCache: FieldUndoCache;
  handleChange: (field: keyof SimulationConfigState, value: string | number | boolean) => void;
  toggleFieldReset: (field: keyof SimulationConfigState) => void;
}

export const ProducersSection: React.FC<ProducersSectionProps> = ({
  values,
  errors,
  fieldUndoCache,
  handleChange,
  toggleFieldReset
}) => {
  return (
    <Stack gap="xl" className="section-inputs">
      {/* Boolean Toggle - Moved to top */}
      <Box className="input-group">
        <Stack gap={1}>
          <Text size="lg" fw={700} c="gray.9" style={{letterSpacing: '-0.04em'}}>Fixed arrival</Text>
          <Text size="sm" c="gray.6" mb="xs">
            Should jobs arrive at fixed intervals
          </Text>
          <SegmentedControl
            value={values.fixedArrival ? 'yes' : 'no'}
            onChange={(val) => handleChange('fixedArrival', val === 'yes')}
            data={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' }
            ]}
            color="dark"
            radius="lg"
          />
        </Stack>
        <Button 
          onClick={() => toggleFieldReset('fixedArrival')} 
          variant={fieldUndoCache.fixedArrival !== undefined ? "light" : "subtle"}
          color={fieldUndoCache.fixedArrival !== undefined ? "blue" : "red"}
          size="xs"
          className="reset-button"
          leftSection={fieldUndoCache.fixedArrival !== undefined ? <IconArrowBack size={14}/> : null}
        >
          {fieldUndoCache.fixedArrival !== undefined ? "Undo" : "Reset"}
        </Button>
      </Box>

      {/* Conditional arrival time inputs */}
      {values.fixedArrival ? (
        <InputGroup 
          label="Interval of incoming jobs (ms)" 
          desc="Time between next job arrival (200-800)"
          value={values.jobSpeed}
          field="jobSpeed"
          error={errors.jobSpeed}
          onChange={handleChange}
          onReset={() => toggleFieldReset('jobSpeed')}
          hasUndo={fieldUndoCache.jobSpeed !== undefined}
        />
      ) : (
        <>
          <InputGroup 
            label="Min arrival time (ms)" 
            desc="Minimum time between job arrivals (200-400)"
            value={values.minArrivalTime}
            field="minArrivalTime"
            error={errors.minArrivalTime}
            onChange={handleChange}
            onReset={() => toggleFieldReset('minArrivalTime')}
            hasUndo={fieldUndoCache.minArrivalTime !== undefined}
          />
          <InputGroup 
            label="Max arrival time (ms)" 
            desc="Maximum time between job arrivals (500-800)"
            value={values.maxArrivalTime}
            field="maxArrivalTime"
            error={errors.maxArrivalTime}
            onChange={handleChange}
            onReset={() => toggleFieldReset('maxArrivalTime')}
            hasUndo={fieldUndoCache.maxArrivalTime !== undefined}
          />
        </>
      )}
      
      <InputGroup 
        label="Number of jobs" 
        desc="Total count of jobs to be processed (10-50)"
        value={values.jobCount}
        field="jobCount"
        error={errors.jobCount}
        onChange={handleChange}
        onReset={() => toggleFieldReset('jobCount')}
        hasUndo={fieldUndoCache.jobCount !== undefined}
      />
      
      <InputGroup 
        label="Min number of papers" 
        desc="Minimum papers per job (5-10)"
        value={values.minPapers}
        field="minPapers"
        error={errors.minPapers}
        onChange={handleChange}
        onReset={() => toggleFieldReset('minPapers')}
        hasUndo={fieldUndoCache.minPapers !== undefined}
      />

      <InputGroup 
        label="Max number of papers" 
        desc="Maximum papers per job (15-30)"
        value={values.maxPapers}
        field="maxPapers"
        error={errors.maxPapers}
        onChange={handleChange}
        onReset={() => toggleFieldReset('maxPapers')}
        hasUndo={fieldUndoCache.maxPapers !== undefined}
      />
      
      <InputGroup 
        label="Queue capacity" 
        desc="Maximum length of queue. -1 for unlimited capacity (-1 or >= 5)"
        value={values.maxQueue}
        field="maxQueue"
        error={errors.maxQueue}
        onChange={handleChange}
        onReset={() => toggleFieldReset('maxQueue')}
        hasUndo={fieldUndoCache.maxQueue !== undefined}
      />
    </Stack>
  );
};
