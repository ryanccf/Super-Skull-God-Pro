#!/bin/bash
echo "========================================"
echo "  Super Skull God Pro - iOS Build"
echo "========================================"
echo ""

echo "[1/4] Incrementing version numbers..."
pwsh increment-version.ps1 2>/dev/null || powershell -ExecutionPolicy Bypass -File increment-version.ps1
echo ""

echo "[2/4] Copying web files to www directory..."
# Create www directory if it doesn't exist
mkdir -p www

# Copy index.html
cp -f index.html www/index.html

# Copy src folder
cp -rf src www/

echo "Web files copied successfully!"
echo ""

echo "[3/4] Creating web release ZIP..."
# Delete old ZIP if it exists
rm -f super-skull-god-pro-web.zip
# Create new ZIP
zip -r super-skull-god-pro-web.zip www/ > /dev/null
echo "Web ZIP created: super-skull-god-pro-web.zip"
echo ""

echo "[4/4] Copying to iOS..."
npx cap copy ios

echo ""
echo "========================================"
echo "  Preparation Complete!"
echo "========================================"
echo ""
echo "Opening Xcode..."
npx cap open ios

echo ""
echo "========================================"
echo "  Next Steps:"
echo "========================================"
echo "1. In Xcode, select your development team"
echo "2. Connect your iPhone or select a simulator"
echo "3. Click the Play button to build and run"
echo "4. For App Store: Product > Archive"
echo ""
