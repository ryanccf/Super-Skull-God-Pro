#!/bin/bash
echo "========================================"
echo " Super Skull God Pro - RPM Build"
echo "========================================"
echo ""

echo "[1/2] Installing dependencies..."
npm install
echo ""

echo "[2/2] Building RPM package..."
npm run build:linux-rpm
echo ""

echo "========================================"
echo "Build complete!"
echo ""
echo "Your RPM package is in the 'dist' folder"
echo ""
echo "Install with:"
echo "  sudo rpm -i dist/super-skull-god-pro-1.0.0.x86_64.rpm"
echo "  or"
echo "  sudo dnf install dist/super-skull-god-pro-1.0.0.x86_64.rpm"
echo "========================================"
