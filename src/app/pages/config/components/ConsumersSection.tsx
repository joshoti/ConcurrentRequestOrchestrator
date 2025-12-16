import React from 'react';
import { Box, Stack, Text, Button, SegmentedControl } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons-react';
import { SimulationConfigState, FormErrors, FieldUndoCache } from '../types';
import { InputGroup } from './InputGroup';

interface ConsumersSectionProps {
  values: SimulationConfigState;
  errors: FormErrors;
  fieldUndoCache: FieldUndoCache;
  handleChange: (field: keyof SimulationConfigState, value: string | number | boolean) => void;
  toggleFieldReset: (field: keyof SimulationConfigState) => void;
}

export const ConsumersSection: React.FC<ConsumersSectionProps> = ({
  values,
  errors,
  fieldUndoCache,
  handleChange,
  toggleFieldReset
}) => {
  return (
    <Stack gap="xl" className="section-inputs">
      <InputGroup 
        label="Print rate" 
        desc="How fast jobs get serviced (4-10)"
        value={values.printRate}
        field="printRate"
        error={errors.printRate}
        onChange={handleChange}
        onReset={() => toggleFieldReset('printRate')}
        hasUndo={fieldUndoCache.printRate !== undefined}
      />
      
      <InputGroup 
        label="Number of consumers" 
        desc="Number we start with (1-5)"
        value={values.consumerCount}
        field="consumerCount"
        error={errors.consumerCount}
        onChange={handleChange}
        onReset={() => toggleFieldReset('consumerCount')}
        hasUndo={fieldUndoCache.consumerCount !== undefined}
      />

      {/* Boolean Toggle */}
      <Box className="input-group">
        <Stack gap={1}>
          <Text size="lg" fw={700} c="gray.9" style={{letterSpacing: '-0.04em'}}>Auto-scaling</Text>
          <Text size="sm" c="gray.6" mb="xs">
            Should number of consumers change during simulation
          </Text>
          <SegmentedControl
            value={values.autoScaling ? 'yes' : 'no'}
            onChange={(val) => handleChange('autoScaling', val === 'yes')}
            data={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' }
            ]}
            color="dark"
            radius="lg"
          />
        </Stack>
        <Button 
          onClick={() => toggleFieldReset('autoScaling')} 
          variant={fieldUndoCache.autoScaling !== undefined ? "light" : "subtle"}
          color={fieldUndoCache.autoScaling !== undefined ? "blue" : "red"}
          size="xs"
          className="reset-button"
          leftSection={fieldUndoCache.autoScaling !== undefined ? <IconArrowBack size={14}/> : null}
        >
          {fieldUndoCache.autoScaling !== undefined ? "Undo" : "Reset"}
        </Button>
      </Box>

      <InputGroup 
        label="Refill rate" 
        desc="How quick we refill consumers (0.05-1)"
        value={values.refillRate}
        field="refillRate"
        error={errors.refillRate}
        onChange={handleChange}
        onReset={() => toggleFieldReset('refillRate')}
        hasUndo={fieldUndoCache.refillRate !== undefined}
      />
      
      <InputGroup 
        label="Paper capacity" 
        desc="Max number of papers a consumer can hold (50-200)"
        value={values.paperCapacity}
        field="paperCapacity"
        error={errors.paperCapacity}
        onChange={handleChange}
        onReset={() => toggleFieldReset('paperCapacity')}
        hasUndo={fieldUndoCache.paperCapacity !== undefined}
      />
    </Stack>
  );
};
