# Docker Setup Guide

This guide covers setting up and running the Construction Management application using Docker.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Production Setup](#production-setup)
- [Docker Commands](#docker-commands)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Docker Desktop (for Mac/Windows) or Docker Engine (for Linux)
- Docker Compose (included with Docker Desktop)
- Minimum 4GB RAM available for Docker
- At least 10GB free disk space

### Installing Docker

- **macOS/Windows**: Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: Follow [Docker Engine installation guide](https://docs.docker.com/engine/install/)

Verify installation:
```bash
docker --version
docker-compose --version
```

## Quick Start

1. **Clone the repository** (if not already done):
```bash
git clone <repository-url>
cd construction-mnagement-v1
```

2. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Build and start services**:
```bash
npm run docker:dev:start
# OR
docker-compose up -d
```

4. **Access the application**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432

5. **View logs**:
```bash
npm run docker:dev:logs
# OR
docker-compose logs -f
```

## Development Setup

### Using npm Scripts

The project includes convenient npm scripts for Docker operations:

```bash
# Start all services
npm run docker:dev:start

# Stop all services
npm run docker:dev:stop

# Restart services
npm run docker:dev:restart

# View logs
npm run docker:dev:logs

# View logs for specific service
npm run docker:dev:logs:api
npm run docker:dev:logs:app
npm run docker:dev:logs:db

# Open shell in container
npm run docker:dev:shell:api
npm run docker:dev:shell:app
npm run docker:dev:shell:db

# Rebuild and restart
npm run docker:dev:rebuild

# Clean everything (WARNING: deletes data)
npm run docker:dev:clean

# Check status
npm run docker:dev:status
```

### Using Docker Compose Directly

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api
docker-compose logs -f app
docker-compose logs -f postgres

# Execute commands in containers
docker-compose exec api sh
docker-compose exec app sh
docker-compose exec postgres psql -U postgres -d construction_mgmt

# Rebuild images
docker-compose build --no-cache

# Restart specific service
docker-compose restart api
```

### Building Docker Images

Build all images:
```bash
npm run docker:build
```

Build specific service:
```bash
npm run docker:build:api
npm run docker:build:app
```

Build without cache:
```bash
npm run docker:build:no-cache
```

## Production Setup

### Using Production Docker Compose

1. **Set up production environment**:
```bash
cp .env.example .env.production
# Edit .env.production with production values
# IMPORTANT: Set strong passwords and secrets!
```

2. **Start production services**:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **View production logs**:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

4. **Check service status**:
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Production Considerations

- **Environment Variables**: Use strong, unique values for production
- **Database Passwords**: Use strong passwords and store securely
- **JWT Secret**: Generate a strong random secret (use `openssl rand -base64 32`)
- **CORS Origins**: Set to your actual domain(s)
- **Database Synchronization**: Set `DB_SYNCHRONIZE=false` and use migrations
- **Resource Limits**: Configure in `docker-compose.prod.yml`
- **Backups**: Set up regular database backups
- **SSL/TLS**: Configure reverse proxy (Nginx) with SSL certificates
- **Monitoring**: Set up monitoring and alerting

## Docker Commands

### Container Management

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Stop container
docker stop <container-name>

# Start container
docker start <container-name>

# Remove container
docker rm <container-name>

# View container logs
docker logs <container-name>
docker logs -f <container-name>  # Follow logs
```

### Image Management

```bash
# List images
docker images

# Remove image
docker rmi <image-name>

# Remove unused images
docker image prune -a
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect <volume-name>

# Remove volume (WARNING: deletes data)
docker volume rm <volume-name>

# Remove unused volumes
docker volume prune
```

### Network Management

```bash
# List networks
docker network ls

# Inspect network
docker network inspect <network-name>

# Remove network
docker network rm <network-name>
```

## Troubleshooting

### Services Won't Start

1. **Check Docker is running**:
```bash
docker info
```

2. **Check ports are available**:
```bash
# Check if ports are in use
lsof -i :3000
lsof -i :3001
lsof -i :5432
```

3. **Check container logs**:
```bash
docker-compose logs
```

4. **Rebuild images**:
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Issues

1. **Check database is running**:
```bash
docker-compose ps postgres
```

2. **Check database logs**:
```bash
docker-compose logs postgres
```

3. **Test database connection**:
```bash
docker-compose exec postgres psql -U postgres -d construction_mgmt
```

4. **Verify environment variables**:
```bash
docker-compose exec api env | grep DB_
```

### Container Health Checks Failing

1. **Check health status**:
```bash
docker inspect <container-name> | grep -A 10 Health
```

2. **Manually test health endpoint**:
```bash
curl http://localhost:3001/api/health
```

3. **Check service logs**:
```bash
docker-compose logs api
```

### Out of Disk Space

1. **Clean up unused resources**:
```bash
docker system prune -a --volumes
```

2. **Check disk usage**:
```bash
docker system df
```

### Permission Issues

1. **Check file permissions**:
```bash
ls -la
```

2. **Fix permissions** (if needed):
```bash
sudo chown -R $USER:$USER .
```

### Build Failures

1. **Clear Docker cache**:
```bash
docker builder prune -a
```

2. **Rebuild without cache**:
```bash
docker-compose build --no-cache
```

3. **Check Dockerfile syntax**:
```bash
docker build -f Dockerfile.api --dry-run .
```

## Environment Variables

See `.env.example` for all available environment variables.

Key variables:
- `DB_HOST`: Database host (use `postgres` in Docker)
- `DB_PORT`: Database port (default: 5432)
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_DATABASE`: Database name
- `JWT_SECRET`: JWT secret key
- `CORS_ORIGIN`: Allowed CORS origins
- `NEXT_PUBLIC_API_URL`: API URL for frontend

## Next Steps

- [EC2 Deployment Guide](./ec2-deployment.md)
- [CI/CD Pipeline Documentation](./ci-cd.md)
- [Architecture Overview](../architecture/overview.md)

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nx Documentation](https://nx.dev/)

