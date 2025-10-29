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

```cmd
# From project root

# 1. Copy latest code to www and sync to Android
build-android.bat

# 2. Build the APK
cd android
gradlew.bat clean
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
