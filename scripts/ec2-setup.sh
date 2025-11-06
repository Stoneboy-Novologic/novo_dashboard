#!/bin/bash

# EC2 Initial Setup Script
# 
# This script sets up a fresh EC2 instance for deployment
# Installs Docker, Docker Compose, and necessary tools
# 
# Usage:
#   Run on EC2 instance (as root or with sudo):
#   curl -fsSL https://raw.githubusercontent.com/your-repo/scripts/ec2-setup.sh | bash
#   OR
#   scp scripts/ec2-setup.sh user@ec2-host:/tmp/
#   ssh user@ec2-host "sudo bash /tmp/ec2-setup.sh"
#
# Flow:
#   1. Update system packages
#   2. Install Docker
#   3. Install Docker Compose
#   4. Configure Docker for non-root user
#   5. Set up firewall rules
#   6. Configure system limits
#   7. Verify installation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "This script must be run as root or with sudo"
        exit 1
    fi
}

# Detect OS
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        OS_VERSION=$VERSION_ID
        log_info "Detected OS: $OS $OS_VERSION"
    else
        log_error "Cannot detect OS"
        exit 1
    fi
}

# Update system packages
update_system() {
    log_info "Updating system packages..."
    
    if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
        apt-get update
        apt-get upgrade -y
        apt-get install -y \
            ca-certificates \
            curl \
            gnupg \
            lsb-release \
            apt-transport-https \
            software-properties-common
    elif [ "$OS" = "amzn" ] || [ "$OS" = "rhel" ] || [ "$OS" = "centos" ]; then
        yum update -y
        yum install -y \
            ca-certificates \
            curl \
            gnupg \
            lsb-release
    else
        log_error "Unsupported OS: $OS"
        exit 1
    fi
    
    log_success "System packages updated"
}

# Install Docker
install_docker() {
    log_info "Installing Docker..."
    
    if command -v docker &> /dev/null; then
        log_warning "Docker is already installed"
        docker --version
        return 0
    fi
    
    if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
        # Add Docker's official GPG key
        install -m 0755 -d /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/${OS}/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        chmod a+r /etc/apt/keyrings/docker.gpg
        
        # Set up repository
        echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/${OS} \
          $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
          tee /etc/apt/sources.list.d/docker.list > /dev/null
        
        # Install Docker
        apt-get update
        apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    elif [ "$OS" = "amzn" ] || [ "$OS" = "rhel" ] || [ "$OS" = "centos" ]; then
        # Install Docker for Amazon Linux / RHEL / CentOS
        yum install -y docker
        systemctl start docker
        systemctl enable docker
    fi
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    log_success "Docker installed successfully"
    docker --version
}

# Install Docker Compose (standalone)
install_docker_compose() {
    log_info "Installing Docker Compose..."
    
    if docker compose version &> /dev/null; then
        log_warning "Docker Compose is already installed (plugin)"
        docker compose version
        return 0
    fi
    
    if command -v docker-compose &> /dev/null; then
        log_warning "Docker Compose is already installed (standalone)"
        docker-compose --version
        return 0
    fi
    
    # Install Docker Compose standalone
    local compose_version="v2.23.0"
    curl -L "https://github.com/docker/compose/releases/download/${compose_version}/docker-compose-$(uname -s)-$(uname -m)" \
        -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Create symlink for docker-compose command
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    log_success "Docker Compose installed successfully"
    docker-compose --version
}

# Configure Docker for non-root user
configure_docker_user() {
    log_info "Configuring Docker for non-root user..."
    
    # Get the current user (if not root)
    local user=${SUDO_USER:-$USER}
    
    if [ "$user" != "root" ]; then
        # Add user to docker group
        usermod -aG docker "$user"
        log_success "User $user added to docker group"
        log_warning "User must log out and back in for changes to take effect"
    else
        log_warning "Running as root, skipping user configuration"
    fi
}

# Configure firewall
configure_firewall() {
    log_info "Configuring firewall..."
    
    # Check if ufw is installed (Ubuntu)
    if command -v ufw &> /dev/null; then
        # Allow SSH
        ufw allow 22/tcp
        # Allow HTTP
        ufw allow 80/tcp
        # Allow HTTPS
        ufw allow 443/tcp
        # Allow backend API (if exposing directly)
        # ufw allow 3001/tcp
        log_success "Firewall configured (UFW)"
    elif command -v firewall-cmd &> /dev/null; then
        # FirewallD (RHEL/CentOS)
        firewall-cmd --permanent --add-service=ssh
        firewall-cmd --permanent --add-service=http
        firewall-cmd --permanent --add-service=https
        firewall-cmd --reload
        log_success "Firewall configured (FirewallD)"
    else
        log_warning "No firewall detected, skipping firewall configuration"
        log_warning "Please configure your security groups in AWS"
    fi
}

# Configure system limits
configure_limits() {
    log_info "Configuring system limits..."
    
    # Increase file descriptor limits
    cat >> /etc/security/limits.conf << EOF
* soft nofile 65536
* hard nofile 65536
* soft nproc 65536
* hard nproc 65536
EOF
    
    # Configure sysctl for Docker
    cat >> /etc/sysctl.conf << EOF
# Docker optimizations
vm.max_map_count=262144
fs.file-max=2097152
net.core.somaxconn=65535
EOF
    
    sysctl -p
    
    log_success "System limits configured"
}

# Install additional tools
install_tools() {
    log_info "Installing additional tools..."
    
    if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
        apt-get install -y \
            htop \
            vim \
            git \
            unzip \
            net-tools \
            jq
    elif [ "$OS" = "amzn" ] || [ "$OS" = "rhel" ] || [ "$OS" = "centos" ]; then
        yum install -y \
            htop \
            vim \
            git \
            unzip \
            net-tools \
            jq
    fi
    
    log_success "Additional tools installed"
}

# Verify installation
verify_installation() {
    log_info "Verifying installation..."
    
    echo ""
    echo "=== Installation Verification ==="
    
    if command -v docker &> /dev/null; then
        log_success "Docker: $(docker --version)"
    else
        log_error "Docker is not installed"
    fi
    
    if docker compose version &> /dev/null; then
        log_success "Docker Compose (plugin): $(docker compose version)"
    elif command -v docker-compose &> /dev/null; then
        log_success "Docker Compose (standalone): $(docker-compose --version)"
    else
        log_error "Docker Compose is not installed"
    fi
    
    if systemctl is-active --quiet docker; then
        log_success "Docker service is running"
    else
        log_error "Docker service is not running"
    fi
    
    echo ""
    log_info "Testing Docker with hello-world..."
    docker run --rm hello-world
    
    log_success "Installation verification completed"
}

# Main execution
main() {
    log_info "Starting EC2 setup process..."
    echo ""
    
    check_root
    detect_os
    update_system
    install_docker
    install_docker_compose
    configure_docker_user
    configure_firewall
    configure_limits
    install_tools
    verify_installation
    
    echo ""
    log_success "EC2 setup completed successfully!"
    echo ""
    log_info "Next steps:"
    echo "  1. Log out and back in (if user was added to docker group)"
    echo "  2. Run: docker ps (to verify Docker works)"
    echo "  3. Deploy your application"
}

main

