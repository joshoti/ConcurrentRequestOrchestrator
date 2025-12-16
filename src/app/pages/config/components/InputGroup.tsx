import React from 'react';
import { Box, Button, NumberInput } from '@mantine/core';
import { IconAlertCircle, IconArrowBack } from '@tabler/icons-react';
import { SimulationConfigState } from '../types';

interface InputGroupProps {
  label: string;
  desc: string;
  value: number;
  field: keyof SimulationConfigState;
  error?: string;
  onChange: (field: keyof SimulationConfigState, value: string) => void; 
  onReset: () => void;
  hasUndo: boolean;
}

export const InputGroup: React.FC<InputGroupProps> = ({ 
  label, 
  desc, 
  value, 
  field, 
  error, 
  onChange, 
  onReset, 
  hasUndo 
}) => {
  return (
    <Box className="input-group">
      <Box style={{ width: '100%', maxWidth: '28rem' }}>
        <NumberInput
          label={label}
          description={desc}
          value={value}
          onChange={(val) => onChange(field, String(val))}
          error={error}
          size="md"
          radius="md"
          styles={{
            label: { fontWeight: 700, fontSize: '1rem', marginBottom: 3 },
            description: { fontSize: '0.875rem', marginBottom: 8 },
            input: { 
              fontWeight: 500,
              borderWidth: 2,
              '&:focus': { borderColor: 'black' }
            }
          }}
          rightSection={error ? <IconAlertCircle size={20} color="red" /> : null}
        />
      </Box>

      <Button 
        onClick={onReset}
        variant={hasUndo ? "light" : "subtle"}
        color={hasUndo ? "blue" : "red"}
        size="xs"
        className="reset-button"
        leftSection={hasUndo ? <IconArrowBack size={14}/> : null}
      >
        {hasUndo ? "Undo" : "Reset"}
      </Button>
    </Box>
  );
};
