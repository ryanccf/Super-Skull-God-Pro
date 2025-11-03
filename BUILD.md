# Super Skull God Pro - Build Instructions

This document explains how to build the game for different platforms.

## Prerequisites

- **Node.js** (v16 or higher) - Download from https://nodejs.org
- **npm** (comes with Node.js)

## Linux Builds

### Build All Linux Packages (DEB, RPM, AppImage)

```bash
./scripts/build-lin.sh
```

Or use the full script:
```bash
./scripts/build-linux.sh
```

This creates:
- **DEB Package** - For Debian/Ubuntu/Mint
- **RPM Package** - For Fedora/RedHat/SUSE (requires `rpmbuild`)
- **AppImage** - Universal Linux binary

### Build Individual Formats

**DEB only:**
```bash
./scripts/build-linux-deb.sh
```

**RPM only** (requires `rpmbuild`):
```bash
sudo apt install rpm  # On Debian/Ubuntu
./scripts/build-linux-rpm.sh
```

### Installing Linux Builds

**DEB Package:**
```bash
sudo dpkg -i dist/super-skull-god-pro_1.0.0_amd64.deb
```

**RPM Package:**
```bash
sudo rpm -i dist/super-skull-god-pro-1.0.0.x86_64.rpm
# or
sudo dnf install dist/super-skull-god-pro-1.0.0.x86_64.rpm
```

**AppImage:**
```bash
chmod +x dist/Super\ Skull\ God\ Pro-1.0.0.AppImage
./dist/Super\ Skull\ God\ Pro-1.0.0.AppImage
```

## Windows Builds

### Build Windows EXE

**On Windows:**
```batch
scripts\build-win.bat
```

**On Linux/Mac** (requires Wine):
```bash
./scripts/build-windows.sh
```

This creates a ZIP file containing the Windows executable.

### Notes for Windows Builds from Linux

Building Windows executables from Linux requires Wine:
```bash
sudo apt update
sudo apt install wine wine32 wine64
```

## Output Directory

All builds are placed in the `dist/` folder:
```
dist/
├── super-skull-god-pro_1.0.0_amd64.deb      # Debian/Ubuntu package
├── super-skull-god-pro-1.0.0.x86_64.rpm     # Fedora/RedHat package
├── Super Skull God Pro-1.0.0.AppImage       # Universal Linux
└── Super Skull God Pro-1.0.0-win.zip        # Windows (if built)
```

## Development

To run the game locally without building:

```bash
npm install
npm run electron
```

## Troubleshooting

**"rpmbuild not found":**
- RPM builds require `rpmbuild` to be installed
- Install with: `sudo apt install rpm` (Debian/Ubuntu)
- Or build only DEB: `./build-linux-deb.sh`

**"wine required":**
- Windows builds from Linux need Wine
- Install with: `sudo apt install wine wine32 wine64`

**Build fails:**
1. Make sure Node.js is installed: `node --version`
2. Install dependencies: `npm install`
3. Check you have enough disk space (builds need ~500MB)

## Manual Build Commands

If you prefer to use npm directly:

```bash
# Install dependencies
npm install

# Build for Linux
npm run build:linux        # All formats
npm run build:linux-deb    # DEB only
npm run build:linux-rpm    # RPM only

# Build for Windows
npm run build:win64        # Windows 64-bit

# Build everything
npm run build:all          # Windows + Linux
```

## Platform-Specific Features

### Desktop (Linux/Windows)
- Fullscreen toggle in Settings menu
- Native window controls
- Desktop notifications (future)

### Web (Itch.io)
- Browser-based gameplay
- Touch controls on mobile
- Cloud saves via localStorage

---

For more information, visit: https://github.com/ryanccf/Super-Coin-God-Pro
