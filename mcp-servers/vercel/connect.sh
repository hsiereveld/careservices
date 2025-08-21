#!/bin/bash

# Vercel MCP Server Connection Script
# This script helps you connect the Vercel MCP server to Claude Code

echo "🚀 Vercel MCP Server Setup"
echo "========================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "📝 Please edit .env and add your Vercel API token"
    echo "   Get your token from: https://vercel.com/account/tokens"
    echo ""
    echo "After adding your token, run this script again."
    exit 1
fi

# Check if token is set
if grep -q "your_vercel_api_token_here" .env; then
    echo "⚠️  Please update your Vercel API token in .env"
    echo "   Get your token from: https://vercel.com/account/tokens"
    exit 1
fi

# Build if needed
if [ ! -d "build" ]; then
    echo "📦 Building the server..."
    npm install
    npm run build
fi

echo ""
echo "✅ Server is ready!"
echo ""
echo "To connect in Claude Code, use one of these methods:"
echo ""
echo "Method 1 (Direct):"
echo "  /connect mcp --path $(pwd)/build/index.js"
echo ""
echo "Method 2 (HTTP Proxy):"
echo "  1. In a terminal, run:"
echo "     npx @modelcontextprotocol/proxy --stdio --cmd \"node $(pwd)/build/index.js\" --port 3399"
echo ""
echo "  2. In Claude Code, run:"
echo "     /connect mcp --url http://localhost:3399"
echo ""
echo "Available tools after connecting:"
echo "  • vercel-list-all-deployments"
echo "  • vercel-create-deployment"
echo "  • vercel-list-projects"
echo "  • vercel-create-project"
echo "  • And many more!"