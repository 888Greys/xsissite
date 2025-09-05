#!/bin/bash

# Auth System Setup Script
# This script sets up the development environment for the auth system

echo "🔐 Auth System Setup Script"
echo "=========================="

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the auth-system root directory"
    exit 1
fi

echo "📋 Setting up environment files..."

# Setup backend environment
if [ ! -f ".env" ]; then
    echo "📄 Creating backend .env file..."
    cp .env.example .env
    echo "✅ Backend .env created from .env.example"
    echo "⚠️  Please update the values in .env for your environment"
else
    echo "✅ Backend .env already exists"
fi

# Setup frontend environment
if [ ! -f "frontend/.env.local" ]; then
    echo "📄 Creating frontend .env.local file..."
    cp frontend/.env.example frontend/.env.local
    echo "✅ Frontend .env.local created from .env.example"
    echo "⚠️  Please update the values in frontend/.env.local for your environment"
else
    echo "✅ Frontend .env.local already exists"
fi

echo ""
echo "���� Starting PostgreSQL database..."
docker-compose up -d postgres

echo ""
echo "📦 Installing dependencies..."

# Backend setup
echo "🐍 Setting up Python backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment and installing dependencies..."
source venv/bin/activate
pip install -r requirements.txt

cd ..

# Frontend setup
echo "📱 Setting up Node.js frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
else
    echo "✅ Node.js dependencies already installed"
fi

cd ..

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "🚀 To start the development servers:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn main:app --reload"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "🌐 Access Points:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "⚠️  Don't forget to update your .env files with the correct values!"