#!/usr/bin/env bash

# Clean node_modules to ensure we don't have platform-specific issues
echo "Cleaning node_modules..."
rm -rf node_modules

# Install dependencies with regular npm install (not ci)
echo "Installing dependencies..."
npm install

# Make vite binary executable
echo "Setting executable permissions on vite..."
if [ -f "./node_modules/.bin/vite" ]; then
  chmod +x ./node_modules/.bin/vite
fi

# Run build
echo "Running build..."
npm run build

# Output success message
echo "Build completed successfully!"
