#!/bin/bash

# Health Check Script
# 
# This script checks the health of all services
# Can be run locally or on remote server
# 
# Usage:
#   ./scripts/health-check.sh [options]
# 
# Options:
#   --remote HOST         Check health on remote EC2 instance
#   --user USER           SSH username (default: ubuntu)
#   --key KEY_PATH        Path to SSH private key
#   --api-url URL         API URL to check (default: http://localhost:3001)
#   --app-url URL         App URL to check (default: http://localhost:3000)
#
# Flow:
#   1. Check Docker containers status
#   2. Check service health endpoints
#   3. Check database connectivity
#   4. Display health status

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

# Configuration
REMOTE_HOST=""
SSH_USER="ubuntu"
SSH_KEY=""
API_URL="http://localhost:3001"
APP_URL="http://localhost:3000"
REMOTE_MODE=false

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
            --remote)
                REMOTE_HOST="$2"
                REMOTE_MODE=true
                shift 2
                ;;
            --user)
                SSH_USER="$2"
                shift 2
                ;;
            --key)
                SSH_KEY="$2"
                shift 2
                ;;
            --api-url)
                API_URL="$2"
                shift 2
                ;;
            --app-url)
                APP_URL="$2"
                shift 2
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
}

# Check Docker containers
check_containers() {
    log_info "Checking Docker containers..."
    
    if [ "$REMOTE_MODE" = true ]; then
        local containers=$(ssh -i "$SSH_KEY" "$SSH_USER@$REMOTE_HOST" "docker ps --format '{{.Names}}'")
    else
        local containers=$(docker ps --format '{{.Names}}')
    fi
    
    local all_healthy=true
    
    # Check for required containers
    local required_containers=("postgres" "api" "app")
    
    for container in "${required_containers[@]}"; do
        if echo "$containers" | grep -q "$container"; then
            log_success "Container $container is running"
        else
            log_error "Container $container is not running"
            all_healthy=false
        fi
    done
    
    if [ "$all_healthy" = true ]; then
        log_success "All containers are running"
        return 0
    else
        return 1
    fi
}

# Check API health
check_api_health() {
    log_info "Checking API health ($API_URL/api/health)..."
    
    local response
    if [ "$REMOTE_MODE" = true ]; then
        response=$(ssh -i "$SSH_KEY" "$SSH_USER@$REMOTE_HOST" "curl -s -o /dev/null -w '%{http_code}' $API_URL/api/health || echo '000'")
    else
        response=$(curl -s -o /dev/null -w '%{http_code}' "$API_URL/api/health" || echo '000')
    fi
    
    if [ "$response" = "200" ]; then
        log_success "API health check passed"
        return 0
    else
        log_error "API health check failed (HTTP $response)"
        return 1
    fi
}

# Check App health
check_app_health() {
    log_info "Checking App health ($APP_URL/api/health)..."
    
    local response
    if [ "$REMOTE_MODE" = true ]; then
        response=$(ssh -i "$SSH_KEY" "$SSH_USER@$REMOTE_HOST" "curl -s -o /dev/null -w '%{http_code}' $APP_URL/api/health || echo '000'")
    else
        response=$(curl -s -o /dev/null -w '%{http_code}' "$APP_URL/api/health" || echo '000')
    fi
    
    if [ "$response" = "200" ]; then
        log_success "App health check passed"
        return 0
    else
        log_warning "App health check failed (HTTP $response) - may not have health endpoint"
        return 0  # Don't fail if app doesn't have health endpoint
    fi
}

# Check database connectivity
check_database() {
    log_info "Checking database connectivity..."
    
    if [ "$REMOTE_MODE" = true ]; then
        local db_check=$(ssh -i "$SSH_KEY" "$SSH_USER@$REMOTE_HOST" \
            "docker exec construction-mgmt-postgres-prod pg_isready -U postgres 2>&1 || echo 'failed'")
    else
        local db_check=$(docker exec construction-mgmt-postgres pg_isready -U postgres 2>&1 || echo 'failed')
    fi
    
    if echo "$db_check" | grep -q "accepting connections"; then
        log_success "Database is accepting connections"
        return 0
    else
        log_error "Database is not accepting connections"
        return 1
    fi
}

# Check disk space
check_disk_space() {
    log_info "Checking disk space..."
    
    local disk_usage
    if [ "$REMOTE_MODE" = true ]; then
        disk_usage=$(ssh -i "$SSH_KEY" "$SSH_USER@$REMOTE_HOST" "df -h / | tail -1 | awk '{print \$5}' | sed 's/%//'")
    else
        disk_usage=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
    fi
    
    if [ "$disk_usage" -lt 80 ]; then
        log_success "Disk space is healthy (${disk_usage}% used)"
        return 0
    elif [ "$disk_usage" -lt 90 ]; then
        log_warning "Disk space is getting low (${disk_usage}% used)"
        return 0
    else
        log_error "Disk space is critically low (${disk_usage}% used)"
        return 1
    fi
}

# Display service status
display_status() {
    log_info "Service Status:"
    
    if [ "$REMOTE_MODE" = true ]; then
        ssh -i "$SSH_KEY" "$SSH_USER@$REMOTE_HOST" "cd /opt/construction-mgmt && docker-compose -f docker-compose.prod.yml ps"
    else
        cd "$PROJECT_ROOT"
        docker-compose ps
    fi
}

# Main execution
main() {
    log_info "Starting health check..."
    echo ""
    
    parse_arguments "$@"
    
    local all_checks_passed=true
    
    check_containers || all_checks_passed=false
    check_api_health || all_checks_passed=false
    check_app_health || true  # Don't fail on app health
    check_database || all_checks_passed=false
    check_disk_space || true  # Don't fail on disk space
    
    echo ""
    display_status
    
    echo ""
    if [ "$all_checks_passed" = true ]; then
        log_success "All health checks passed!"
        exit 0
    else
        log_error "Some health checks failed"
        exit 1
    fi
}

main "$@"

