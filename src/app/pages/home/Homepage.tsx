import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Text, Button, Group, Stack, Image, Box, Loader } from '@mantine/core';
import LaptopHero from '../../assets/images/landing_page_screen.png';
import './Homepage.css';
import { useConfig } from '../../context/ConfigContext';

const Homepage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { config, isLoading: configLoading } = useConfig();

  const handleRunSimulation = async () => {
    setIsLoading(true);

    try {
      // Navigate to simulation with config from context
      navigate('/simulate', { state: { config } });
      
    } catch (error) {
      console.error("Error starting simulation:", error);
      // Optional: Add error handling logic here (e.g. show a toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xl" style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      
      {/* Header Section */}
      <Stack align="center" gap={0} className="header-fade-in">
        <Title 
          order={1} 
          size="4.5rem" 
          fw={700} 
          c="black" 
          ta="center"
          style={{ letterSpacing: '-0.02em' }}
          className='header-title'
        >
          Concurrent Service
        </Title>
        <Text size="lg" c="gray.9" fw={600} ta="center" className='header-subtitle'>
          Visualizes the sharing of buffers and management of resources
        </Text>
      </Stack>

      {/* Visualization Section */}
      <Box className="image-container" mb={40}>
        <Box className="image-background" />
        <Image
          src={LaptopHero}
          alt="Simulation Diagram"
          className="hero-image"
          fit="contain"
        />
      </Box>

      {/* Action Buttons */}
      <Group grow preventGrowOverflow className='action-buttons'>
        <Button
          onClick={() => navigate('/configuration')}
          variant="outline"
          color="dark"
          size="md"
          radius="xl"
          h={60}
          fw={600}
          className="configure-button"
        >
          Configure components
        </Button>
        
        <Button
          onClick={handleRunSimulation}
          disabled={isLoading || configLoading}
          variant="filled"
          color="dark"
          size="md"
          radius="xl"
          h={60}
          fw={600}
          className="simulate-button"
          leftSection={isLoading || configLoading ? <Loader size="sm" color="white" /> : null}
        >
          {isLoading || configLoading ? 'Loading...' : 'Run simulation'}
        </Button>
      </Group>

    </Container>
  );
};

export default Homepage;

