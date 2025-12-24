# Concurrent Request Orchestrator

A real-time simulation platform for visualizing multithreaded resource orchestration and concurrency control. This project demonstrates a producer-consumer pattern with multiple producers, consumers, and finite shared resources (modeled as a print service).

## 🎯 Overview

The Concurrent Request Orchestrator provides an interactive web interface to:
- Configure and run concurrent processing simulations
- Visualize real-time job queuing, processing, and completion
- Monitor resource utilization and consumer scaling
- Analyze performance metrics and statistics
- Test different concurrency patterns and configurations

## 🏗️ Architecture

- **Frontend**: React + TypeScript SPA with real-time WebSocket updates
- **Backend**: C-based multithreaded request orchestrator with WebSocket + REST API server
- **Deployment**: Multi-container Docker setup with nginx reverse proxy

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Docker and Docker Compose (optional, for containerized deployment)
- `serve` package for production serving: `npm install -g serve`

### Setup Options

The project includes a flexible setup script that supports three deployment modes:

```bash
chmod +x setup.sh
./setup.sh [mode]
```

#### Mode 1: Frontend Only (Mock Data)
```bash
./setup.sh frontend-only
```
- Builds and serves the React frontend
- Uses pre-recorded mock events for simulation
- No backend required
- Ideal for UI development and testing

#### Mode 2: Local Frontend + Docker Backend
```bash
./setup.sh local-frontend
```
- Builds and serves the React frontend locally
- Starts backend in Docker container
- Real-time WebSocket communication
- Best for full-stack development

#### Mode 3: Full Docker Deployment
```bash
./setup.sh docker-all
```
- Runs both frontend and backend in Docker containers
- Production-like environment
- Ideal for integration testing and deployment

**Note**: If Docker is not installed or running, the script automatically falls back to frontend-only mode.

### Manual Setup

#### Frontend Development
```bash
npm install
npm start
# Open http://localhost:3000
```

#### Production Build
```bash
npm run build
serve -s build
```

#### Docker Build
```bash
# Build frontend image
docker build -t joshoti/orchestrator-frontend:latest .

# Run with docker-compose
export DOCKERHUB_USERNAME=joshoti
docker-compose up -d
```

## 🎮 Usage

1. **Configure Simulation**: Set producers, consumers, queue size, and resource limits
2. **Start Simulation**: Launch the simulation to see real-time processing
3. **Monitor Progress**: Watch jobs flow through the queue and get processed
4. **View Report**: Analyze final statistics including throughput, latency, and resource usage

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🛠️ Technologies

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Mantine UI** - Component library
- **React Router** - Client-side routing
- **WebSocket** - Real-time communication
- **Docker** - Containerization
- **Nginx** - Web server and reverse proxy

## 🚢 Deployment

### Docker Hub
The project uses automated CI/CD to build and push Docker images:
- Frontend: `joshoti/orchestrator-frontend:latest`
- Backend: `joshoti/request-orchestrator:latest`

### GitHub Actions
The `.github/workflows/docker-frontend.yml` workflow automatically:
- Builds multi-platform images (linux/amd64, linux/arm64)
- Pushes to Docker Hub on commits to main
- Creates versioned tags for releases

### Environment Variables
Configure the following environment variables:
- `REACT_APP_API_URL`: Backend API endpoint (default: `http://localhost:8000/api`)
- `REACT_APP_WS_URL`: WebSocket endpoint (default: `ws://localhost:8000/ws`)

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!
