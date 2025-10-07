# Ferifly Travel Agency - Production Deployment Guide
## 🚀 Deployment with Nginx Proxy Manager

---

## 📋 Prerequisites

- Docker and Docker Compose installed
- Nginx Proxy Manager installed and running
- Domain name pointing to your server
- Ports 80 and 443 accessible (for NPM)

---

## 🐳 Step 1: Deploy the Application

### 1.1 Build and Start with Docker Compose
```bash
# Navigate to project directory
cd /path/to/new_project_feri

# Build and start the container
docker-compose up -d --build

# Verify it's running
docker-compose ps

# Check logs
docker-compose logs -f ferifly-web
```

Your application should now be running on **port 8080** internally.

### 1.2 Test Local Access
```bash
# Test from the server
curl http://localhost:8080

# You should see the HTML response
```

---

## 🌐 Step 2: Configure Nginx Proxy Manager

### 2.1 Access NPM Admin Panel
Open your browser and navigate to:
- **URL**: `http://your-server-ip:81`
- **Default Email**: `admin@example.com`
- **Default Password**: `changeme`

⚠️ **Change these credentials immediately after first login!**

### 2.2 Add Proxy Host

1. Click **"Hosts"** → **"Proxy Hosts"** → **"Add Proxy Host"**

2. **Details Tab:**
   ```
   Domain Names: ferifly.com, www.ferifly.com
   Scheme: http
   Forward Hostname / IP: ferifly-travel-app
   Forward Port: 8080
   Cache Assets: ✅ (enabled)
   Block Common Exploits: ✅ (enabled)
   Websockets Support: ✅ (enabled)
   ```

3. **SSL Tab:**
   ```
   SSL Certificate: Request a new SSL Certificate
   Force SSL: ✅ (enabled)
   HTTP/2 Support: ✅ (enabled)
   HSTS Enabled: ✅ (enabled)
   HSTS Subdomains: ✅ (enabled)
   
   Email Address for Let's Encrypt: your-email@example.com
   ✅ I Agree to the Let's Encrypt Terms of Service
   ```

4. **Advanced Tab (Optional):**
   ```nginx
   # Add custom Nginx configuration
   
   # Gzip Compression
   gzip on;
   gzip_vary on;
   gzip_min_length 1024;
   gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/javascript application/xml+rss application/json;
   
   # Security Headers
   add_header X-Frame-Options "SAMEORIGIN" always;
   add_header X-Content-Type-Options "nosniff" always;
   add_header X-XSS-Protection "1; mode=block" always;
   add_header Referrer-Policy "no-referrer-when-downgrade" always;
   
   # Static file caching
   location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

5. Click **"Save"**

---

## ✅ Step 3: Verify Deployment

### 3.1 Check SSL Certificate
```bash
# Should return 200 OK
curl -I https://ferifly.com

# Should redirect to HTTPS
curl -I http://ferifly.com
```

### 3.2 Test Your Website
Open your browser:
- ✅ https://ferifly.com
- ✅ https://www.ferifly.com
- ✅ SSL certificate should be valid (Let's Encrypt)
- ✅ HTTP should redirect to HTTPS

---

## 🔄 Alternative: Docker Compose with NPM

If you want to deploy both NPM and Ferifly together:

```yaml
version: '3.8'

services:
  # Nginx Proxy Manager
  npm:
    image: 'jc21/nginx-proxy-manager:latest'
    container_name: nginx-proxy-manager
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./npm-data:/data
      - ./npm-letsencrypt:/etc/letsencrypt
    networks:
      - npm-network

  # Ferifly Application
  ferifly-web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ferifly-travel-app
    restart: unless-stopped
    expose:
      - "8080"
    environment:
      - FLASK_ENV=production
      - PYTHONUNBUFFERED=1
    networks:
      - npm-network

networks:
  npm-network:
    driver: bridge
```

Then deploy:
```bash
docker-compose up -d --build
```

---

## 📊 Monitoring and Maintenance

### View Application Logs
```bash
# Real-time logs
docker-compose logs -f ferifly-web

# Last 100 lines
docker-compose logs --tail=100 ferifly-web
```

### Check Container Status
```bash
docker-compose ps
docker stats ferifly-travel-app
```

### View NPM Access Logs
In NPM Admin Panel:
1. Go to **"Hosts"** → **"Proxy Hosts"**
2. Click the **three dots** next to your host
3. Select **"View Logs"**

---

## 🔄 Updates and Restart

### Update Application
```bash
# Pull latest changes (if using git)
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Restart Without Rebuild
```bash
docker-compose restart ferifly-web
```

### Stop Application
```bash
docker-compose down
```

---

## 🔐 Security Checklist

- ✅ Change NPM default admin credentials
- ✅ Enable SSL with Let's Encrypt
- ✅ Force SSL (HTTPS)
- ✅ Enable HSTS
- ✅ Block Common Exploits in NPM
- ✅ Keep Docker images updated
- ✅ Configure firewall (UFW)
  ```bash
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw allow 81/tcp  # NPM admin (optional, can restrict by IP)
  sudo ufw enable
  ```

---

## 🐛 Troubleshooting

### Application Not Accessible

**Check if container is running:**
```bash
docker ps | grep ferifly
```

**Check if port 8080 is listening:**
```bash
docker exec ferifly-travel-app netstat -tulpn | grep 8080
```

**Test internal connectivity:**
```bash
docker exec ferifly-travel-app curl http://localhost:8080
```

### NPM Can't Connect to Application

**Check if both containers are on the same network:**
```bash
docker network inspect nginx-proxy-manager_default
```

**Verify container name:**
```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

Use the exact container name in NPM: `ferifly-travel-app`

### SSL Certificate Issues

**In NPM:**
1. Delete the existing certificate
2. Request a new one
3. Ensure domain DNS points to your server
4. Wait a few minutes for DNS propagation

**Check Let's Encrypt rate limits:**
- https://letsencrypt.org/docs/rate-limits/

### High Memory Usage

**Reduce Gunicorn workers in Dockerfile:**
```dockerfile
# Change from --workers 4 to --workers 2
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "2", ...]
```

Then rebuild:
```bash
docker-compose up -d --build
```

---

## 📈 Performance Optimization

### 1. Enable Caching in NPM
Already configured in Advanced settings above.

### 2. Optimize Docker Image
```bash
# Remove unused images
docker image prune -a

# Check image size
docker images | grep ferifly
```

### 3. Monitor Resources
```bash
# Real-time resource usage
docker stats ferifly-travel-app

# Set resource limits in docker-compose.yml (already configured)
```

---

## 📞 Support Information

**Ferifly Travel Agency**
- Email: Feri-fly@live.de
- Phone: +383 45 411 400
- WhatsApp: +383 45 411 400
- Viber: +383 45 411 400

---

## 📝 Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Flask 3.0 (Python 3.11)
- **WSGI Server**: Gunicorn (4 workers, 2 threads)
- **Reverse Proxy**: Nginx Proxy Manager
- **Container**: Docker
- **SSL**: Let's Encrypt (via NPM)

---

## 🎯 Quick Commands Reference

```bash
# Start application
docker-compose up -d

# Stop application
docker-compose down

# Restart application
docker-compose restart

# View logs
docker-compose logs -f

# Rebuild and start
docker-compose up -d --build

# Check status
docker-compose ps

# Update and restart
git pull && docker-compose up -d --build
```

---

## 📄 License

© 2024 Ferifly Travel Agency. All rights reserved.
