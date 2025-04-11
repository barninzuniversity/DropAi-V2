#!/usr/bin/env bash

# Install dependencies
echo "Installing dependencies..."
npm ci 

# Make vite binary executable directly in Render environment
echo "Setting executable permissions on vite..."
if [ -f "./node_modules/.bin/vite" ]; then
  chmod +x ./node_modules/.bin/vite
fi

# Run build using npm script to avoid permission issues
echo "Running build..."
npm run build

# Output success message
echo "Build completed successfully!"
