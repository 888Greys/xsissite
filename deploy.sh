#!/bin/bash

# Production deployment script for auth-system
# Usage: ./deploy.sh

set -e

echo "🚀 Starting production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="pom.xsis.online"
API_DOMAIN="api.pom.xsis.online"

echo -e "${YELLOW}📋 Pre-deployment checklist:${NC}"
echo "1. Domain DNS points to this server"
echo "2. Ports 80, 443, 3000, 8000 are available"
echo "3. Docker and docker-compose are installed"
echo "4. SSL certificates are ready or will be generated"
echo ""

read -p "Continue with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

# Step 1: Build frontend
echo -e "${YELLOW}🔨 Building frontend...${NC}"
cd frontend
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi
cd ..

# Step 2: Stop existing services
echo -e "${YELLOW}🛑 Stopping existing services...${NC}"
docker-compose down || true

# Step 3: Build and start services
echo -e "${YELLOW}🐳 Building and starting Docker services...${NC}"
docker-compose up -d --build

# Step 4: Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 30

# Step 5: Check service health
echo -e "${YELLOW}🔍 Checking service health...${NC}"

# Check backend
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    echo "Backend logs:"
    docker-compose logs --tail=20 backend
    exit 1
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is healthy${NC}"
else
    echo -e "${RED}❌ Frontend health check failed${NC}"
    echo "Frontend logs:"
    docker-compose logs --tail=20 frontend
    exit 1
fi

# Step 5.5: Check email configuration
echo -e "${YELLOW}📧 Checking email configuration...${NC}"
echo "To test email functionality, run:"
echo "python test_email.py your.email@example.com"

# Step 6: SSL Certificate setup (if needed)
echo -e "${YELLOW}🔐 Checking SSL certificates...${NC}"
if [ ! -f "nginx/ssl/fullchain.pem" ] || [ ! -f "nginx/ssl/privkey.pem" ]; then
    echo -e "${YELLOW}📜 SSL certificates not found. Setting up Let's Encrypt...${NC}"
    
    # Create certbot directory
    mkdir -p nginx/ssl
    
    echo "To set up SSL certificates, run these commands on your server:"
    echo ""
    echo "sudo apt update && sudo apt install -y certbot"
    echo "sudo certbot certonly --standalone -d $DOMAIN -d $API_DOMAIN"
    echo "sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/"
    echo "sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/"
    echo "sudo chown \$(whoami):\$(whoami) nginx/ssl/*"
    echo ""
    echo "Then restart nginx: docker-compose restart nginx"
    echo ""
    echo -e "${YELLOW}⚠️  For now, using HTTP only${NC}"
else
    echo -e "${GREEN}✅ SSL certificates found${NC}"
fi

# Step 7: Final status
echo ""
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo ""
echo "📍 Service URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "🌐 Production URLs (after SSL setup):"
echo "   Frontend: https://$DOMAIN"
echo "   API:      https://$API_DOMAIN"
echo ""
echo "📊 Monitor services:"
echo "   docker-compose logs -f"
echo "   docker-compose ps"
echo ""
echo "🔄 To update:"
echo "   git pull && ./deploy.sh"

# Step 8: Show running containers
echo -e "${YELLOW}📦 Running containers:${NC}"
docker-compose ps