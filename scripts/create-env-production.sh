#!/bin/bash

# Script to create .env.production file with required variables
# 
# Usage:
#   ./scripts/create-env-production.sh
#   OR
#   bash scripts/create-env-production.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get EC2 public IP
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "localhost")

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

# Generate random password
generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
}

# Generate JWT secret
generate_jwt_secret() {
    openssl rand -base64 64 | tr -d "=+/" | cut -c1-64
}

log_info "Creating .env.production file..."

# Check if .env.production already exists
if [ -f .env.production ]; then
    log_warning ".env.production already exists. Creating backup..."
    cp .env.production .env.production.backup.$(date +%Y%m%d_%H%M%S)
fi

# Generate secure values
DB_PASSWORD=$(generate_password)
JWT_SECRET=$(generate_jwt_secret)

# Create .env.production file
cat > .env.production << EOF
# Production Environment Variables
# Generated on $(date)

# Node Environment
NODE_ENV=production

# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=${DB_PASSWORD}
DB_DATABASE=construction_mgmt

# API Configuration
PORT=3001
NEXT_PORT=3000

# API URLs
API_URL=http://${EC2_IP}:3001
NEXT_PUBLIC_API_URL=http://${EC2_IP}:3001

# Authentication Configuration
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# OAuth Configuration (Optional - leave empty if not using)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://${EC2_IP}:3001/api/auth/google/callback

MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_CALLBACK_URL=http://${EC2_IP}:3001/api/auth/microsoft/callback
MICROSOFT_TENANT=common

# CORS Configuration
CORS_ORIGIN=http://${EC2_IP}:3000,http://localhost:3000

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

log_success ".env.production file created successfully!"
echo ""
log_info "Generated values:"
echo "  DB_PASSWORD: ${DB_PASSWORD}"
echo "  JWT_SECRET: ${JWT_SECRET:0:20}..."
echo ""
log_warning "IMPORTANT: Save these values securely!"
log_info "You can view the full file with: cat .env.production"
echo ""
log_info "Next steps:"
echo "  1. Review the .env.production file: cat .env.production"
echo "  2. Update any values if needed: nano .env.production"
echo "  3. Copy to .env for docker-compose: cp .env.production .env"
echo "  4. Build and start services: docker-compose -f docker-compose.prod.yml up -d"

