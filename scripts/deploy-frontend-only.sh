#!/bin/bash

# Frontend-Only EC2 Deployment Script
# 
# This script deploys only the Next.js frontend application to EC2.
# Useful for frontend-only updates without rebuilding the entire stack.
# 
# Usage:
#   ./scripts/deploy-frontend-only.sh
# 
# What it does:
#   1. Checks prerequisites and system requirements
#   2. Verifies Docker is installed
#   3. Sets up the deployment directory (or uses existing)
#   4. Creates/updates frontend environment file
#   5. Builds only the Next.js frontend Docker image
#   6. Updates and restarts only the frontend service
#   7. Runs health checks for frontend
#   8. Displays deployment summary
#
# Requirements:
#   - Run on EC2 instance (Ubuntu 20.04+ or Amazon Linux 2+)
#   - Run from project root directory
#   - Docker and Docker Compose must be installed
#   - Backend API should be running (for frontend to connect to)
#
# Note: All npm install/ci commands use --legacy-peer-deps flag for compatibility

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# ============================================================================
# Configuration
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEPLOY_DIR="/opt/construction-mgmt"
LOG_FILE="/tmp/frontend-deployment-$(date +%Y%m%d-%H%M%S).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# ============================================================================
# Logging Functions
# ============================================================================

log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
}

log_info() {
    log "INFO" "${BLUE}ℹ${NC} $*"
}

log_success() {
    log "SUCCESS" "${GREEN}✓${NC} $*"
}

log_warning() {
    log "WARNING" "${YELLOW}⚠${NC} $*"
}

log_error() {
    log "ERROR" "${RED}✗${NC} $*"
}

log_step() {
    echo ""
    log_info "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    log_info "${BOLD}${MAGENTA}▶ $*${NC}"
    log_info "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

log_substep() {
    log_info "${BOLD}  →${NC} $*"
}

# Error handling
error_exit() {
    log_error "$1"
    log_error "Frontend deployment failed. Check logs at: $LOG_FILE"
    exit 1
}

# ============================================================================
# Utility Functions
# ============================================================================

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Get EC2 public IP
get_ec2_ip() {
    local ip=$(curl -s --max-time 5 http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "")
    if [ -z "$ip" ]; then
        ip=$(hostname -I | awk '{print $1}' || echo "localhost")
    fi
    echo "$ip"
}

# Wait for service to be ready
wait_for_service() {
    local url=$1
    local max_attempts=${2:-30}
    local attempt=0
    
    log_substep "Waiting for service at $url..."
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -sf "$url" >/dev/null 2>&1; then
            log_success "Service is ready!"
            return 0
        fi
        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done
    echo ""
    return 1
}

# ============================================================================
# Prerequisites Check
# ============================================================================

check_prerequisites() {
    log_step "Checking Prerequisites"
    
    # Check if running on Linux
    if [ ! -f /etc/os-release ]; then
        error_exit "Cannot detect operating system"
    fi
    
    . /etc/os-release
    log_success "Detected OS: $NAME $VERSION"
    
    # Check Docker
    if ! command_exists docker; then
        error_exit "Docker is not installed. Please install Docker first or run the complete deployment script."
    fi
    
    if ! sudo docker info >/dev/null 2>&1; then
        error_exit "Docker daemon is not running. Please start Docker."
    fi
    log_success "Docker is installed and running: $(docker --version)"
    
    # Check Docker Compose
    if ! docker compose version >/dev/null 2>&1 && ! command_exists docker-compose; then
        error_exit "Docker Compose is not installed. Please install Docker Compose first."
    fi
    log_success "Docker Compose is available"
    
    # Check if we're in the project root
    if [ ! -f "$PROJECT_ROOT/package.json" ] || [ ! -f "$PROJECT_ROOT/Dockerfile.app" ]; then
        error_exit "Please run this script from the project root directory"
    fi
    
    # Check if deployment directory exists
    if [ ! -d "$DEPLOY_DIR" ]; then
        error_exit "Deployment directory not found: $DEPLOY_DIR. Please run the complete deployment script first."
    fi
    
    log_success "Prerequisites check passed!"
}

# ============================================================================
# Optional Cleanup (Docker cache, logs)
# ============================================================================

prompt_cleanup_frontend() {
    log_step "Optional Cleanup (free disk space)"
    
    local dangling_images=$(sudo docker images -f "dangling=true" -q | wc -l | tr -d ' ')
    local containers_exited=$(sudo docker ps -aq -f status=exited | wc -l | tr -d ' ')
    local logs_count=$(ls -1 /tmp/frontend-deployment-*.log 2>/dev/null | wc -l | tr -d ' ')
    local logs_size=$(du -ch /tmp/frontend-deployment-*.log 2>/dev/null | tail -n1 | awk '{print $1}')
    
    log_info "Detected:"
    log_info "  - Dangling images: ${dangling_images}"
    log_info "  - Exited containers: ${containers_exited}"
    log_info "  - Frontend deploy logs: ${logs_count} (total ~${logs_size:-0})"
    echo ""
    echo -e "${BOLD}Choose cleanup actions (multiple allowed, comma-separated):${NC}"
    echo -e "  ${CYAN}1${NC}) Remove dangling images (safe)"
    echo -e "  ${CYAN}2${NC}) Remove exited containers (safe)"
    echo -e "  ${CYAN}3${NC}) Prune build cache (safe)"
    echo -e "  ${CYAN}4${NC}) Delete frontend deployment logs in /tmp"
    echo -e "  ${CYAN}0${NC}) Skip cleanup"
    echo ""
    read -p "Enter your choice(s) [e.g., 1,3 or 0]: " choices
    
    IFS=',' read -r -a arr <<< "$choices"
    for choice in "${arr[@]}"; do
        choice=$(echo "$choice" | xargs)
        case "$choice" in
            1)
                log_substep "Pruning dangling images..."
                sudo docker image prune -f || true
                ;;
            2)
                log_substep "Removing exited containers..."
                sudo docker rm $(sudo docker ps -aq -f status=exited) 2>/dev/null || true
                ;;
            3)
                log_substep "Pruning build cache..."
                sudo docker builder prune -f || true
                ;;
            4)
                log_substep "Deleting frontend deployment logs in /tmp..."
                sudo rm -f /tmp/frontend-deployment-*.log 2>/dev/null || true
                ;;
            0)
                log_info "Skipping cleanup"
                ;;
            *)
                ;;
        esac
    done
    echo ""
}

