#!/bin/bash

# EC2 Deployment Script
# 
# This script deploys the application to an EC2 instance
# 
# Usage:
#   ./scripts/deploy-ec2.sh [options]
# 
# Options:
#   --host HOST           EC2 hostname or IP (required)
#   --user USER           SSH username (default: ubuntu)
#   --key KEY_PATH        Path to SSH private key (required)
#   --env ENV_FILE        Environment file to use (default: .env.production)
#   --skip-setup          Skip initial server setup
#   --skip-build          Skip building Docker images locally
# 
# Prerequisites:
#   - EC2 instance must have SSH access configured
#   - SSH key with proper permissions
#   - Docker and Docker Compose installed on EC2 (or use --skip-setup=false)
#
# Flow:
#   1. Validate inputs and prerequisites
#   2. Build Docker images (optional)
#   3. Transfer files to EC2
#   4. Run deployment on EC2
#   5. Verify deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Default configuration
EC2_HOST=""
EC2_USER="ubuntu"
SSH_KEY=""
ENV_FILE=".env.production"
SKIP_SETUP=false
SKIP_BUILD=false
REMOTE_DIR="/opt/construction-mgmt"

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

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --host)
                EC2_HOST="$2"
                shift 2
                ;;
            --user)
                EC2_USER="$2"
                shift 2
                ;;
            --key)
                SSH_KEY="$2"
                shift 2
                ;;
            --env)
                ENV_FILE="$2"
                shift 2
                ;;
            --skip-setup)
                SKIP_SETUP=true
                shift
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                echo "Usage: $0 --host HOST --key KEY_PATH [options]"
                exit 1
                ;;
        esac
    done
}

