#!/bin/bash

echo "🔍 Checking Calorie Scanner Setup..."
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    
    # Check if API key is set
    if grep -q "ANTHROPIC_API_KEY=.\+" .env; then
        echo "✅ ANTHROPIC_API_KEY is configured"
    else
        echo "⚠️  ANTHROPIC_API_KEY is empty in .env file"
        echo "   Please add your API key from https://console.anthropic.com/"
    fi
else
    echo "❌ .env file not found"
    echo "   Run: cp .env.example .env"
fi

echo ""
echo "📦 Checking dependencies..."

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed"
    echo "   Run: npm install"
fi

echo ""
echo "🚀 To start the application:"
echo "   npm start"
echo ""
echo "📍 Then visit: http://localhost:8080/scanner"
