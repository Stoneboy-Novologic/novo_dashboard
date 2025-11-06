#!/bin/bash

# Docker Development Script
# 
# This script manages Docker development environment
# 
# Usage:
#   ./scripts/docker-dev.sh [command]
# 
# Commands:
#   start       Start all services (default)
#   stop        Stop all services
#   restart     Restart all services
#   logs        View logs from all services
#   logs-api    View logs from API service only
#   logs-app    View logs from App service only
#   logs-db     View logs from database service only
#   shell-api   Open shell in API container
#   shell-app   Open shell in App container
#   shell-db    Open PostgreSQL shell
#   clean       Stop and remove all containers, volumes (WARNING: deletes data)
#   rebuild     Rebuild and restart all services
#   status      Show status of all services
#
# Flow:
#   1. Check prerequisites
#   2. Execute command
#   3. Display status/logs as needed

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
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running"
        exit 1
    fi
}

# Start services
start_services() {
    log_info "Starting development services..."
    cd "$PROJECT_ROOT"
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        log_warning ".env file not found. Creating from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_warning "Please edit .env file with your configuration"
        fi
    fi
    
    docker-compose up -d
    
    log_success "Services started"
    log_info "Waiting for services to be healthy..."
    sleep 5
    
    show_status
}

# Stop services
stop_services() {
    log_info "Stopping development services..."
    cd "$PROJECT_ROOT"
    docker-compose down
    log_success "Services stopped"
}

# Restart services
restart_services() {
    log_info "Restarting development services..."
    cd "$PROJECT_ROOT"
    docker-compose restart
    log_success "Services restarted"
    show_status
}

# View logs
view_logs() {
    cd "$PROJECT_ROOT"
    docker-compose logs -f
}

# View API logs
view_api_logs() {
    cd "$PROJECT_ROOT"
    docker-compose logs -f api
}

# View App logs
view_app_logs() {
    cd "$PROJECT_ROOT"
    docker-compose logs -f app
}

# View database logs
view_db_logs() {
    cd "$PROJECT_ROOT"
    docker-compose logs -f postgres
}

# Open shell in API container
shell_api() {
    cd "$PROJECT_ROOT"
    docker-compose exec api sh
}

# Open shell in App container
shell_app() {
    cd "$PROJECT_ROOT"
    docker-compose exec app sh
}

# Open PostgreSQL shell
shell_db() {
    cd "$PROJECT_ROOT"
    local db_user="${DB_USERNAME:-postgres}"
    docker-compose exec postgres psql -U "$db_user" -d "${DB_DATABASE:-construction_mgmt}"
}

# Clean everything (WARNING: deletes data)
clean_all() {
    log_warning "This will remove all containers, volumes, and data!"
    read -p "Are you sure? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        log_info "Clean cancelled"
        return
    fi
    
    log_info "Cleaning up..."
    cd "$PROJECT_ROOT"
    docker-compose down -v --remove-orphans
    log_success "Cleanup completed"
}

# Rebuild and restart
rebuild_services() {
    log_info "Rebuilding services..."
    cd "$PROJECT_ROOT"
    docker-compose build --no-cache
    docker-compose up -d
    log_success "Services rebuilt and restarted"
    show_status
}

# Show status
show_status() {
    log_info "Service Status:"
    cd "$PROJECT_ROOT"
    docker-compose ps
    
    echo ""
    log_info "Service URLs:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:3001"
    echo "  Database: localhost:5432"
    echo ""
    log_info "Useful commands:"
    echo "  View logs: ./scripts/docker-dev.sh logs"
    echo "  Stop services: ./scripts/docker-dev.sh stop"
    echo "  Restart services: ./scripts/docker-dev.sh restart"
}

# Main execution
main() {
    check_prerequisites
    
    local command="${1:-start}"
    
    case "$command" in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        logs)
            view_logs
            ;;
        logs-api)
            view_api_logs
            ;;
        logs-app)
            view_app_logs
            ;;
        logs-db)
            view_db_logs
            ;;
        shell-api)
            shell_api
            ;;
        shell-app)
            shell_app
            ;;
        shell-db)
            shell_db
            ;;
        clean)
            clean_all
            ;;
        rebuild)
            rebuild_services
            ;;
        status)
            show_status
            ;;
        *)
            log_error "Unknown command: $command"
            echo ""
            echo "Available commands:"
            echo "  start, stop, restart, logs, logs-api, logs-app, logs-db"
            echo "  shell-api, shell-app, shell-db, clean, rebuild, status"
            exit 1
            ;;
    esac
}

main "$@"

