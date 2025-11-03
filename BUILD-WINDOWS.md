# Building Super Skull God Pro for Windows

This guide explains how to build Windows executables for Super Skull God Pro.

## Prerequisites

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org
   - Choose the "LTS" (Long Term Support) version
   - Install with default options

2. **Git** (optional, for cloning the repository)
   - Download from: https://git-scm.com

## Quick Start

### Method 1: Double-Click Build (Easiest)

1. Open File Explorer
2. Navigate to the game folder
3. Go into the `scripts` folder
4. Double-click `build-win.bat`
5. Wait for the build to complete
6. Press any key to close the window

### Method 2: Simple Build

Double-click `scripts\build-win-simple.bat` for a minimal output build.

### Method 3: Command Line Build

1. Open Command Prompt or PowerShell
2. Navigate to the game folder:
   ```cmd
   cd path\to\Super-Skull-God-Pro
   ```
3. Run the build script:
   ```cmd
   scripts\build-win.bat
   ```

## What Gets Built

When you build on Windows, you'll get **three versions**:

1. **NSIS Installer** (`Super Skull God Pro Setup 1.0.0.exe`)
   - Full installer with uninstaller
   - Creates desktop shortcut
   - Adds to Start Menu
   - Best for distribution

2. **Portable EXE** (`Super Skull God Pro 1.0.0.exe`)
   - Single executable
   - No installation needed
   - Runs from any folder
   - Great for USB drives

3. **ZIP Archive** (`Super Skull God Pro-1.0.0-win.zip`)
   - Complete package in ZIP format
   - Extract and run
   - Alternative distribution method

## Build Output Location

All builds are placed in the `dist\` folder:

```
dist\
├── Super Skull God Pro Setup 1.0.0.exe    (Installer)
├── Super Skull God Pro 1.0.0.exe          (Portable)
└── Super Skull God Pro-1.0.0-win.zip      (ZIP archive)
```

## Manual Build Steps

If you prefer to build manually:

1. **Install dependencies:**
   ```cmd
   npm install
   ```

2. **Build the executable:**
   ```cmd
   npm run build:win64
   ```

3. **Find your builds in the `dist` folder**

## Testing Your Build

### Test the Portable Version

1. Go to `dist` folder
2. Run `Super Skull God Pro 1.0.0.exe`
3. The game should launch immediately

### Test the Installer

1. Go to `dist` folder
2. Run `Super Skull God Pro Setup 1.0.0.exe`
3. Follow installation wizard
4. Launch from desktop or Start Menu

## Distributing Your Game

### Option 1: Share the Installer (Recommended)
- Upload `Super Skull God Pro Setup 1.0.0.exe` to Itch.io
- Users double-click to install
- Includes automatic uninstaller

### Option 2: Share the Portable EXE
- Upload `Super Skull God Pro 1.0.0.exe`
- Users run directly without installation
- Simpler but no shortcuts

### Option 3: Share the ZIP
- Upload `Super Skull God Pro-1.0.0-win.zip`
- Users extract and run
- Traditional distribution method

## Troubleshooting

### "Node.js is not installed"
- Download Node.js from https://nodejs.org
- Install it and restart Command Prompt
- Run build script again

### "npm is not recognized"
- npm comes with Node.js
- Make sure Node.js is installed correctly
- Restart your computer if needed

### Build fails with errors
1. Delete `node_modules` folder
2. Delete `package-lock.json` file
3. Run `npm install` again
4. Run build script again

### "wine required" error
- This error appears when building from Linux
- Windows builds must be done on Windows
- Or install Wine on Linux (see main BUILD.md)

### Build is very slow
- First build takes longer (downloads Electron)
- Subsequent builds are much faster
- Typical first build: 3-5 minutes
- Typical rebuild: 30-60 seconds

### Antivirus flags the EXE
- This is common with unsigned Electron apps
- The game is safe (you built it yourself!)
- Add exception in your antivirus
- For distribution, consider code signing ($$$)

## Advanced Configuration

### Changing the Version Number

Edit `package.json`:
```json
{
  "version": "1.0.0"  ← Change this
}
```

### Changing the App Icon

Replace `icon.png` with your own:
- Must be PNG format
- Recommended: 512x512 or 1024x1024
- Will be automatically converted for Windows

### Changing Build Settings

Edit `package.json` under the `"build"` section:
```json
"win": {
  "target": ["nsis", "portable", "zip"],
  "icon": "icon.png"
}
```

## System Requirements

### For Building
- Windows 7 or higher
- 4 GB RAM minimum
- 2 GB free disk space
- Internet connection (first build only)

### For Running the Built Game
- Windows 7 or higher
- 2 GB RAM minimum
- 500 MB free disk space
- No internet required

## Next Steps

After building:

1. **Test your build thoroughly**
   - Install and uninstall
   - Test all game features
   - Check saves persist

2. **Prepare for distribution**
   - Write release notes
   - Take screenshots
   - Create promotional materials

3. **Upload to Itch.io**
   - Create new project
   - Upload installer or portable EXE
   - Set Windows as supported platform

## Additional Resources

- Electron Builder Docs: https://www.electron.build
- Electron Docs: https://electronjs.org
- Node.js Docs: https://nodejs.org/docs

## Support

If you encounter issues:
1. Check this guide thoroughly
2. Review error messages carefully
3. Check the main BUILD.md for more info
4. Search online for specific error messages

---

**Ready to build?** Just double-click `build-win.bat` and you're on your way!
