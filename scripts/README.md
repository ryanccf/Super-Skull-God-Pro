# Build Scripts

This folder contains all build scripts for Super Skull God Pro.

## Windows Builds

- `build-win.bat` - Full Windows build with error checking (recommended)
- `build-win-simple.bat` - Simple Windows build
- `build-windows.bat` - Alternative Windows build script
- `build-windows.sh` - Windows build from Linux/Mac (requires Wine)

**Usage:** Double-click the `.bat` file or run from command line

## Linux Builds

- `build-lin.sh` - Quick build for all Linux formats
- `build-linux.sh` - Full Linux build
- `build-linux-deb.sh` - Build DEB package only
- `build-linux-rpm.sh` - Build RPM package only (requires rpmbuild)
- `build-linux-quick.sh` - Build DEB + AppImage only

**Usage:** `./scripts/build-lin.sh` from project root

## Mobile Builds

- `build-android.sh` - Build Android APK (Linux/Mac)
- `build-android.bat` - Build Android APK (Windows)
- `build-ios.sh` - Build iOS app (Mac only)
- `build-mac.sh` - Build Mac app (Mac only)

## Output

All builds are placed in the `dist/` folder at the project root.

## Documentation

See the following files in the project root for detailed instructions:
- `BUILD-WINDOWS.md` - Windows build guide
- `BUILD.md` - Linux and general build guide
- `BUILD-QUICK-REFERENCE.md` - Quick reference for all platforms
