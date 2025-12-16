import React from 'react';
import { Stack } from '@mantine/core';
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
      <InputGroup 
        label="Speed of incoming jobs (ms)" 
        desc="(1-300)"
        value={values.jobSpeed}
        field="jobSpeed"
        error={errors.jobSpeed}
        onChange={handleChange}
        onReset={() => toggleFieldReset('jobSpeed')}
        hasUndo={fieldUndoCache.jobSpeed !== undefined}
      />
      
      <InputGroup 
        label="Number of jobs" 
        desc="Total count"
        value={values.jobCount}
        field="jobCount"
        error={errors.jobCount}
        onChange={handleChange}
        onReset={() => toggleFieldReset('jobCount')}
        hasUndo={fieldUndoCache.jobCount !== undefined}
      />
      
      <InputGroup 
        label="Min number of papers" 
        desc="Required for job (5-10)"
        value={values.minPapers}
        field="minPapers"
        error={errors.minPapers}
        onChange={handleChange}
        onReset={() => toggleFieldReset('minPapers')}
        hasUndo={fieldUndoCache.minPapers !== undefined}
      />
    </Stack>
  );
};
