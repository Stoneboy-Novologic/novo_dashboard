# CI/CD Pipeline Documentation

This guide covers the Continuous Integration and Continuous Deployment (CI/CD) pipeline setup for the Construction Management application.

## Table of Contents

- [Overview](#overview)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Setting Up Secrets](#setting-up-secrets)
- [Workflow Details](#workflow-details)
- [Deployment Process](#deployment-process)
- [Troubleshooting](#troubleshooting)

## Overview

The CI/CD pipeline consists of two main workflows:

1. **Docker Build and Test** (`docker-build.yml`)
   - Runs on every push and pull request
   - Lints code, runs tests
   - Builds Docker images
   - Performs security scans
   - Pushes images to GitHub Container Registry

2. **Deploy to EC2** (`deploy-ec2.yml`)
   - Runs on push to main/master branch
   - Builds and deploys application to EC2
   - Runs health checks
   - Provides deployment summary

## GitHub Actions Workflows

### Docker Build Workflow

**Trigger**: Push to main/master or pull request

**Jobs**:
1. **lint-and-test**: Runs linting and tests
2. **build-docker**: Builds Docker images for API and App
3. **security-scan**: Scans images for vulnerabilities
4. **summary**: Provides build summary

**Artifacts**: Docker images pushed to GitHub Container Registry

### Deploy to EC2 Workflow

**Trigger**: Push to main/master (after successful build) or manual dispatch

**Jobs**:
1. **build**: Builds Docker images (if not skipped)
2. **deploy**: Deploys application to EC2 instance

**Artifacts**: Deployment package and Docker images

## Setting Up Secrets

### Required GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions → New repository secret

#### For Docker Build Workflow

- `GITHUB_TOKEN`: Automatically provided (no action needed)

#### For EC2 Deployment Workflow

1. **EC2_SSH_KEY**
   - Content of your SSH private key (.pem file)
   - Used to connect to EC2 instance
   - Example:
   ```bash
   cat /path/to/key.pem | pbcopy  # Copy to clipboard
   # Then paste into GitHub secret
   ```

2. **EC2_HOST**
   - EC2 instance public IP or hostname
   - Example: `ec2-12-34-56-78.compute-1.amazonaws.com` or `54.123.45.67`

3. **EC2_USER**
   - SSH username for EC2 instance
   - `ubuntu` for Ubuntu instances
   - `ec2-user` for Amazon Linux instances

4. **ENV_PRODUCTION** (Optional)
   - Content of `.env.production` file
   - Will be used as environment file on EC2
   - Example:
   ```bash
   cat .env.production | pbcopy  # Copy to clipboard
   # Then paste into GitHub secret
   ```

5. **NEXT_PUBLIC_API_URL** (Optional)
   - Public API URL for frontend
   - Used as build argument for frontend Docker image
   - Example: `https://api.yourdomain.com` or `http://<EC2_IP>:3001`

### Setting Up Secrets

1. **Navigate to repository secrets**:
   - Go to your GitHub repository
   - Click Settings → Secrets and variables → Actions
   - Click "New repository secret"

2. **Add each secret**:
   - Name: `EC2_SSH_KEY`
   - Value: Paste your SSH private key content
   - Click "Add secret"
   - Repeat for all required secrets

3. **Verify secrets**:
   - Secrets are masked in logs
   - They can only be viewed when editing (not after saving)

## Workflow Details

### Docker Build Workflow

#### Trigger Conditions

- Push to `main` or `master` branch
- Pull request to `main` or `master`
- Manual workflow dispatch
- Changes to:
  - `apps/**`
  - `libs/**`
  - `Dockerfile*`
  - `docker-compose*.yml`
  - `package.json`

#### Workflow Steps

1. **Checkout Code**
   ```yaml
   - uses: actions/checkout@v4
   ```

2. **Set Up Node.js**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version: '20'
       cache: 'npm'
   ```

3. **Install Dependencies**
   ```bash
   npm ci --legacy-peer-deps
   ```

4. **Run Linting and Tests**
   ```bash
   npm run lint
   npm run test
   ```

5. **Build Docker Images**
   - Builds both API and App images
   - Uses Docker Buildx for advanced features
   - Caches layers for faster builds

6. **Push to Registry**
   - Pushes images to GitHub Container Registry
   - Tags with branch name, commit SHA, and version
   - Only on push (not pull requests)

7. **Security Scan**
   - Uses Trivy for vulnerability scanning
   - Uploads results to GitHub Security tab
   - Continues on error (doesn't fail build)

### Deploy to EC2 Workflow

#### Trigger Conditions

- Push to `main` or `master` branch (after successful build)
- Manual workflow dispatch
- Changes to:
  - `apps/**`
  - `libs/**`
  - `Dockerfile*`
  - `docker-compose*.yml`
  - `package.json`

#### Workflow Steps

1. **Build Docker Images** (if not skipped)
   - Builds API and App images
   - Saves images as artifacts
   - Uploads to workflow artifacts

2. **Configure SSH**
   - Sets up SSH key and known hosts
   - Configures SSH connection to EC2

3. **Transfer Files**
   - Downloads Docker images (if built)
   - Creates deployment package
   - Transfers to EC2 instance

4. **Deploy on EC2**
   - Loads Docker images
   - Extracts deployment package
   - Stops existing containers
   - Builds new images
   - Starts services

5. **Health Checks**
   - Waits for services to be healthy
   - Checks API health endpoint
   - Verifies all services are running

6. **Deployment Summary**
   - Provides deployment information
   - Shows service URLs
   - Includes commit SHA and timestamp

## Deployment Process

### Automatic Deployment

1. **Push code to main branch**:
   ```bash
   git push origin main
   ```

2. **GitHub Actions triggers**:
   - Docker build workflow runs
   - If successful, deployment workflow runs

3. **Monitor deployment**:
   - Go to Actions tab in GitHub
   - Click on running workflow
   - View logs for each step

4. **Verify deployment**:
   - Check deployment summary
   - Test application endpoints
   - Run health checks

### Manual Deployment

1. **Go to Actions tab**:
   - Click "Deploy to EC2" workflow
   - Click "Run workflow"
   - Optionally select "Skip build" if images already built
   - Click "Run workflow" button

2. **Monitor deployment**:
   - View logs in real-time
   - Check for errors
   - Verify deployment success

### Rollback

If deployment fails or issues are found:

1. **Stop services on EC2**:
   ```bash
   ssh -i key.pem ubuntu@<EC2_IP> "cd /opt/construction-mgmt && docker-compose -f docker-compose.prod.yml down"
   ```

2. **Revert to previous version**:
   ```bash
   git revert <commit-sha>
   git push origin main
   ```

3. **Or manually deploy previous version**:
   ```bash
   git checkout <previous-commit-sha>
   # Follow manual deployment steps
   ```

## Troubleshooting

### Build Failures

**Issue**: Docker build fails

**Solutions**:
1. Check Dockerfile syntax
2. Verify all dependencies are listed
3. Check build logs for specific errors
4. Test Docker build locally:
   ```bash
   docker build -f Dockerfile.api .
   ```

**Issue**: Tests fail

**Solutions**:
1. Check test logs for errors
2. Run tests locally:
   ```bash
   npm test
   ```
3. Fix failing tests
4. Commit and push fixes

### Deployment Failures

**Issue**: Cannot connect to EC2

**Solutions**:
1. Verify `EC2_SSH_KEY` secret is correct
2. Check `EC2_HOST` is correct
3. Verify `EC2_USER` is correct
4. Check EC2 security group allows SSH
5. Verify EC2 instance is running

**Issue**: Services not starting

**Solutions**:
1. Check deployment logs
2. SSH to EC2 and check:
   ```bash
   docker-compose -f docker-compose.prod.yml logs
   ```
3. Verify environment variables
4. Check disk space:
   ```bash
   df -h
   ```

**Issue**: Health checks failing

**Solutions**:
1. Check service logs on EC2
2. Verify health endpoint:
   ```bash
   curl http://localhost:3001/api/health
   ```
3. Check database connectivity
4. Verify ports are not in use

### Secret Issues

**Issue**: Secrets not working

**Solutions**:
1. Verify secret names match exactly (case-sensitive)
2. Check secret values are correct
3. Ensure no extra whitespace in secrets
4. Re-add secrets if needed

### Workflow Not Triggering

**Issue**: Workflow doesn't run on push

**Solutions**:
1. Check branch name matches trigger (main/master)
2. Verify file paths changed match trigger paths
3. Check workflow file syntax
4. Verify workflow is in `.github/workflows/` directory

## Best Practices

1. **Use feature branches**: Don't push directly to main
2. **Test locally first**: Run tests and builds before pushing
3. **Review pull requests**: Use PRs to review changes
4. **Monitor deployments**: Check logs after each deployment
5. **Set up alerts**: Configure notifications for failures
6. **Regular updates**: Keep dependencies and base images updated
7. **Backup regularly**: Set up automated backups
8. **Document changes**: Update documentation with changes

## Workflow Customization

### Adding More Steps

Edit workflow files in `.github/workflows/`:

```yaml
- name: Custom Step
  run: |
    echo "Custom command"
    # Your commands here
```

### Changing Trigger Conditions

Edit `on:` section in workflow files:

```yaml
on:
  push:
    branches:
      - main
      - develop  # Add more branches
  schedule:
    - cron: '0 0 * * *'  # Run daily
```

### Adding Environments

Use GitHub Environments for staging/production:

```yaml
jobs:
  deploy:
    environment: production
    steps:
      - name: Deploy
        run: echo "Deploying to production"
```

## Monitoring and Notifications

### GitHub Notifications

- Enable email notifications for workflow failures
- Set up webhook notifications
- Use GitHub mobile app for notifications

### External Monitoring

- Set up application monitoring (e.g., New Relic, Datadog)
- Configure uptime monitoring (e.g., UptimeRobot)
- Set up error tracking (e.g., Sentry)

## Next Steps

- [Docker Setup Guide](./docker-setup.md)
- [EC2 Deployment Guide](./ec2-deployment.md)
- [Architecture Overview](../architecture/overview.md)

