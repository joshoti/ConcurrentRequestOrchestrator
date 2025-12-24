#!/bin/bash
set -e

# Check if Docker is installed
check_docker() {
  if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed or not in PATH"
    echo "📦 Falling back to frontend-only mode..."
    return 1
  fi
  
  if ! docker info &> /dev/null; then
    echo "⚠️  Docker is installed but not running"
    echo "📦 Falling back to frontend-only mode..."
    return 1
  fi
  
  return 0
}

case "$1" in
  "frontend-only")
    echo "🔨 Building frontend..."
    npm run build
    echo "🚀 Serving frontend (mock mode)..."
    serve -s build
    ;;
  
  "local-frontend")
    if ! check_docker; then
      echo "🔨 Building frontend..."
      npm run build
      echo "🚀 Serving frontend (mock mode)..."
      serve -s build
      exit 0
    fi
    
    echo "🔨 Building frontend..."
    npm run build
    echo "🐳 Starting Docker backend only..."
    export DOCKERHUB_USERNAME=joshoti
    docker-compose up -d request-orchestrator
    echo "🚀 Serving frontend locally..."
    serve -s build
    ;;
  
  "docker-all")
    if ! check_docker; then
      echo "🔨 Building frontend..."
      npm run build
      echo "🚀 Serving frontend (mock mode)..."
      serve -s build
      exit 0
    fi
    
    echo "🐳 Starting all Docker services (frontend + backend)..."
    export DOCKERHUB_USERNAME=joshoti
    docker-compose up -d
    ;;
  
  *)
    echo "Usage: ./setup.sh [frontend-only|local-frontend|docker-all]"
    echo ""
    echo "Options:"
    echo "  frontend-only   - Build and serve frontend only (uses mock data)"
    echo "  local-frontend  - Build and serve frontend + Docker backend"
    echo "  docker-all      - Start all Docker services (frontend + backend)"
    exit 1
    ;;
esac