#!/bin/bash
echo "========================================"
echo " Super Skull God Pro - Linux Build"
echo "========================================"
echo ""

echo "[1/2] Installing dependencies..."
npm install
echo ""

echo "[2/2] Building Linux packages..."
echo "This will create DEB, RPM, and AppImage in the dist folder"
npm run build:linux
echo ""

echo "========================================"
echo "Build complete!"
echo ""
echo "Your Linux builds are in the 'dist' folder:"
echo "  - .deb package (Debian/Ubuntu)"
echo "  - .rpm package (Fedora/RedHat/SUSE)"
echo "  - .AppImage (Universal Linux)"
echo ""
echo "Installation:"
echo "  DEB: sudo dpkg -i super-skull-god-pro_1.0.0_amd64.deb"
echo "  RPM: sudo rpm -i super-skull-god-pro-1.0.0.x86_64.rpm"
echo "  AppImage: chmod +x *.AppImage && ./*.AppImage"
echo "========================================"
