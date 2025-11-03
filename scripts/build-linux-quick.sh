#!/bin/bash
# Quick Linux build - only DEB and AppImage (no rpmbuild required)
echo "========================================"
echo " Super Skull God Pro - Linux Build"
echo " (DEB + AppImage only)"
echo "========================================"
echo ""

echo "[1/2] Installing dependencies..."
npm install
echo ""

echo "[2/2] Building DEB and AppImage..."
npm run build:linux-deb
echo ""

echo "========================================"
echo "Build complete!"
echo ""
echo "Built packages in 'dist' folder:"
echo "  - super-skull-god-pro_1.0.0_amd64.deb"
echo "  - Super Skull God Pro-1.0.0.AppImage"
echo ""
echo "Install DEB with:"
echo "  sudo dpkg -i dist/super-skull-god-pro_1.0.0_amd64.deb"
echo ""
echo "Run AppImage with:"
echo "  chmod +x dist/Super\\ Skull\\ God\\ Pro-1.0.0.AppImage"
echo "  ./dist/Super\\ Skull\\ God\\ Pro-1.0.0.AppImage"
echo ""
echo "Note: For RPM packages, install 'rpm' first:"
echo "  sudo apt install rpm"
echo "  Then run: ./build-linux.sh"
echo "========================================"
