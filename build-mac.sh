#!/bin/bash
echo "========================================"
echo "  Super Skull God Pro - Mac Web Build"
echo "========================================"
echo ""

echo "[1/3] Incrementing version numbers..."
pwsh increment-version.ps1 2>/dev/null || powershell -ExecutionPolicy Bypass -File increment-version.ps1
echo ""

echo "[2/3] Copying web files to www directory..."
# Create www directory if it doesn't exist
mkdir -p www

# Copy index.html
cp -f index.html www/index.html

# Copy src folder
cp -rf src www/

echo "Web files copied successfully!"
echo ""

echo "[3/3] Creating Mac web release ZIP..."
# Delete old ZIP if it exists
rm -f super-skull-god-pro-mac-web.zip
# Create new ZIP
zip -r super-skull-god-pro-mac-web.zip www/ > /dev/null
echo "Mac Web ZIP created: super-skull-god-pro-mac-web.zip"
echo ""

echo "========================================"
echo "  Build Complete!"
echo "========================================"
echo ""
echo "Distribution options:"
echo ""
echo "1. WEB BUILD (Current):"
echo "   - Upload the 'www' folder to any web server"
echo "   - Or extract super-skull-god-pro-mac-web.zip"
echo "   - Open index.html in any browser"
echo ""
echo "2. To create a Mac APP:"
echo "   - Use Electron: npm install -g electron"
echo "   - Or use Tauri for native performance"
echo ""
echo "3. Test locally:"
echo "   - python3 -m http.server 8000 (in www folder)"
echo "   - Then open http://localhost:8000"
echo ""
