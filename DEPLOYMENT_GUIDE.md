# Complete EC2 Deployment Guide

## Quick Start - One Command Deployment

This guide provides a **single-command deployment** solution for your Construction Management SaaS application on EC2.

### Prerequisites

1. **EC2 Instance Running**
   - Ubuntu 20.04+ or Amazon Linux 2+
   - Minimum 2GB RAM (4GB+ recommended)
   - Minimum 10GB disk space
   - Security group allowing:
     - SSH (22) from your IP
     - HTTP (80) from anywhere
     - HTTPS (443) from anywhere
     - Custom TCP (3000, 3001) from anywhere (for testing)

2. **SSH Access**
   - SSH key pair (.pem file)
   - Ability to SSH into EC2 instance

### Step 1: Transfer Project to EC2

**Option A: Using Git (Recommended)**

```bash
# On EC2 instance
cd ~
git clone <your-repository-url> novo_dashboard
cd novo_dashboard
```

**Option B: Using SCP from Local Machine**

```bash
# On your local machine
cd /path/to/construction-mnagement-v1
tar -czf project.tar.gz --exclude='node_modules' --exclude='.git' .
scp -i /path/to/key.pem project.tar.gz ubuntu@<EC2_IP>:~/
```

```bash
# On EC2 instance
cd ~
tar -xzf project.tar.gz -C novo_dashboard
cd novo_dashboard
```

### Step 2: Run Complete Deployment Script

**That's it! Just one command:**

```bash
cd ~/novo_dashboard
sudo bash scripts/deploy-ec2-complete.sh
```

The script will:
- ✅ Check all prerequisites
- ✅ Install Docker and Docker Compose (if needed)
- ✅ Set up deployment directory
- ✅ Generate secure passwords and secrets
- ✅ Create production environment file
- ✅ Build Docker images
- ✅ Start all services (PostgreSQL, API, App)
- ✅ Run health checks
- ✅ Display deployment summary

### What the Script Does

1. **Prerequisites Check**
   - Verifies OS compatibility
   - Checks disk space and memory
   - Tests internet connectivity

2. **Docker Installation**
   - Installs Docker Engine
   - Installs Docker Compose
   - Configures Docker for your user
   - Tests Docker installation

3. **Deployment Setup**
   - Creates `/opt/construction-mgmt` directory
   - Copies all project files
   - Sets proper permissions

4. **Environment Configuration**
   - Detects EC2 public IP automatically
   - Generates secure database password
   - Generates secure JWT secret
   - Creates `.env.production` file
   - Creates `.env` file for docker-compose

5. **Docker Build**
   - Builds NestJS API image
   - Builds Next.js App image
   - Uses multi-stage builds for optimization

6. **Service Deployment**
   - Starts PostgreSQL database
   - Starts NestJS API backend
   - Starts Next.js frontend
   - Configures networking

7. **Health Checks**
   - Verifies all containers are running
   - Tests database connectivity
   - Tests API health endpoint
   - Tests frontend accessibility

8. **Summary Display**
   - Shows service URLs
   - Displays useful commands
   - Provides next steps

### Access Your Application

After deployment, access your application at:

- **Frontend**: `http://<YOUR_EC2_IP>:3000`
- **Backend API**: `http://<YOUR_EC2_IP>:3001`
- **Health Check**: `http://<YOUR_EC2_IP>:3001/api/health`

### Useful Commands

```bash
# View all logs
sudo docker-compose -f /opt/construction-mgmt/docker-compose.prod.yml logs -f

# View specific service logs
sudo docker-compose -f /opt/construction-mgmt/docker-compose.prod.yml logs -f api
sudo docker-compose -f /opt/construction-mgmt/docker-compose.prod.yml logs -f app
sudo docker-compose -f /opt/construction-mgmt/docker-compose.prod.yml logs -f postgres

# Check service status
sudo docker-compose -f /opt/construction-mgmt/docker-compose.prod.yml ps

# Restart services
sudo docker-compose -f /opt/construction-mgmt/docker-compose.prod.yml restart

# Stop services
sudo docker-compose -f /opt/construction-mgmt/docker-compose.prod.yml down

# Rebuild and restart
cd /opt/construction-mgmt
sudo docker-compose -f docker-compose.prod.yml build --no-cache
sudo docker-compose -f docker-compose.prod.yml up -d
```

### Troubleshooting

#### Script Fails at Docker Installation

```bash
# Manually install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in, then rerun script
```

#### Services Not Starting

```bash
# Check logs
sudo docker-compose -f /opt/construction-mgmt/docker-compose.prod.yml logs

# Check container status
sudo docker ps -a

# Check disk space
df -h

# Check memory
free -h
```

#### Port Already in Use

```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :3001
sudo lsof -i :5432

# Stop conflicting service
sudo systemctl stop <service-name>
```

#### Database Connection Issues

```bash
# Check database logs
sudo docker-compose -f /opt/construction-mgmt/docker-compose.prod.yml logs postgres

# Test database connection
sudo docker exec -it construction-mgmt-postgres-prod psql -U postgres -d construction_mgmt
```

### Security Recommendations

1. **Update Security Groups**
   - Restrict ports 3000 and 3001 to specific IPs
   - Use reverse proxy (Nginx) for production

2. **Set Up SSL/TLS**
   - Use Let's Encrypt for free SSL certificates
   - Configure Nginx as reverse proxy

3. **Regular Backups**
   - Set up automated database backups
   - Store backups in S3 or other secure storage

4. **Monitor Logs**
   - Set up CloudWatch or similar monitoring
   - Configure alerts for errors

5. **Keep Updated**
   - Regularly update Docker images
   - Keep system packages updated
   - Monitor security advisories

### Next Steps

1. **Configure Domain** (Optional)
   - Point your domain to EC2 IP
   - Set up DNS records

2. **Set Up SSL** (Recommended)
   - Install Certbot
   - Configure Let's Encrypt
   - Set up auto-renewal

3. **Configure Nginx** (Recommended)
   - Install Nginx
   - Configure reverse proxy
   - Set up SSL termination

4. **Set Up Monitoring**
   - Configure CloudWatch
   - Set up log aggregation
   - Configure alerts

5. **Set Up Backups**
   - Configure database backups
   - Set up automated backup schedule
   - Test restore procedures

### Support

For issues or questions:
- Check deployment logs: `/tmp/deployment-*.log`
- Review service logs: `docker-compose logs`
- Check documentation: `docs/deployment/`

### Script Features

- ✅ **Comprehensive Error Handling**: Catches and reports all errors
- ✅ **Detailed Logging**: Logs everything to file and console
- ✅ **Progress Indicators**: Shows what's happening at each step
- ✅ **Health Checks**: Verifies everything is working
- ✅ **Secure Defaults**: Generates secure passwords and secrets
- ✅ **Idempotent**: Can be run multiple times safely
- ✅ **Enterprise-Grade**: Production-ready configuration

---

**Ready to deploy? Just run:**

```bash
cd ~/novo_dashboard
sudo bash scripts/deploy-ec2-complete.sh
```

That's it! 🚀

