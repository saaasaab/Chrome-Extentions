#!/bin/bash

# Build the extension with Vite
echo "Building extension with Vite..."
yarn build

# Create necessary directories
echo "Creating directories..."
mkdir -p dist/widget dist/popup

# Copy static files
echo "Copying static files..."
cp src/widget/widget.html dist/widget/
cp src/widget/widget.css dist/widget/
cp src/popup/popup.html dist/popup/
cp src/popup/popup.css dist/popup/

echo "Build complete! Extension files are in the dist/ directory." 