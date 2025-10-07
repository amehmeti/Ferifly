# ✈️ Ferifly Travel & Tourism - Quick Deployment

> Production-ready deployment with Docker and Nginx Proxy Manager

---

## 🚀 Quick Start (3 Steps)

### Step 1: Deploy Application
```bash
# Make the start script executable
chmod +x start.sh

# Run it
./start.sh
```

Your app will be running on **port 8080**.

### Step 2: Configure Nginx Proxy Manager

1. Open NPM: `http://your-server-ip:81`
2. Add Proxy Host:
   - **Domain**: `ferifly.com, www.ferifly.com`
   - **Forward to**: `ferifly-travel-app` (port `8080`)
   - **Enable SSL**: Let's Encrypt
   - **Force SSL**: ✅
   - **HTTP/2**: ✅

### Step 3: Done! 🎉
Visit: **https://ferifly.com**

---

## 📖 Detailed Documentation
See [DEPLOYMENT.md](DEPLOYMENT.md) for complete guide.

---

## 🛠️ Useful Commands

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Restart
docker-compose restart

# View logs
docker-compose logs -f

# Rebuild
docker-compose up -d --build
```

---

## 📞 Support

**Ferifly Travel Agency**
- Email: Feri-fly@live.de
- Phone: +383 45 411 400

---

© 2024 Ferifly Travel Agency


