# 🚀 Ferifly - Quick Start Guide

## Choose Your Deployment Option

---

## ✅ Option 1: App Only (Recommended if NPM is already installed)

### Step 1: Start the Application
```bash
docker compose up -d --build
```

### Step 2: Verify it's running
```bash
docker ps
# You should see: ferifly-travel-app

# Test locally
curl http://localhost:8080
```

### Step 3: Configure in Nginx Proxy Manager
1. Open NPM: `http://your-server-ip:81`
2. Login (default: `admin@example.com` / `changeme`)
3. Add Proxy Host:
   - **Domains**: `ferifly.com, www.ferifly.com`
   - **Scheme**: `http`
   - **Forward Hostname**: `ferifly-travel-app`
   - **Forward Port**: `8080`
   - **SSL**: Request new certificate
   - **Force SSL**: ✅

### Step 4: Done! ✨
Visit: `https://ferifly.com`

---

## 🎯 Option 2: App + NPM Together (Complete Setup)

### Step 1: Deploy Both Services
```bash
docker compose -f docker-compose-with-npm.yml up -d --build
```

### Step 2: Configure NPM
Wait 30 seconds for NPM to start, then:

1. Open NPM: `http://your-server-ip:81`
2. **First login**:
   - Email: `admin@example.com`
   - Password: `changeme`
   - ⚠️ **Change these immediately!**

3. **Add Proxy Host**:
   - Click "Hosts" → "Proxy Hosts" → "Add Proxy Host"
   - **Details Tab**:
     - Domain Names: `ferifly.com www.ferifly.com`
     - Scheme: `http`
     - Forward Hostname/IP: `ferifly-travel-app`
     - Forward Port: `8080`
     - ✅ Cache Assets
     - ✅ Block Common Exploits
     - ✅ Websockets Support
   
   - **SSL Tab**:
     - ✅ Request a new SSL Certificate
     - ✅ Force SSL
     - ✅ HTTP/2 Support
     - ✅ HSTS Enabled
     - Email: `your-email@example.com`
     - ✅ I Agree to Let's Encrypt Terms
   
   - Click **Save**

### Step 3: Done! ✨
Visit: `https://ferifly.com`

---

## 🔍 Troubleshooting

### Check Container Status
```bash
docker ps
docker compose logs -f ferifly-web
```

### Container Won't Start?
```bash
# View detailed logs
docker compose logs ferifly-web

# Check if port 8080 is already in use
sudo netstat -tulpn | grep 8080

# Rebuild from scratch
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

### NPM Can't Find App?
Make sure both containers are running:
```bash
docker ps | grep -E "ferifly|nginx-proxy"
```

Use the exact container name in NPM: `ferifly-travel-app`

### Reset NPM Credentials
```bash
docker exec -it nginx-proxy-manager /bin/bash
sqlite3 /data/database.sqlite
UPDATE auth SET email='admin@example.com', secret='changeme' WHERE id=1;
.quit
exit
docker restart nginx-proxy-manager
```

---

## 📊 Useful Commands

```bash
# View logs
docker compose logs -f

# Restart app
docker compose restart ferifly-web

# Stop everything
docker compose down

# Update and rebuild
git pull
docker compose up -d --build

# Check resource usage
docker stats ferifly-travel-app
```

---

## 🌐 Accessing the Application

- **Development**: http://localhost:8080
- **Server IP**: http://your-server-ip:8080
- **Production**: https://ferifly.com (after NPM setup)
- **NPM Admin**: http://your-server-ip:81

---

## 🔐 Security Checklist

- [ ] Change NPM default credentials
- [ ] Enable SSL with Let's Encrypt
- [ ] Force SSL (HTTPS)
- [ ] Enable HSTS
- [ ] Configure firewall:
  ```bash
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw allow 81/tcp
  sudo ufw enable
  ```

---

## 📞 Need Help?

**Ferifly Support**
- 📧 Email: Feri-fly@live.de
- 📱 Phone: +383 45 411 400
- 💬 WhatsApp: +383 45 411 400

---

## 📚 More Documentation

- [Full Deployment Guide](DEPLOYMENT.md)
- [Project README](README.md)
- [Branding Guidelines](branding.md)

---

© 2024 Ferifly Travel Agency

