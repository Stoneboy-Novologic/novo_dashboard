<!-- ad0ab838-bfba-4965-abad-22a9a769468d bf934f05-4871-4043-9c9a-1a3dfa0a1eae -->
# Docker + EC2 + CI/CD Setup for Construction Management App

## Overview

Complete Docker containerization setup for the Nx monorepo with Next.js frontend, NestJS backend, and PostgreSQL database, configured for EC2 deployment with automated CI/CD pipeline.

## Architecture Decisions

- **Monorepo**: Keep using Nx (already optimal for Next.js + NestJS)
- **Containerization**: Multi-stage Docker builds for optimized images
- **Orchestration**: Docker Compose for local dev and EC2 production
- **Database**: PostgreSQL in separate container with volume persistence
- **CI/CD**: GitHub Actions (can be adapted to other platforms)
- **Deployment**: Single EC2 instance with Docker Compose (scalable to multiple instances later)

## Implementation Plan

### Phase 1: Docker Configuration

1. **Create Dockerfiles**

- `Dockerfile.api` - Multi-stage build for NestJS backend
- `Dockerfile.app` - Multi-stage build for Next.js frontend
- Optimize for production builds and caching

2. **Create Docker Compose Files**

- `docker-compose.yml` - Local development setup
- `docker-compose.prod.yml` - Production setup for EC2
- Include PostgreSQL, backend, and frontend services
- Configure networks, volumes, and environment variables

3. **Environment Configuration**

- `.env.example` - Template with all required variables
- `.env.docker` - Docker-specific environment template
- Document all environment variables

### Phase 2: Build Optimization

1. **Nx Build Configuration**

- Optimize Docker builds to leverage Nx caching
- Configure build targets for Docker builds
- Set up proper dependency resolution

2. **Docker Build Scripts**

- `scripts/docker-build.sh` - Build all services
- `scripts/docker-push.sh` - Push to registry (if using)
- `scripts/docker-dev.sh` - Development workflow

### Phase 3: EC2 Deployment Setup

1. **Deployment Scripts**

- `scripts/deploy-ec2.sh` - Main deployment script
- `scripts/ec2-setup.sh` - Initial EC2 server setup (Docker, Docker Compose)
- `scripts/health-check.sh` - Service health checks

2. **Infrastructure Configuration**

- `ec2/docker-compose.prod.yml` - Production compose file
- `ec2/nginx.conf` - Nginx reverse proxy (for HTTPS/SSL)
- `ec2/.env.production` - Production environment template

### Phase 4: CI/CD Pipeline

1. **GitHub Actions Workflow**

- `.github/workflows/docker-build.yml` - Build and test Docker images
- `.github/workflows/deploy-ec2.yml` - Deploy to EC2 on merge to main
- Include linting, testing, and security scanning

2. **Deployment Automation**

- SSH-based deployment to EC2
- Zero-downtime deployment strategy
- Rollback capability

### Phase 5: Documentation

1. **Deployment Documentation**

- `docs/deployment/docker-setup.md` - Docker setup guide
- `docs/deployment/ec2-deployment.md` - EC2 deployment guide
- `docs/deployment/ci-cd.md` - CI/CD pipeline documentation
- Include troubleshooting and common issues

2. **Environment Setup Guide**

- Document all environment variables
- EC2 setup prerequisites
- SSL certificate setup (if needed)

## Files to Create/Modify

### New Files

- `Dockerfile.api` - NestJS backend Dockerfile
- `Dockerfile.app` - Next.js frontend Dockerfile
- `docker-compose.yml` - Development Docker Compose
- `docker-compose.prod.yml` - Production Docker Compose
- `.dockerignore` - Docker ignore patterns
- `.env.example` - Environment variables template
- `.env.docker.example` - Docker environment template
- `scripts/docker-build.sh` - Docker build script
- `scripts/docker-dev.sh` - Development script
- `scripts/deploy-ec2.sh` - EC2 deployment script
- `scripts/ec2-setup.sh` - EC2 server setup
- `scripts/health-check.sh` - Health check script
- `.github/workflows/docker-build.yml` - CI build workflow
- `.github/workflows/deploy-ec2.yml` - CI deployment workflow
- `docs/deployment/docker-setup.md` - Docker documentation
- `docs/deployment/ec2-deployment.md` - EC2 deployment docs
- `docs/deployment/ci-cd.md` - CI/CD documentation

### Files to Modify

- `package.json` - Add Docker-related scripts
- `apps/app/next.config.mjs` - Optimize for Docker production
- `apps/api/src/main.ts` - Ensure proper CORS for production
- `apps/api/src/config/database.module.ts` - Docker-compatible DB config

## Key Features

- Multi-stage Docker builds for smaller images
- Hot-reload support in development
- Production-optimized builds
- Database persistence with volumes
- Environment-based configuration
- Health checks for all services
- Automated CI/CD pipeline
- Zero-downtime deployment
- Comprehensive logging and error handling
- Security best practices (non-root users, minimal base images)

## Next Steps After Implementation

1. Set up EC2 instance and security groups
2. Configure domain and SSL certificates (if needed)
3. Set up monitoring and logging (CloudWatch, etc.)
4. Configure backup strategy for PostgreSQL
5. Set up staging environment for testing deployments

### To-dos

- [ ] Create multi-stage Dockerfiles for NestJS backend (Dockerfile.api) and Next.js frontend (Dockerfile.app) with production optimizations
- [ ] Create docker-compose.yml for development and docker-compose.prod.yml for production with PostgreSQL, backend, and frontend services
- [ ] Create .env.example and .env.docker.example templates with all required environment variables documented
- [ ] Create Docker build, dev, and deployment scripts in scripts/ directory with error handling and logging
- [ ] Create EC2 deployment scripts (deploy-ec2.sh, ec2-setup.sh, health-check.sh) for automated server setup and deployment
- [ ] Create GitHub Actions workflows for Docker builds and EC2 deployment with testing, linting, and security checks
- [ ] Update package.json with Docker-related npm scripts for easy development and deployment workflows
- [ ] Update apps/app/next.config.mjs for Docker production optimizations and standalone output
- [ ] Update apps/api/src/main.ts and database.module.ts for Docker-compatible CORS and database connection settings
- [ ] Create comprehensive documentation in docs/deployment/ for Docker setup, EC2 deployment, and CI/CD pipeline with troubleshooting guides