#!/bin/bash

# Complete EC2 Deployment Script
# 
# This is a comprehensive, enterprise-grade deployment script that handles
# everything from a fresh EC2 instance to a fully deployed application.
# 
# Usage:
#   ./scripts/deploy-ec2-complete.sh
# 
# What it does:
#   1. Checks prerequisites and system requirements
#   2. Installs Docker and Docker Compose (if needed)
#   3. Sets up the deployment directory
#   4. Creates production environment file with secure values
#   5. Builds Docker images
#   6. Starts all services
#   7. Runs health checks
#   8. Displays deployment summary
#
# Requirements:
#   - Run on EC2 instance (Ubuntu 20.04+ or Amazon Linux 2+)
#   - Run from project root directory
#   - Internet connection for downloading dependencies

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# ============================================================================
# Configuration
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEPLOY_DIR="/opt/construction-mgmt"
LOG_FILE="/tmp/deployment-$(date +%Y%m%d-%H%M%S).log"

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
    log_error "Deployment failed. Check logs at: $LOG_FILE"
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
        # Try to get from hostname or use localhost
        ip=$(hostname -I | awk '{print $1}' || echo "localhost")
    fi
    echo "$ip"
}

# Generate random password
generate_password() {
    openssl rand -base64 32 2>/dev/null | tr -d "=+/" | cut -c1-25 || \
    cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 25 | head -n 1
}

# Generate JWT secret
generate_jwt_secret() {
    openssl rand -base64 64 2>/dev/null | tr -d "=+/" | cut -c1-64 || \
    cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1
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
    
    # Check if running on EC2 or Linux
    if [ ! -f /etc/os-release ]; then
        error_exit "Cannot detect operating system"
    fi
    
    . /etc/os-release
    log_success "Detected OS: $NAME $VERSION"
    
    # Check disk space (need at least 5GB free)
    local available_space=$(df -BG / | tail -1 | awk '{print $4}' | sed 's/G//')
    if [ "$available_space" -lt 5 ]; then
        error_exit "Insufficient disk space. Need at least 5GB, have ${available_space}GB"
    fi
    log_success "Disk space: ${available_space}GB available"
    
    # Check memory (need at least 2GB)
    local total_mem=$(free -g | awk '/^Mem:/{print $2}')
    if [ "$total_mem" -lt 2 ]; then
        log_warning "Low memory: ${total_mem}GB. Recommended: 4GB+"
    else
        log_success "Memory: ${total_mem}GB available"
    fi
    
    # Check internet connectivity
    if ! curl -sf --max-time 5 https://www.google.com >/dev/null 2>&1; then
        error_exit "No internet connectivity. Please check network settings."
    fi
    log_success "Internet connectivity: OK"
    
    # Check if running as root or with sudo
    if [ "$EUID" -ne 0 ] && ! sudo -n true 2>/dev/null; then
        error_exit "This script requires root privileges or sudo access"
    fi
    
    log_success "Prerequisites check passed!"
}

# ============================================================================
# Install Docker
# ============================================================================

install_docker() {
    log_step "Installing Docker and Docker Compose"
    
    if command_exists docker && docker --version >/dev/null 2>&1; then
        log_success "Docker is already installed: $(docker --version)"
    else
        log_substep "Installing Docker..."
        
        if [ "$ID" = "ubuntu" ] || [ "$ID" = "debian" ]; then
            # Update package index
            sudo apt-get update -qq
            
            # Install prerequisites
            sudo apt-get install -y -qq \
                ca-certificates \
                curl \
                gnupg \
                lsb-release \
                apt-transport-https \
                software-properties-common >/dev/null 2>&1
            
            # Add Docker's official GPG key
            sudo install -m 0755 -d /etc/apt/keyrings
            curl -fsSL https://download.docker.com/linux/${ID}/gpg | \
                sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
            sudo chmod a+r /etc/apt/keyrings/docker.gpg
            
            # Set up repository
            echo \
              "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/${ID} \
              $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
              sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            
            # Install Docker
            sudo apt-get update -qq
            sudo apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin >/dev/null 2>&1
            
        elif [ "$ID" = "amzn" ] || [ "$ID" = "rhel" ] || [ "$ID" = "centos" ]; then
            sudo yum update -y -q >/dev/null 2>&1
            sudo yum install -y -q docker >/dev/null 2>&1
            sudo systemctl start docker
            sudo systemctl enable docker
        else
            error_exit "Unsupported OS: $ID"
        fi
        
        # Start and enable Docker
        sudo systemctl start docker
        sudo systemctl enable docker >/dev/null 2>&1
        
        log_success "Docker installed: $(docker --version)"
    fi
    
    # Install Docker Compose (standalone) if not available as plugin
    if ! docker compose version >/dev/null 2>&1 && ! command_exists docker-compose; then
        log_substep "Installing Docker Compose..."
        local compose_version="v2.23.0"
        sudo curl -L "https://github.com/docker/compose/releases/download/${compose_version}/docker-compose-$(uname -s)-$(uname -m)" \
            -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        log_success "Docker Compose installed"
    else
        log_success "Docker Compose is available"
    fi
    
    # Add current user to docker group (if not root)
    if [ "$EUID" -ne 0 ]; then
        if ! groups | grep -q docker; then
            log_substep "Adding user to docker group..."
            sudo usermod -aG docker "$USER"
            log_warning "User added to docker group. You may need to log out and back in."
            log_warning "For now, using sudo for docker commands..."
        fi
    fi
    
    # Test Docker
    if sudo docker run --rm hello-world >/dev/null 2>&1; then
        log_success "Docker is working correctly"
    else
        error_exit "Docker installation test failed"
    fi
}

