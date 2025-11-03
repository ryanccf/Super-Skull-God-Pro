#!/bin/bash
echo "========================================"
echo " Super Skull God Pro - DEB Build"
echo "========================================"
echo ""

echo "[1/2] Installing dependencies..."
npm install
echo ""

echo "[2/2] Building DEB package..."
npm run build:linux-deb
echo ""

echo "========================================"
echo "Build complete!"
echo ""
echo "Your DEB package is in the 'dist' folder"
echo ""
echo "Install with:"
echo "  sudo dpkg -i dist/super-skull-god-pro_1.0.0_amd64.deb"
echo "========================================"
