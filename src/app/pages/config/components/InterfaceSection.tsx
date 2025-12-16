import React from 'react';
import { Stack, Box, Text, SegmentedControl } from '@mantine/core';
import { SimulationConfigState } from '../types';

interface InterfaceSectionProps {
  values: SimulationConfigState;
}

export const InterfaceSection: React.FC<InterfaceSectionProps> = ({
  values
}) => {
  return (
    <Stack gap={40} className="section-inputs">
      {/* Show Time Toggle */}
      <Box className="input-group">
        <Stack gap={1}>
          <Text size="lg" fw={700} c="gray.9" style={{letterSpacing: '-0.04em'}}>Show time</Text>
          <Text size="sm" c="gray.6" mb="xs">
            Display simulation time during execution
          </Text>
          <SegmentedControl
            value={values.showTime ? 'yes' : 'no'}
            data={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' }
            ]}
            color="dark"
            radius="lg"
            disabled
          />
        </Stack>
      </Box>

      {/* Show Simulation Stats Toggle */}
      <Box className="input-group">
        <Stack gap={1}>
          <Text size="lg" fw={700} c="gray.9" style={{letterSpacing: '-0.04em'}}>Show simulation stats</Text>
          <Text size="sm" c="gray.6" mb="xs">
            Display performance metrics and statistics
          </Text>
          <SegmentedControl
            value={values.showSimulationStats ? 'yes' : 'no'}
            data={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' }
            ]}
            color="dark"
            radius="lg"
            disabled
          />
        </Stack>
      </Box>

      {/* Show Logs Toggle */}
      <Box className="input-group">
        <Stack gap={1}>
          <Text size="lg" fw={700} c="gray.9" style={{letterSpacing: '-0.04em'}}>Show logs</Text>
          <Text size="sm" c="gray.6" mb="xs">
            Display real-time event logs
          </Text>
          <SegmentedControl
            value={values.showLogs ? 'yes' : 'no'}
            data={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' }
            ]}
            color="dark"
            radius="lg"
            disabled
          />
        </Stack>
      </Box>

      {/* Show Components Toggle */}
      <Box className="input-group">
        <Stack gap={1}>
          <Text size="lg" fw={700} c="gray.9" style={{letterSpacing: '-0.04em'}}>Show components</Text>
          <Text size="sm" c="gray.6" mb="xs">
            Visualize producers and consumers
          </Text>
          <SegmentedControl
            value={values.showComponents ? 'yes' : 'no'}
            data={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' }
            ]}
            color="dark"
            radius="lg"
            disabled
          />
        </Stack>
      </Box>
    </Stack>
  );
};
