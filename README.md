# Super Skull God Pro Championship Edition

A Phaser 3 physics-based arcade game with roguelike card collection mechanics.

## Development

### Running Locally

1. Start a local HTTP server:
```bash
python3 -m http.server 8000
```

2. Open your browser to `http://localhost:8000`

### Project Structure

- `src/` - Game source code
  - `scenes/` - Phaser game scenes
  - `components/` - Reusable UI components
  - `services/` - Business logic services
  - `managers/` - Scene-level managers
  - `utils/` - Utility functions
  - `config/` - Game configuration
  - `assets/` - Images, backgrounds, etc.

## Building for Android

### Prerequisites

- Node.js and npm installed
- Android Studio (for SDK)
- Java Development Kit (JDK)

### Prepare and Sync Web Assets to Android

**IMPORTANT:** Before building, you MUST copy your latest code to `www/` and sync to Android:

**Option 1: Use the build script (Recommended)**
```cmd
# From project root - this copies files to www/ and syncs to Android
build-android.bat
```

**Option 2: Manual steps**
```cmd
# 1. Copy your current code to www directory
copy /Y index.html www\index.html
xcopy /E /I /Y src www\src

# 2. Copy to Android project
npx cap copy android
```

This is necessary because:
- Your working files are in the root `src/` folder
- Capacitor syncs from the `www/` directory
- Without copying first, your APK will contain old code!

### Build APK on Windows

Navigate to the Android directory and use the Gradle wrapper:

```cmd
cd android
```

#### Clean Build (Optional but Recommended)

```cmd
gradlew.bat clean
```

#### Build Debug APK

```cmd
gradlew.bat assembleDebug
```

The debug APK will be located at:
`android/app/build/outputs/apk/debug/app-debug.apk`

#### Build Release APK

```cmd
gradlew.bat assembleRelease
```

The release APK will be located at:
`android/app/build/outputs/apk/release/app-release.apk`

### Full Build Process

**Option 1: Use the automated build script (Recommended)**
```cmd
# From project root - this does everything automatically
build-android.bat
```

The script will:
1. Increment version numbers
2. Copy files to www/
3. Sync to Android
4. Build the debug APK
5. Show you the APK location and size

**Option 2: Manual build**
```cmd
# From project root
cd android
gradlew.bat clean
gradlew.bat assembleDebug
```

For release builds:
```cmd
cd android
gradlew.bat assembleRelease
```

**Note:** For release builds, you'll need to sign the APK with a keystore. Configure signing in `android/app/build.gradle`.

### Troubleshooting

#### "Invalid source release: 21" Error

This error means Gradle is trying to use Java 21 but you don't have it installed. The project is configured to use Java 17 in `android/app/build.gradle`:

```gradle
compileOptions {
    sourceCompatibility JavaVersion.VERSION_17
    targetCompatibility JavaVersion.VERSION_17
}
```