# ============================================================================
# Setup Deployment Directory
# ============================================================================

setup_deployment_directory() {
    log_step "Setting Up Deployment Directory"
    
    cd "$DEPLOY_DIR"
    
    # Check if docker-compose.prod.yml exists
    if [ ! -f "docker-compose.prod.yml" ]; then
        error_exit "docker-compose.prod.yml not found. Please run the complete deployment script first."
    fi
    
    log_substep "Updating project files..."
    
    # Copy only frontend-related files
    sudo cp -r "$PROJECT_ROOT/apps/app" "$DEPLOY_DIR/apps/" 2>/dev/null || true
    sudo cp -r "$PROJECT_ROOT/components" "$DEPLOY_DIR/" 2>/dev/null || true
    sudo cp -r "$PROJECT_ROOT/public" "$DEPLOY_DIR/" 2>/dev/null || true
    sudo cp -r "$PROJECT_ROOT/styles" "$DEPLOY_DIR/" 2>/dev/null || true
    sudo cp -r "$PROJECT_ROOT/hooks" "$DEPLOY_DIR/" 2>/dev/null || true
    sudo cp -r "$PROJECT_ROOT/lib" "$DEPLOY_DIR/" 2>/dev/null || true
    sudo cp -r "$PROJECT_ROOT/libs" "$DEPLOY_DIR/" 2>/dev/null || true
    sudo cp "$PROJECT_ROOT/Dockerfile.app" "$DEPLOY_DIR/" 2>/dev/null || true
    sudo cp "$PROJECT_ROOT/package.json" "$DEPLOY_DIR/" 2>/dev/null || true
    sudo cp "$PROJECT_ROOT/nx.json" "$DEPLOY_DIR/" 2>/dev/null || true
    sudo cp "$PROJECT_ROOT/tsconfig.base.json" "$DEPLOY_DIR/" 2>/dev/null || true
    sudo cp "$PROJECT_ROOT/.dockerignore" "$DEPLOY_DIR/" 2>/dev/null || true
    
    # Copy project.json files
    find "$PROJECT_ROOT" -name "project.json" -type f | while read -r file; do
        local rel_path="${file#$PROJECT_ROOT/}"
        local dest_dir="$DEPLOY_DIR/$(dirname "$rel_path")"
        sudo mkdir -p "$dest_dir"
        sudo cp "$file" "$dest_dir/"
    done
    
    # Set ownership
    if [ "$EUID" -ne 0 ]; then
        sudo chown -R "$USER:$USER" "$DEPLOY_DIR"
    fi
    
    # Generate package-lock.json if it doesn't exist (using --legacy-peer-deps)
    if [ ! -f "package-lock.json" ]; then
        log_substep "package-lock.json not found. Generating with --legacy-peer-deps..."
        if command_exists npm; then
            npm install --legacy-peer-deps --package-lock-only 2>&1 | tee -a "$LOG_FILE" || {
                log_warning "Failed to generate package-lock.json. Docker build will handle it."
            }
        else
            log_warning "npm not found on host. Docker build will handle package-lock.json generation."
        fi
    else
        log_success "package-lock.json found"
    fi
    
    log_success "Deployment directory updated: $DEPLOY_DIR"
}

