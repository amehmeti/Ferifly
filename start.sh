#!/bin/bash
# Quick start script for Ferifly Travel App with Nginx Proxy Manager

echo "🚀 Starting Ferifly Travel Application with Nginx Proxy Manager..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Use docker compose (new) or docker-compose (old)
DOCKER_COMPOSE="docker compose"
if ! docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
fi

# Build and start the application
echo "📦 Building Ferifly Docker image..."
$DOCKER_COMPOSE build ferifly-web

echo ""
echo "🐳 Starting containers (NPM + Ferifly App)..."
$DOCKER_COMPOSE up -d

echo ""
echo "⏳ Waiting for services to start..."
echo "   - Nginx Proxy Manager is starting..."
sleep 10
echo "   - Ferifly App is starting..."
sleep 5

# Check if containers are running
NPM_RUNNING=$(docker ps -q -f name=nginx-proxy-manager)
APP_RUNNING=$(docker ps -q -f name=ferifly-travel-app)

echo ""
if [ -n "$NPM_RUNNING" ] && [ -n "$APP_RUNNING" ]; then
    echo "✅ Both services are running successfully!"
    echo ""
    echo "📍 Access Points:"
    echo "   🌐 Nginx Proxy Manager Admin: http://$(hostname -I | awk '{print $1}'):81"
    echo "   📱 Ferifly App (direct): http://$(hostname -I | awk '{print $1}'):8080"
    echo ""
    echo "🔐 NPM Default Login (CHANGE IMMEDIATELY!):"
    echo "   Email: admin@example.com"
    echo "   Password: changeme"
    echo ""
    echo "⚙️  Next Steps:"
    echo "   1. Open NPM Admin Panel (port 81)"
    echo "   2. Login and CHANGE default credentials"
    echo "   3. Add Proxy Host:"
    echo "      - Domain: your-domain.com"
    echo "      - Forward to: ferifly-travel-app:8080"
    echo "      - Enable SSL with Let's Encrypt"
    echo ""
    echo "📊 View Logs:"
    echo "   All services: $DOCKER_COMPOSE logs -f"
    echo "   Ferifly only: $DOCKER_COMPOSE logs -f ferifly-web"
    echo "   NPM only: $DOCKER_COMPOSE logs -f nginx-proxy-manager"
    echo ""
    echo "🛑 Stop All Services:"
    echo "   $DOCKER_COMPOSE down"
    echo ""
    echo "📖 Full Documentation: See DEPLOYMENT.md or QUICK-START.md"
elif [ -n "$NPM_RUNNING" ] && [ -z "$APP_RUNNING" ]; then
    echo "⚠️  NPM is running but Ferifly App failed to start."
    echo "   Check logs: $DOCKER_COMPOSE logs ferifly-web"
elif [ -z "$NPM_RUNNING" ] && [ -n "$APP_RUNNING" ]; then
    echo "⚠️  Ferifly App is running but NPM failed to start."
    echo "   Check logs: $DOCKER_COMPOSE logs nginx-proxy-manager"
else
    echo "❌ Failed to start services. Check logs:"
    echo "   $DOCKER_COMPOSE logs"
fi

