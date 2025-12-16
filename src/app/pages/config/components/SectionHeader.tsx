import React from 'react';
import { Box, Button, Title, Group } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons-react';
import { SectionKey } from '../types';

interface SectionHeaderProps {
  title: string;
  imageSrc: string;
  imageAlt: string;
  section: SectionKey;
  hasUndo: boolean;
  onSectionReset: () => void;
  onSkipToNext?: () => void;
  onSkipAll: () => void;
  skipLabel?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  imageSrc,
  imageAlt,
  section,
  hasUndo,
  onSectionReset,
  onSkipToNext,
  onSkipAll,
  skipLabel = "Skip"
}) => {
  return (
    <Box className="section-sidebar">
      <Box className="sticky-sidebar">
        <Title order={2} size="2rem" fw={700} mb={10}>
          {title}
        </Title>
        <Box
          component="img"
          src={imageSrc}
          alt={imageAlt} 
          className={`section-image${section === 'interface' ? ' interface-image' : ''}`}
        />
        
        <Group gap="sm" className="section-actions">
          <Button 
            onClick={onSectionReset}
            radius="xl"
            size="sm"
            variant={hasUndo ? "light" : "filled"}
            color={hasUndo ? "blue" : "red"}
            leftSection={hasUndo ? <IconArrowBack size={16}/> : null}
          >
            {hasUndo ? "Undo Reset" : "Reset section"}
          </Button>
          {onSkipToNext && (
            <Button 
              onClick={onSkipToNext}
              radius="xl"
              size="sm"
              variant="light"
              color="gray"
              c="black"
            >
              {skipLabel}
            </Button>
          )}
          <Button 
            onClick={onSkipAll}
            radius="xl"
            size="sm"
            variant="light"
            color="gray"
            c="black"
          >
            Skip all
          </Button>
        </Group>
      </Box>
    </Box>
  );
};
