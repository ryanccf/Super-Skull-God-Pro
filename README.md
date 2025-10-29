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

### Sync Web Assets to Android

Before building, sync your web code changes to the Android project:

```bash
# From project root
npx cap sync android
```

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
npx cap sync android
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