# ============================================================================
# Update Environment File
# ============================================================================

update_environment_file() {
    log_step "Updating Frontend Environment Configuration"
    
    cd "$DEPLOY_DIR"
    
    local ec2_ip=$(get_ec2_ip)
    
    # Check if .env.production exists
    if [ -f ".env.production" ]; then
        log_substep "Updating existing .env.production file..."
        
        # Update NEXT_PUBLIC_API_URL if it exists, or add it
        if grep -q "NEXT_PUBLIC_API_URL" .env.production; then
            # Update existing value
            if [ "$(uname)" = "Darwin" ]; then
                # macOS
                sed -i '' "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://${ec2_ip}:3001|" .env.production
            else
                # Linux
                sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://${ec2_ip}:3001|" .env.production
            fi
        else
            # Add new value
            echo "NEXT_PUBLIC_API_URL=http://${ec2_ip}:3001" >> .env.production
        fi
    else
        log_substep "Creating .env.production file..."
        cat > .env.production << EOF
# Frontend Environment Variables
# Generated automatically on $(date)

NODE_ENV=production
NEXT_PUBLIC_API_URL=http://${ec2_ip}:3001
NEXT_TELEMETRY_DISABLED=1
EOF
    fi
    
    # Also update .env for docker-compose
    cp .env.production .env
    
    log_success "Environment file updated: .env.production"
    log_info "  NEXT_PUBLIC_API_URL: http://${ec2_ip}:3001"
}

# ============================================================================
# Build Frontend Docker Image
# ============================================================================

build_frontend_image() {
    log_step "Building Frontend Docker Image"
    
    cd "$DEPLOY_DIR"
    
    local ec2_ip=$(get_ec2_ip)
    
    log_substep "Building App image (using --legacy-peer-deps for npm)..."
    log_info "Note: All npm commands in Dockerfile use --legacy-peer-deps flag"
    log_info "API URL: http://${ec2_ip}:3001"
    
    if sudo docker build \
        --build-arg NEXT_PUBLIC_API_URL="http://${ec2_ip}:3001" \
        -f Dockerfile.app \
        -t construction-mgmt-app:latest . 2>&1 | tee -a "$LOG_FILE"; then
        log_success "Frontend image built successfully"
    else
        error_exit "Failed to build frontend image. Check logs for details."
    fi
}

# ============================================================================
# Update Frontend Service
# ============================================================================

update_frontend_service() {
    log_step "Updating Frontend Service"
    
    cd "$DEPLOY_DIR"
    
    log_substep "Stopping existing frontend container..."
    sudo docker-compose -f docker-compose.prod.yml stop app 2>/dev/null || true
    sudo docker-compose -f docker-compose.prod.yml rm -f app 2>/dev/null || true
    
    log_substep "Starting frontend service with new image..."
    if sudo docker-compose -f docker-compose.prod.yml up -d app 2>&1 | tee -a "$LOG_FILE"; then
        log_success "Frontend service started"
    else
        error_exit "Failed to start frontend service"
    fi
    
    log_substep "Waiting for service to initialize..."
    sleep 10
    
    # Check container status
    log_substep "Checking container status..."
    sudo docker-compose -f docker-compose.prod.yml ps app | tee -a "$LOG_FILE"
}

