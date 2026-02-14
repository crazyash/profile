#!/bin/bash

# Professional Profile Deployment Script
# This script builds the static site and prepares it for deployment

echo "Starting Professional Profile Deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the static site
echo "Building static site..."
npm run build

if [ $? -eq 0 ]; then
    echo "Build completed successfully!"
    echo ""
    echo "Files ready for deployment:"
    echo "   • Root index.html (for static hosting)"
    echo "   • build/ directory (complete static site)"
    echo ""
    echo "Deployment options:"
    echo "   • Upload index.html and build/ to your web server"
    echo "   • Deploy to GitHub Pages, Netlify, or Vercel"
    echo "   • Use any static hosting service"
    echo ""
    echo "Development server:"
    echo "   • Run 'npm start' to start the Node.js server"
    echo "   • Visit http://localhost:3000"
else
    echo "Build failed. Please check the errors above."
    exit 1
fi