Make sure you have JDK 17 or higher installed. You can download it from:
- [Oracle JDK](https://www.oracle.com/java/technologies/downloads/)
- [OpenJDK](https://adoptium.net/)

To check your Java version:
```cmd
java -version
javac -version
```

To verify Gradle is using the correct Java:
```cmd
cd android
gradlew.bat -version
```

If Gradle is not detecting Java 21, you may need to:

1. **Set JAVA_HOME environment variable** (if the installer didn't):
   - Search for "Environment Variables" in Windows
   - Add/Edit `JAVA_HOME` to point to your JDK 21 installation (e.g., `C:\Program Files\Eclipse Adoptium\jdk-21.x.x.x`)
   - Add `%JAVA_HOME%\bin` to your PATH
   - **Restart your command prompt** after changing environment variables

2. **Clear Gradle cache and rebuild**:
```cmd
cd android
gradlew.bat --stop
gradlew.bat clean
gradlew.bat assembleDebug
```

#### APK Contains Old Code

If your APK is building with old code even after running the build script:

**Cause:** The `android/app/src/main/assets/` directory wasn't created or updated. Capacitor needs to copy web files from `www/` to this assets directory, but `npx cap sync` sometimes doesn't create it.

**Solution:** Use `npx cap copy android` instead of `npx cap sync android`. The build script has been updated to use `copy`.

**Manual fix:**
```cmd
# 1. Copy current code to www
copy /Y index.html www\index.html
xcopy /E /I /Y src www\src

# 2. Copy to Android (this creates/updates assets directory)
npx cap copy android

# 3. Clean build to ensure Gradle uses new files
cd android
gradlew.bat clean
gradlew.bat assembleDebug
```

**Verify the fix:**
Check that your latest code is in the Android assets:
```cmd
ls android/app/src/main/assets/public/src/scenes/
```
You should see your latest scene files (e.g., ShopRefactored.js, Altar.js).

#### APK is only 4MB but should be 60-90MB

If your APK is much smaller than expected:

**Expected size:** With 119MB of PNG assets, your APK should be **60-90MB** (PNG files are pre-compressed so they don't shrink much in the APK).

**Fixes applied in build.gradle:**
- Added `noCompress` directives for PNG/JPG files to prevent double-compression issues
- Added explicit `sourceSets` configuration to ensure Gradle finds the assets
- These settings ensure all 119MB of assets are included in the APK

**Verify your build:**
1. Run the build script: `build-android.bat`
2. Check the output - it will show the APK size
3. The debug APK should be in `android\app\build\outputs\apk\debug\`
4. File should be 60MB+ in size

**If still small:**
- Make sure you ran `build-android.bat` (not manual gradle commands)
- Check the build output for errors about "assets" or "packaging"
- Verify assets exist: `dir android\app\src\main\assets\public\src\assets\images\`

## Building for iOS (iPhone/iPad)

### Prerequisites

- **macOS** (iOS builds require Xcode, which only runs on Mac)
- **Xcode** installed from the Mac App Store
- **Apple Developer Account** (free for testing on your own device, paid for App Store)
- Node.js and npm installed

### Build iOS App

**Option 1: Use the build script (Recommended)**
```bash
# From project root - this prepares and opens Xcode
./build-ios.sh
```

The script will:
1. Increment version numbers
2. Copy files to www/
3. Sync to iOS project
4. Open the project in Xcode

**Option 2: Manual steps**
```bash
# 1. Copy your current code to www directory
cp -f index.html www/index.html
cp -rf src www/

# 2. Copy to iOS project
npx cap copy ios

# 3. Open in Xcode
npx cap open ios
```

### Building in Xcode

Once Xcode opens:

1. **Select your development team:**
   - Click on the project name in the left sidebar
   - Go to "Signing & Capabilities"
   - Select your Apple Developer team from the dropdown

2. **Choose your target device:**
   - At the top, select your connected iPhone/iPad
   - Or select an iOS Simulator

3. **Build and Run:**
   - Click the Play (▶) button to build and install on your device
   - First time may take a few minutes

4. **For App Store Distribution:**
   - Go to Product > Archive
   - Follow the App Store submission wizard

### Testing on Physical Device

To test on your iPhone/iPad without paying for a developer account:

1. Connect your device via USB
2. In Xcode, select your device from the device list
3. You may need to enable "Developer Mode" on your iOS device (Settings > Privacy & Security > Developer Mode)
4. Click Run - Xcode will install and launch the app

**Note:** Free accounts can only install apps for 7 days before they need to be reinstalled.

### Troubleshooting iOS Builds

- **"No matching provisioning profiles found"**: Select your development team in Signing & Capabilities
- **"Untrusted Developer"**: On your iOS device, go to Settings > General > VPN & Device Management, and trust your developer certificate
- **Build fails**: Make sure you've run `./build-ios.sh` or manually copied files to www/ and synced with `npx cap copy ios`

## Building for Mac

### Prerequisites

- Node.js and npm installed
- Python 3 (for local testing)

### Build Web Version for Mac

**Option 1: Use the build script (Recommended)**
```bash
# From project root - this creates a web build
./build-mac.sh
```

The script will:
1. Increment version numbers
2. Copy files to www/
3. Create a Mac web ZIP (`super-skull-god-pro-mac-web.zip`)
4. Show distribution options

**Option 2: Manual steps**
```bash
# 1. Copy your current code to www directory
cp -f index.html www/index.html
cp -rf src www/

# 2. Create ZIP for distribution
zip -r super-skull-god-pro-mac-web.zip www/
```

### Distribution Options

**1. Web Build (Works on any Mac browser)**
- Upload the `www` folder to any web server
- Or extract `super-skull-god-pro-mac-web.zip`
- Open `index.html` in Safari, Chrome, or Firefox

**2. Test Locally**
```bash
cd www
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser

**3. Create a Native Mac App (Optional)**

For a native Mac application, you can use:

**Option A: Electron (Easier)**
```bash
npm install -g electron
# Create Electron wrapper around your web build
```

**Option B: Tauri (Better Performance)**
```bash
# Install Tauri
# Create native Mac app with Rust backend
```

### Linux/Unix Build

The same `build-mac.sh` script works on Linux and Unix systems:
```bash
./build-mac.sh
```

## Game Features

- Physics-based skull collection gameplay
- Placeable items: Baskets, Bumpers, Flippers, Boards, Boosters, Shrinkers, Portals, Duplicators
- Upgrade system for max skulls, game time, and auto-start
- Prestige system with multipliers
- Card collection system with booster packs
- Character unlockables (Skull Knight, Skeleton Warrior)
- Auto-start functionality with configurable delays
- High score tracking

## Technologies

- **Phaser 3** - Game framework
- **Matter.js** - Physics engine
- **Capacitor** - Native app wrapper
- Vanilla JavaScript (ES6+)
