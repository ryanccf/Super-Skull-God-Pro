#!/bin/bash
echo "========================================"
echo " Super Skull God Pro - Windows Build"
echo "========================================"
echo ""

echo "[1/2] Installing dependencies..."
npm install
echo ""

echo "[2/2] Building Windows executable..."
echo "This will create a ZIP file in the dist folder"
npm run build:win64
echo ""

echo "========================================"
echo "Build complete!"
echo ""
echo "Your Windows build is in the 'dist' folder"
echo "Look for: Super Skull God Pro-1.0.0-win.zip"
echo ""
echo "Extract and run 'Super Skull God Pro.exe'"
echo "========================================"