# ============================================================================
# Health Checks
# ============================================================================

run_health_checks() {
    log_step "Running Frontend Health Checks"
    
    local max_attempts=30
    local all_healthy=true
    
    # Check container is running
    log_substep "Checking frontend container..."
    if sudo docker ps --format '{{.Names}}' | grep -q "^construction-mgmt-app-prod$"; then
        log_success "Frontend container is running"
    else
        log_error "Frontend container is not running"
        all_healthy=false
    fi
    
    # Check frontend is accessible
    log_substep "Checking frontend accessibility..."
    if wait_for_service "http://localhost:3000" 30; then
        log_success "Frontend is accessible"
    else
        log_warning "Frontend health check failed (may still be starting)"
        all_healthy=false
    fi
    
    # Check if backend API is accessible (for frontend to connect)
    log_substep "Checking backend API connectivity..."
    if curl -sf http://localhost:3001/api/health >/dev/null 2>&1; then
        log_success "Backend API is accessible"
    else
        log_warning "Backend API is not accessible. Frontend may not work correctly."
        log_warning "Make sure the backend API is running."
    fi
    
    if [ "$all_healthy" = true ]; then
        log_success "All frontend health checks passed!"
        return 0
    else
        log_warning "Some health checks failed. Check logs for details."
        return 1
    fi
}

# ============================================================================
# Display Summary
# ============================================================================

display_summary() {
    local ec2_ip=$(get_ec2_ip)
    
    log_step "Deployment Summary"
    
    echo ""
    echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${GREEN}║              FRONTEND DEPLOYMENT COMPLETED SUCCESSFULLY!                     ║${NC}"
    echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo -e "${BOLD}Frontend URL:${NC}"
    echo -e "  ${CYAN}http://${ec2_ip}:3000${NC}"
    echo ""
    
    echo -e "${BOLD}Backend API URL:${NC}"
    echo -e "  ${CYAN}http://${ec2_ip}:3001${NC}"
    echo ""
    
    echo -e "${BOLD}Deployment Directory:${NC}"
    echo -e "  ${CYAN}$DEPLOY_DIR${NC}"
    echo ""
    
    echo -e "${BOLD}Useful Commands:${NC}"
    echo -e "  ${YELLOW}View frontend logs:${NC}     sudo docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml logs -f app"
    echo -e "  ${YELLOW}Check status:${NC}           sudo docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml ps"
    echo -e "  ${YELLOW}Restart frontend:${NC}       sudo docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml restart app"
    echo -e "  ${YELLOW}Stop frontend:${NC}          sudo docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml stop app"
    echo ""
    
    echo -e "${BOLD}Log File:${NC}"
    echo -e "  ${CYAN}$LOG_FILE${NC}"
    echo ""
    
    echo -e "${BOLD}${YELLOW}⚠ Note:${NC}"
    echo -e "  • This deployment only updated the frontend"
    echo -e "  • Backend API and database were not affected"
    echo -e "  • Make sure backend API is running for frontend to work correctly"
    echo ""
}

# ============================================================================
# Main Execution
# ============================================================================

main() {
    clear
    echo -e "${BOLD}${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                              ║"
    echo "║          Construction Management SaaS - Frontend-Only Deployment             ║"
    echo "║                                                                              ║"
    echo "║                        Next.js Frontend Update                               ║"
    echo "║                                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    
    log_info "Starting frontend-only deployment process..."
    log_info "Log file: $LOG_FILE"
    echo ""
    
    # Run deployment steps
    check_prerequisites
    prompt_cleanup_frontend
    setup_deployment_directory
    update_environment_file
    build_frontend_image
    update_frontend_service
    run_health_checks
    display_summary
    
    log_success "Frontend deployment completed successfully!"
    echo ""
}

# Run main function
main "$@"

