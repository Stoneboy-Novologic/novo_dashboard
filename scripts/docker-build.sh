#!/bin/bash

# Docker Build Script
# 
# This script builds Docker images for all services in the monorepo
# 
# Usage:
#   ./scripts/docker-build.sh [options]
# 
# Options:
#   --api-only      Build only the API image
#   --app-only      Build only the App image
#   --no-cache      Build without using cache
#   --push          Push images to registry (requires registry config)
# 
# Examples:
#   ./scripts/docker-build.sh
#   ./scripts/docker-build.sh --api-only
#   ./scripts/docker-build.sh --no-cache
#
# Flow:
#   1. Check prerequisites (Docker, docker-compose)
#   2. Validate environment
#   3. Build images with error handling
#   4. Display build summary

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Configuration
BUILD_API=true
BUILD_APP=true
NO_CACHE=false
PUSH=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --api-only)
            BUILD_API=true
            BUILD_APP=false
            shift
            ;;
        --app-only)
            BUILD_API=false
            BUILD_APP=true
            shift
            ;;
        --no-cache)
            NO_CACHE=true
            shift
            ;;
        --push)
            PUSH=true
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Usage: $0 [--api-only|--app-only] [--no-cache] [--push]"
            exit 1
            ;;
    esac
done

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Validate environment
validate_environment() {
    log_info "Validating environment..."
    
    # Check if .env file exists (optional but recommended)
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        log_warning ".env file not found. Using default values."
        log_warning "Copy .env.example to .env and configure your environment variables."
    fi
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running. Please start Docker."
        exit 1
    fi
    
    log_success "Environment validation passed"
}

# Build API image
build_api() {
    log_info "Building NestJS API image..."
    
    local build_args=""
    if [ "$NO_CACHE" = true ]; then
        build_args="--no-cache"
    fi
    
    cd "$PROJECT_ROOT"
    
    if docker build $build_args -f Dockerfile.api -t construction-mgmt-api:latest .; then
        log_success "API image built successfully"
        return 0
    else
        log_error "Failed to build API image"
        return 1
    fi
}

# Build App image
build_app() {
    log_info "Building Next.js App image..."
    
    local build_args=""
    if [ "$NO_CACHE" = true ]; then
        build_args="--no-cache"
    fi
    
    # Get API URL from environment or use default
    local api_url="${NEXT_PUBLIC_API_URL:-http://localhost:3001}"
    build_args="$build_args --build-arg NEXT_PUBLIC_API_URL=$api_url"
    
    cd "$PROJECT_ROOT"
    
    if docker build $build_args -f Dockerfile.app -t construction-mgmt-app:latest .; then
        log_success "App image built successfully"
        return 0
    else
        log_error "Failed to build App image"
        return 1
    fi
}

# Push images (if requested)
push_images() {
    if [ "$PUSH" = false ]; then
        return 0
    fi
    
    log_info "Pushing images to registry..."
    
    # Check if registry is configured
    local registry="${DOCKER_REGISTRY:-}"
    if [ -z "$registry" ]; then
        log_error "DOCKER_REGISTRY environment variable is not set"
        return 1
    fi
    
    if [ "$BUILD_API" = true ]; then
        docker tag construction-mgmt-api:latest "$registry/construction-mgmt-api:latest"
        docker push "$registry/construction-mgmt-api:latest"
        log_success "API image pushed to registry"
    fi
    
    if [ "$BUILD_APP" = true ]; then
        docker tag construction-mgmt-app:latest "$registry/construction-mgmt-app:latest"
        docker push "$registry/construction-mgmt-app:latest"
        log_success "App image pushed to registry"
    fi
}

# Display build summary
display_summary() {
    log_info "Build Summary:"
    echo ""
    echo "Built Images:"
    
    if [ "$BUILD_API" = true ]; then
        if docker image inspect construction-mgmt-api:latest &> /dev/null; then
            local api_size=$(docker image inspect construction-mgmt-api:latest --format='{{.Size}}' | numfmt --to=iec-i --suffix=B)
            echo -e "  ${GREEN}✓${NC} construction-mgmt-api:latest ($api_size)"
        fi
    fi
    
    if [ "$BUILD_APP" = true ]; then
        if docker image inspect construction-mgmt-app:latest &> /dev/null; then
            local app_size=$(docker image inspect construction-mgmt-app:latest --format='{{.Size}}' | numfmt --to=iec-i --suffix=B)
            echo -e "  ${GREEN}✓${NC} construction-mgmt-app:latest ($app_size)"
        fi
    fi
    
    echo ""
    log_info "Next steps:"
    echo "  - Run: docker-compose up -d"
    echo "  - View logs: docker-compose logs -f"
    echo "  - Stop services: docker-compose down"
}

# Main execution
main() {
    log_info "Starting Docker build process..."
    echo ""
    
    check_prerequisites
    validate_environment
    
    local build_failed=false
    
    if [ "$BUILD_API" = true ]; then
        if ! build_api; then
            build_failed=true
        fi
    fi
    
    if [ "$BUILD_APP" = true ]; then
        if ! build_app; then
            build_failed=true
        fi
    fi
    
    if [ "$build_failed" = true ]; then
        log_error "Build process completed with errors"
        exit 1
    fi
    
    push_images
    display_summary
    
    log_success "Docker build process completed successfully!"
}

# Run main function
main