# ============================================================================
# Setup Deployment Directory
# ============================================================================

setup_deployment_directory() {
    log_step "Setting Up Deployment Directory"
    
    # Check if we're in the project root
    if [ ! -f "$PROJECT_ROOT/package.json" ] || [ ! -f "$PROJECT_ROOT/Dockerfile.api" ]; then
        error_exit "Please run this script from the project root directory"
    fi
    
    log_substep "Creating deployment directory: $DEPLOY_DIR"
    sudo mkdir -p "$DEPLOY_DIR"
    
    log_substep "Copying project files..."
    sudo cp -r "$PROJECT_ROOT"/* "$DEPLOY_DIR/" 2>/dev/null || true
    sudo cp -r "$PROJECT_ROOT"/.dockerignore "$DEPLOY_DIR/" 2>/dev/null || true
    
    # Set ownership
    if [ "$EUID" -ne 0 ]; then
        sudo chown -R "$USER:$USER" "$DEPLOY_DIR"
    fi
    
    cd "$DEPLOY_DIR"
    log_success "Deployment directory ready: $DEPLOY_DIR"
}

# ============================================================================
# Create Environment File
# ============================================================================

create_environment_file() {
    log_step "Creating Production Environment File"
    
    cd "$DEPLOY_DIR"
    
    local ec2_ip=$(get_ec2_ip)
    local db_password=$(generate_password)
    local jwt_secret=$(generate_jwt_secret)
    
    log_substep "EC2 IP detected: $ec2_ip"
    log_substep "Generating secure passwords and secrets..."
    
    cat > .env.production << EOF
# Production Environment Variables
# Generated automatically on $(date)
# DO NOT COMMIT THIS FILE TO VERSION CONTROL

# Node Environment
NODE_ENV=production

# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=${db_password}
DB_DATABASE=construction_mgmt

# API Configuration
PORT=3001
NEXT_PORT=3000

# API URLs
API_URL=http://${ec2_ip}:3001
NEXT_PUBLIC_API_URL=http://${ec2_ip}:3001

# Authentication Configuration
JWT_SECRET=${jwt_secret}
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# OAuth Configuration (Optional - configure if using OAuth)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://${ec2_ip}:3001/api/auth/google/callback

MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_CALLBACK_URL=http://${ec2_ip}:3001/api/auth/microsoft/callback
MICROSOFT_TENANT=common

# CORS Configuration
CORS_ORIGIN=http://${ec2_ip}:3000,http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
UPLOAD_DIR=/app/uploads

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=json
LOG_FILE_PATH=/app/logs

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

    # Also create .env for docker-compose
    cp .env.production .env
    
    log_success "Environment file created: .env.production"
    log_warning "IMPORTANT: Save these credentials securely!"
    log_info "  DB_PASSWORD: ${db_password}"
    log_info "  JWT_SECRET: ${jwt_secret:0:20}..."
}

# ============================================================================
# Build Docker Images
# ============================================================================

build_docker_images() {
    log_step "Building Docker Images"
    
    cd "$DEPLOY_DIR"
    
    log_substep "Building API image..."
    if sudo docker build -f Dockerfile.api -t construction-mgmt-api:latest . 2>&1 | tee -a "$LOG_FILE"; then
        log_success "API image built successfully"
    else
        error_exit "Failed to build API image"
    fi
    
    log_substep "Building App image..."
    local ec2_ip=$(get_ec2_ip)
    if sudo docker build \
        --build-arg NEXT_PUBLIC_API_URL="http://${ec2_ip}:3001" \
        -f Dockerfile.app \
        -t construction-mgmt-app:latest . 2>&1 | tee -a "$LOG_FILE"; then
        log_success "App image built successfully"
    else
        error_exit "Failed to build App image"
    fi
    
    log_success "All Docker images built successfully"
}

# ============================================================================
# Start Services
# ============================================================================

start_services() {
    log_step "Starting Services"
    
    cd "$DEPLOY_DIR"
    
    log_substep "Stopping any existing containers..."
    sudo docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    
    log_substep "Starting all services..."
    if sudo docker-compose -f docker-compose.prod.yml up -d 2>&1 | tee -a "$LOG_FILE"; then
        log_success "Services started"
    else
        error_exit "Failed to start services"
    fi
    
    log_substep "Waiting for services to initialize..."
    sleep 10
    
    # Check container status
    log_substep "Checking container status..."
    sudo docker-compose -f docker-compose.prod.yml ps | tee -a "$LOG_FILE"
}

# ============================================================================
# Health Checks
# ============================================================================

run_health_checks() {
    log_step "Running Health Checks"
    
    local max_attempts=30
    local attempt=0
    local all_healthy=true
    
    # Check containers are running
    log_substep "Checking containers..."
    local containers=("construction-mgmt-postgres-prod" "construction-mgmt-api-prod" "construction-mgmt-app-prod")
    for container in "${containers[@]}"; do
        if sudo docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
            log_success "Container $container is running"
        else
            log_error "Container $container is not running"
            all_healthy=false
        fi
    done
    
    # Check database
    log_substep "Checking database..."
    if sudo docker exec construction-mgmt-postgres-prod pg_isready -U postgres >/dev/null 2>&1; then
        log_success "Database is accepting connections"
    else
        log_warning "Database health check failed (may still be starting)"
        all_healthy=false
    fi
    
    # Check API
    log_substep "Checking API health endpoint..."
    if wait_for_service "http://localhost:3001/api/health" 30; then
        log_success "API health check passed"
    else
        log_warning "API health check failed (check logs)"
        all_healthy=false
    fi
    
    # Check App
    log_substep "Checking App..."
    if curl -sf http://localhost:3000 >/dev/null 2>&1; then
        log_success "App is responding"
    else
        log_warning "App health check failed (may still be starting)"
        all_healthy=false
    fi
    
    if [ "$all_healthy" = true ]; then
        log_success "All health checks passed!"
        return 0
    else
        log_warning "Some health checks failed. Services may still be starting."
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
    echo -e "${BOLD}${GREEN}║                    DEPLOYMENT COMPLETED SUCCESSFULLY!                        ║${NC}"
    echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo -e "${BOLD}Service URLs:${NC}"
    echo -e "  ${CYAN}Frontend:${NC}    http://${ec2_ip}:3000"
    echo -e "  ${CYAN}Backend API:${NC}  http://${ec2_ip}:3001"
    echo -e "  ${CYAN}Health Check:${NC} http://${ec2_ip}:3001/api/health"
    echo ""
    
    echo -e "${BOLD}Deployment Directory:${NC}"
    echo -e "  ${CYAN}$DEPLOY_DIR${NC}"
    echo ""
    
    echo -e "${BOLD}Useful Commands:${NC}"
    echo -e "  ${YELLOW}View logs:${NC}        sudo docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml logs -f"
    echo -e "  ${YELLOW}Check status:${NC}     sudo docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml ps"
    echo -e "  ${YELLOW}Restart services:${NC} sudo docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml restart"
    echo -e "  ${YELLOW}Stop services:${NC}    sudo docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml down"
    echo ""
    
    echo -e "${BOLD}Log File:${NC}"
    echo -e "  ${CYAN}$LOG_FILE${NC}"
    echo ""
    
    echo -e "${BOLD}${YELLOW}⚠ IMPORTANT:${NC}"
    echo -e "  • Save your credentials from .env.production file"
    echo -e "  • Configure security groups to allow traffic on ports 3000, 3001"
    echo -e "  • Set up SSL/TLS for production use"
    echo -e "  • Configure regular database backups"
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
    echo "║          Construction Management SaaS - Complete EC2 Deployment             ║"
    echo "║                                                                              ║"
    echo "║                    Enterprise-Grade Full Stack Setup                         ║"
    echo "║                  PostgreSQL + Next.js + NestJS + Docker                      ║"
    echo "║                                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    
    log_info "Starting deployment process..."
    log_info "Log file: $LOG_FILE"
    echo ""
    
    # Run deployment steps
    check_prerequisites
    install_docker
    setup_deployment_directory
    create_environment_file
    build_docker_images
    start_services
    run_health_checks
    display_summary
    
    log_success "Deployment completed successfully!"
    echo ""
}

# Run main function
main "$@"

