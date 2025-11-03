# Quick Build Reference

## Windows Builds

| Script | Description |
|--------|-------------|
| `scripts\build-win.bat` | **Full build** with detailed output and error checking |
| `scripts\build-win-simple.bat` | **Simple build** with minimal output |
| `scripts\build-windows.bat` | Alternative build script |

**Run on Windows:** Double-click the `.bat` file in the `scripts` folder

**Output:**
- `Super Skull God Pro Setup 1.0.0.exe` (Installer)
- `Super Skull God Pro 1.0.0.exe` (Portable)
- `Super Skull God Pro-1.0.0-win.zip` (ZIP)

---

## Linux Builds

| Script | Description |
|--------|-------------|
| `./scripts/build-lin.sh` | **Quick build** - All formats |
| `./scripts/build-linux.sh` | Full build with detailed output |
| `./scripts/build-linux-deb.sh` | DEB package only |
| `./scripts/build-linux-rpm.sh` | RPM package only (needs rpmbuild) |
| `./scripts/build-linux-quick.sh` | DEB + AppImage (no rpmbuild) |

**Output:**
- `super-skull-god-pro_1.0.0_amd64.deb` (Debian/Ubuntu)
- `super-skull-god-pro-1.0.0.x86_64.rpm` (Fedora/RedHat)
- `Super Skull God Pro-1.0.0.AppImage` (Universal)

---

## Mobile Builds

| Script | Description |
|--------|-------------|
| `./scripts/build-android.sh` | Android APK build |
| `scripts\build-android.bat` | Android APK (Windows) |
| `./scripts/build-ios.sh` | iOS build |

---

## NPM Commands

```bash
# Windows
npm run build:win64        # Windows 64-bit

# Linux
npm run build:linux        # All Linux formats
npm run build:linux-deb    # DEB only
npm run build:linux-rpm    # RPM only

# All platforms
npm run build:all          # Windows + Linux

# Development
npm run electron           # Run without building
```

---

## Output Directory

All builds go to: `dist/`

**Clean builds:**
```bash
rm -rf dist/              # Linux/Mac
rmdir /s /q dist          # Windows CMD
Remove-Item -Recurse dist # Windows PowerShell
```

---

## Quick Troubleshooting

| Error | Solution |
|-------|----------|
| "Node.js not installed" | Install from https://nodejs.org |
| "wine required" | Windows builds need Windows OR install wine |
| "rpmbuild not found" | `sudo apt install rpm` or use `build-linux-deb.sh` |
| Build fails | Delete `node_modules`, run `npm install` |
| Slow first build | Normal - downloads Electron (~200MB) |

---

## Platform-Specific Notes

### Windows
- ✅ Best: `scripts\build-win.bat`
- ✅ Creates: Installer + Portable + ZIP
- ✅ No extra dependencies needed

### Linux (Debian/Ubuntu)
- ✅ Best: `./scripts/build-lin.sh`
- ⚠️ RPM needs: `sudo apt install rpm`
- ✅ Works out of box for DEB + AppImage

### Mac
- ⚠️ Mac builds not yet configured
- 🔧 Run on Mac: `./scripts/build-mac.sh` (experimental)

---

## File Sizes (Approximate)

| Package Type | Size |
|--------------|------|
| Windows Installer | ~120 MB |
| Windows Portable | ~110 MB |
| Windows ZIP | ~110 MB |
| Linux DEB | ~150 MB |
| Linux RPM | ~150 MB |
| Linux AppImage | ~185 MB |

---

## Testing Builds

**Windows:**
```cmd
dist\Super Skull God Pro 1.0.0.exe
```

**Linux DEB:**
```bash
sudo dpkg -i dist/super-skull-god-pro_1.0.0_amd64.deb
```

**Linux AppImage:**
```bash
chmod +x dist/Super\ Skull\ God\ Pro-1.0.0.AppImage
./dist/Super\ Skull\ God\ Pro-1.0.0.AppImage
```

---

## Distribution Checklist

- [ ] Build for target platform
- [ ] Test the build
- [ ] Create release notes
- [ ] Take screenshots
- [ ] Upload to Itch.io/Steam/etc
- [ ] Mark supported platforms
- [ ] Set minimum requirements

---

**For detailed instructions, see:**
- `BUILD-WINDOWS.md` - Windows builds
- `BUILD.md` - Linux and general builds