# Validate inputs
validate_inputs() {
    log_info "Validating inputs..."
    
    if [ -z "$EC2_HOST" ]; then
        log_error "EC2 host is required. Use --host option."
        exit 1
    fi
    
    if [ -z "$SSH_KEY" ]; then
        log_error "SSH key path is required. Use --key option."
        exit 1
    fi
    
    if [ ! -f "$SSH_KEY" ]; then
        log_error "SSH key file not found: $SSH_KEY"
        exit 1
    fi
    
    # Set proper permissions for SSH key
    chmod 600 "$SSH_KEY"
    
    if [ ! -f "$PROJECT_ROOT/$ENV_FILE" ]; then
        log_warning "Environment file not found: $ENV_FILE"
        log_warning "Please create $ENV_FILE with production configuration"
    fi
    
    log_success "Input validation passed"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v ssh &> /dev/null; then
        log_error "SSH is not installed"
        exit 1
    fi
    
    if ! command -v scp &> /dev/null; then
        log_error "SCP is not installed"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Test SSH connection
test_ssh_connection() {
    log_info "Testing SSH connection to $EC2_USER@$EC2_HOST..."
    
    if ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=10 \
       "$EC2_USER@$EC2_HOST" "echo 'Connection successful'" &> /dev/null; then
        log_success "SSH connection successful"
        return 0
    else
        log_error "Failed to connect to EC2 instance"
        log_error "Please check:"
        log_error "  - EC2 instance is running"
        log_error "  - Security group allows SSH (port 22)"
        log_error "  - SSH key is correct"
        log_error "  - Username is correct ($EC2_USER)"
        exit 1
    fi
}

# Build Docker images locally (optional)
build_images_locally() {
    if [ "$SKIP_BUILD" = true ]; then
        log_info "Skipping local Docker build"
        return 0
    fi
    
    log_info "Building Docker images locally..."
    "$SCRIPT_DIR/docker-build.sh"
    log_success "Docker images built locally"
}

# Run initial server setup
run_server_setup() {
    if [ "$SKIP_SETUP" = true ]; then
        log_info "Skipping server setup"
        return 0
    fi
    
    log_info "Running initial server setup..."
    
    # Transfer setup script
    scp -i "$SSH_KEY" "$SCRIPT_DIR/ec2-setup.sh" "$EC2_USER@$EC2_HOST:/tmp/"
    
    # Run setup script
    ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "chmod +x /tmp/ec2-setup.sh && sudo /tmp/ec2-setup.sh"
    
    log_success "Server setup completed"
}

# Create deployment package
create_deployment_package() {
    log_info "Creating deployment package..."
    
    local temp_dir=$(mktemp -d)
    local package_dir="$temp_dir/construction-mgmt"
    
    mkdir -p "$package_dir"
    
    # Copy necessary files
    cp -r "$PROJECT_ROOT/Dockerfile.api" "$package_dir/"
    cp -r "$PROJECT_ROOT/Dockerfile.app" "$package_dir/"
    cp -r "$PROJECT_ROOT/docker-compose.prod.yml" "$package_dir/"
    cp -r "$PROJECT_ROOT/.dockerignore" "$package_dir/" 2>/dev/null || true
    cp -r "$PROJECT_ROOT/package.json" "$package_dir/"
    cp -r "$PROJECT_ROOT/package-lock.json" "$package_dir/" 2>/dev/null || true
    cp -r "$PROJECT_ROOT/nx.json" "$package_dir/"
    cp -r "$PROJECT_ROOT/tsconfig.base.json" "$package_dir/"
    
    # Copy source code
    cp -r "$PROJECT_ROOT/apps" "$package_dir/"
    cp -r "$PROJECT_ROOT/libs" "$package_dir/"
    cp -r "$PROJECT_ROOT/components" "$package_dir/" 2>/dev/null || true
    cp -r "$PROJECT_ROOT/public" "$package_dir/" 2>/dev/null || true
    cp -r "$PROJECT_ROOT/styles" "$package_dir/" 2>/dev/null || true
    cp -r "$PROJECT_ROOT/hooks" "$package_dir/" 2>/dev/null || true
    cp -r "$PROJECT_ROOT/lib" "$package_dir/" 2>/dev/null || true
    
    # Copy project.json files
    find "$PROJECT_ROOT" -name "project.json" -type f | while read -r file; do
        local rel_path="${file#$PROJECT_ROOT/}"
        local dest_dir="$package_dir/$(dirname "$rel_path")"
        mkdir -p "$dest_dir"
        cp "$file" "$dest_dir/"
    done
    
    # Copy environment file if exists
    if [ -f "$PROJECT_ROOT/$ENV_FILE" ]; then
        cp "$PROJECT_ROOT/$ENV_FILE" "$package_dir/.env"
    fi
    
    # Create tarball
    cd "$temp_dir"
    tar -czf construction-mgmt.tar.gz construction-mgmt/
    
    echo "$temp_dir/construction-mgmt.tar.gz"
}

# Transfer files to EC2
transfer_files() {
    log_info "Transferring files to EC2..."
    
    local package_file=$(create_deployment_package)
    
    # Create remote directory
    ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "sudo mkdir -p $REMOTE_DIR && sudo chown $EC2_USER:$EC2_USER $REMOTE_DIR"
    
    # Transfer package
    scp -i "$SSH_KEY" "$package_file" "$EC2_USER@$EC2_HOST:/tmp/"
    
    # Extract on remote
    ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "cd $REMOTE_DIR && tar -xzf /tmp/construction-mgmt.tar.gz --strip-components=1 && rm /tmp/construction-mgmt.tar.gz"
    
    # Cleanup local temp
    rm -rf "$(dirname "$package_file")"
    
    log_success "Files transferred successfully"
}

# Deploy on EC2
deploy_on_ec2() {
    log_info "Deploying application on EC2..."
    
    ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" << EOF
        set -e
        cd $REMOTE_DIR
        
        echo "[deploy] Stopping existing containers..."
        docker-compose -f docker-compose.prod.yml down || true
        
        echo "[deploy] Building Docker images..."
        docker-compose -f docker-compose.prod.yml build --no-cache
        
        echo "[deploy] Starting services..."
        docker-compose -f docker-compose.prod.yml up -d
        
        echo "[deploy] Waiting for services to start..."
        sleep 10
        
        echo "[deploy] Deployment completed"
EOF
    
    log_success "Application deployed on EC2"
}

# Verify deployment
verify_deployment() {
    log_info "Verifying deployment..."
    
    # Run health check script on remote
    scp -i "$SSH_KEY" "$SCRIPT_DIR/health-check.sh" "$EC2_USER@$EC2_HOST:/tmp/"
    ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "chmod +x /tmp/health-check.sh && /tmp/health-check.sh"
    
    log_success "Deployment verification completed"
}

# Display deployment info
display_deployment_info() {
    log_success "Deployment completed successfully!"
    echo ""
    log_info "Deployment Information:"
    echo "  Host: $EC2_HOST"
    echo "  Remote Directory: $REMOTE_DIR"
    echo ""
    log_info "Next steps:"
    echo "  - SSH to server: ssh -i $SSH_KEY $EC2_USER@$EC2_HOST"
    echo "  - View logs: ssh -i $SSH_KEY $EC2_USER@$EC2_HOST 'cd $REMOTE_DIR && docker-compose -f docker-compose.prod.yml logs -f'"
    echo "  - Check status: ssh -i $SSH_KEY $EC2_USER@$EC2_HOST 'cd $REMOTE_DIR && docker-compose -f docker-compose.prod.yml ps'"
}

# Main execution
main() {
    log_info "Starting EC2 deployment process..."
    echo ""
    
    parse_arguments "$@"
    validate_inputs
    check_prerequisites
    test_ssh_connection
    
    build_images_locally
    run_server_setup
    transfer_files
    deploy_on_ec2
    verify_deployment
    display_deployment_info
    
    log_success "EC2 deployment process completed successfully!"
}

main "$@"

