#!/bin/bash
# Quick Linux build script
echo "Building Linux packages..."
npm install && npm run build:linux
echo ""
echo "Done! Check the 'dist' folder for:"
echo "  - DEB package (Debian/Ubuntu)"
echo "  - RPM package (Fedora/RedHat/SUSE)"
echo "  - AppImage (Universal)"
