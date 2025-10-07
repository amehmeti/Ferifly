#!/bin/bash
# Quick start script for Ferifly Travel App

echo "🚀 Starting Ferifly Travel Application..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Build and start the application
echo "📦 Building Docker image..."
docker-compose build

echo ""
echo "🐳 Starting container..."
docker-compose up -d

echo ""
echo "⏳ Waiting for application to start..."
sleep 5

# Check if container is running
if [ "$(docker ps -q -f name=ferifly-travel-app)" ]; then
    echo ""
    echo "✅ Ferifly Travel App is running!"
    echo ""
    echo "📍 Access points:"
    echo "   Local: http://localhost:8080"
    echo "   Server: http://$(hostname -I | awk '{print $1}'):8080"
    echo ""
    echo "📊 View logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 Stop application:"
    echo "   docker-compose down"
    echo ""
    echo "⚙️  Next steps:"
    echo "   1. Configure Nginx Proxy Manager"
    echo "   2. Add your domain in NPM"
    echo "   3. Enable SSL certificate"
    echo ""
    echo "📖 Full documentation: See DEPLOYMENT.md"
else
    echo ""
    echo "❌ Failed to start application. Check logs:"
    echo "   docker-compose logs"
fi

