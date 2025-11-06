# EC2 Deployment Guide

This guide covers deploying the Construction Management application to an AWS EC2 instance.

## Table of Contents

- [Prerequisites](#prerequisites)
- [EC2 Instance Setup](#ec2-instance-setup)
- [Initial Server Configuration](#initial-server-configuration)
- [Manual Deployment](#manual-deployment)
- [Automated Deployment](#automated-deployment)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- AWS Account with EC2 access
- EC2 instance running (Ubuntu 20.04+ or Amazon Linux 2+)
- SSH access to EC2 instance
- SSH key pair (.pem file)
- Domain name (optional, for SSL/HTTPS)

## EC2 Instance Setup

### 1. Launch EC2 Instance

1. **Go to EC2 Console** → Launch Instance
2. **Choose AMI**: Ubuntu Server 22.04 LTS (recommended)
3. **Instance Type**: t3.medium or larger (minimum 2 vCPU, 4GB RAM)
4. **Key Pair**: Create or select existing key pair
5. **Security Group**: Configure rules:
   - SSH (22) - from your IP
   - HTTP (80) - from anywhere (0.0.0.0/0)
   - HTTPS (443) - from anywhere (0.0.0.0/0)
   - Custom TCP (3000, 3001) - from anywhere (for testing, restrict in production)
6. **Storage**: Minimum 20GB
7. **Launch Instance**

### 2. Configure Security Group

Add inbound rules:
- Type: SSH, Port: 22, Source: Your IP
- Type: HTTP, Port: 80, Source: 0.0.0.0/0
- Type: HTTPS, Port: 443, Source: 0.0.0.0/0
- Type: Custom TCP, Port: 3000, Source: 0.0.0.0/0 (frontend)
- Type: Custom TCP, Port: 3001, Source: 0.0.0.0/0 (backend API)

**Note**: In production, restrict ports 3000 and 3001 to only allow access through reverse proxy.

### 3. Get Instance Details

- **Public IP**: Found in EC2 console
- **SSH User**: `ubuntu` (for Ubuntu) or `ec2-user` (for Amazon Linux)
- **SSH Key**: Your .pem file

Test SSH connection:
```bash
ssh -i /path/to/key.pem ubuntu@<EC2_PUBLIC_IP>
```

## Initial Server Configuration

### Option 1: Automated Setup (Recommended)

Run the setup script on the EC2 instance:

```bash
# From your local machine
scp scripts/ec2-setup.sh ubuntu@<EC2_PUBLIC_IP>:/tmp/
ssh -i /path/to/key.pem ubuntu@<EC2_PUBLIC_IP> "sudo bash /tmp/ec2-setup.sh"
```

The script will:
- Update system packages
- Install Docker and Docker Compose
- Configure firewall
- Set up system limits
- Install additional tools

### Option 2: Manual Setup

1. **Update system**:
```bash
sudo apt update && sudo apt upgrade -y
```

2. **Install Docker**:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
```

3. **Install Docker Compose**:
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

4. **Log out and back in** for Docker group changes to take effect.

5. **Verify installation**:
```bash
docker --version
docker-compose --version
docker run hello-world
```

## Manual Deployment

### 1. Prepare Deployment Package

On your local machine:

```bash
# Build Docker images
npm run docker:build

# Create deployment package
tar -czf deploy-package.tar.gz \
  Dockerfile.api \
  Dockerfile.app \
  docker-compose.prod.yml \
  package.json \
  nx.json \
  tsconfig.base.json \
  apps/ \
  libs/ \
  components/ \
  public/ \
  styles/ \
  hooks/ \
  lib/
```

### 2. Transfer Files to EC2

```bash
# Transfer package
scp -i /path/to/key.pem deploy-package.tar.gz ubuntu@<EC2_PUBLIC_IP>:/tmp/

# Transfer environment file
scp -i /path/to/key.pem .env.production ubuntu@<EC2_PUBLIC_IP>:/tmp/
```

### 3. Deploy on EC2

SSH to EC2 and deploy:

```bash
ssh -i /path/to/key.pem ubuntu@<EC2_PUBLIC_IP>

# Extract package
sudo mkdir -p /opt/construction-mgmt
cd /opt/construction-mgmt
sudo tar -xzf /tmp/deploy-package.tar.gz --strip-components=1
sudo mv /tmp/.env.production .env

# Set permissions
sudo chown -R ubuntu:ubuntu /opt/construction-mgmt

# Build and start services
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

## Automated Deployment

### Using Deployment Script

From your local machine:

```bash
./scripts/deploy-ec2.sh \
  --host <EC2_PUBLIC_IP> \
  --user ubuntu \
  --key /path/to/key.pem \
  --env .env.production
```

Options:
- `--host`: EC2 instance IP or hostname (required)
- `--user`: SSH username (default: ubuntu)
- `--key`: Path to SSH private key (required)
- `--env`: Environment file to use (default: .env.production)
- `--skip-setup`: Skip initial server setup
- `--skip-build`: Skip building Docker images locally

### Using GitHub Actions

See [CI/CD Documentation](./ci-cd.md) for automated deployment via GitHub Actions.

## Post-Deployment

### 1. Verify Deployment

```bash
# Health check
./scripts/health-check.sh \
  --remote <EC2_PUBLIC_IP> \
  --user ubuntu \
  --key /path/to/key.pem

# Or manually
curl http://<EC2_PUBLIC_IP>:3001/api/health
curl http://<EC2_PUBLIC_IP>:3000
```

### 2. Configure Nginx (Optional)

For production with SSL/HTTPS:

1. **Install Nginx**:
```bash
sudo apt install nginx
```

2. **Configure Nginx**:
```bash
sudo nano /etc/nginx/sites-available/construction-mgmt
```

3. **Add configuration**:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Enable site**:
```bash
sudo ln -s /etc/nginx/sites-available/construction-mgmt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal (already configured)
sudo certbot renew --dry-run
```

### 4. Set Up Monitoring

Consider setting up:
- CloudWatch for AWS monitoring
- Application logs monitoring
- Database backup automation
- Health check monitoring

### 5. Database Backups

Set up automated backups:

```bash
# Create backup script
cat > /opt/construction-mgmt/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

docker-compose -f /opt/construction-mgmt/docker-compose.prod.yml exec -T postgres \
  pg_dump -U postgres construction_mgmt > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /opt/construction-mgmt/backup-db.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/construction-mgmt/backup-db.sh") | crontab -
```

## Troubleshooting

### Cannot Connect to EC2

1. **Check security group**:
   - Ensure SSH (22) is allowed from your IP
   - Verify instance is running

2. **Check SSH key permissions**:
```bash
chmod 600 /path/to/key.pem
```

3. **Test connection**:
```bash
ssh -v -i /path/to/key.pem ubuntu@<EC2_PUBLIC_IP>
```

### Services Not Starting

1. **Check Docker**:
```bash
docker ps
docker-compose -f docker-compose.prod.yml ps
```

2. **Check logs**:
```bash
docker-compose -f docker-compose.prod.yml logs
```

3. **Check resources**:
```bash
free -h
df -h
```

### Database Connection Issues

1. **Check database container**:
```bash
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres
```

2. **Check environment variables**:
```bash
docker-compose -f docker-compose.prod.yml exec api env | grep DB_
```

3. **Check database logs**:
```bash
docker-compose -f docker-compose.prod.yml logs postgres
```

### Port Already in Use

1. **Find process using port**:
```bash
sudo lsof -i :3000
sudo lsof -i :3001
```

2. **Stop conflicting service**:
```bash
sudo systemctl stop <service-name>
```

### Out of Disk Space

1. **Check disk usage**:
```bash
df -h
docker system df
```

2. **Clean up**:
```bash
docker system prune -a
docker volume prune
```

### SSL Certificate Issues

1. **Check certificate**:
```bash
sudo certbot certificates
```

2. **Renew certificate**:
```bash
sudo certbot renew
```

3. **Check Nginx configuration**:
```bash
sudo nginx -t
```

## Maintenance

### Updating Application

1. **Pull latest code** (if using Git):
```bash
cd /opt/construction-mgmt
git pull
```

2. **Rebuild and restart**:
```bash
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Monitoring Logs

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service
docker-compose -f docker-compose.prod.yml logs -f api
```

### Scaling

For production scaling, consider:
- Using ECS/EKS for container orchestration
- Setting up load balancers
- Database replication
- Caching layer (Redis)

## Security Best Practices

1. **Keep system updated**:
```bash
sudo apt update && sudo apt upgrade -y
```

2. **Use strong passwords** for database and JWT secrets
3. **Restrict security group** access to minimum required
4. **Enable CloudWatch** logging and monitoring
5. **Set up regular backups**
6. **Use SSL/TLS** for all external connections
7. **Regularly rotate** secrets and keys
8. **Monitor** for security vulnerabilities

## Next Steps

- [CI/CD Pipeline Documentation](./ci-cd.md)
- [Docker Setup Guide](./docker-setup.md)
- [Architecture Overview](../architecture/overview.md)

