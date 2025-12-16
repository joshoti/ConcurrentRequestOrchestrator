import React from 'react';
import { Box, Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

interface ConfigBottomBarProps {
  hasErrors: boolean;
  onBack: () => void;
  onBeginSimulation: () => void;
}

export const ConfigBottomBar: React.FC<ConfigBottomBarProps> = ({
  hasErrors,
  onBack,
  onBeginSimulation
}) => {
  return (
    <Box className="bottom-bar">
      <Button 
        onClick={onBack}
        variant="subtle"
        color="gray"
        size="lg"
        leftSection={<IconArrowLeft size={24} />}
        fw={700}
      >
        Back
      </Button>

      <Button 
        onClick={onBeginSimulation}
        disabled={hasErrors}
        size="lg"
        radius="xl"
        color="dark"
        px={60}
        h={56}
        fw={700}
        className="begin-button"
      >
        Begin simulation
      </Button>
    </Box>
  );
};
