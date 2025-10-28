# Super Skull God Pro - Refactoring Guide

## 📋 Overview

This document describes the refactored architecture of Super Skull God Pro Championship Edition, following Phaser 3 best practices and modern software engineering principles.

## 🏗️ New Architecture

### Directory Structure

```
src/
├── config/              # Configuration constants
│   ├── Colors.js        # Color palette
│   ├── GameConfig.js    # Game dimensions, world settings
│   ├── UIConfig.js      # UI layout, spacing, depths
│   └── PhysicsConfig.js # Physics constants, collision categories
│
├── services/            # Business logic layer (no Phaser dependencies)
│   ├── SaveDataService.js   # Centralized save data/registry access
│   ├── ParticleService.js   # Particle effects creation
│   └── UpgradeService.js    # Upgrade cost calculation & purchase logic
│
├── components/
│   └── ui/              # Reusable UI components
│       ├── Button.js          # Standard button with hover/click
│       ├── Panel.js           # White backdrop panels
│       ├── Card.js            # Collectible card display
│       ├── CardGrid.js        # Card layout management
│       └── UpgradeButton.js   # Shop upgrade buttons
│
├── managers/            # Scene-level orchestration
│   ├── InputManager.js      # Keyboard & pointer input
│   ├── UIManager.js         # HUD & UI element creation
│   └── CollisionManager.js  # Physics collision handling
│
├── entities/            # Game objects with behavior
│   └── Skull.js        # Skull physics & logic
│
└── scenes/              # Phaser scenes (thin orchestration layer)
    ├── Boot.js
    ├── Preloader.js
    ├── MainMenu.js
    ├── Settings.js
    ├── ShopRefactored.js  # ✅ REFACTORED EXAMPLE
    ├── Altar.js           # TODO: Refactor
    ├── Lightbox.js        # TODO: Refactor
    ├── ClickerGame.js     # TODO: Refactor
    └── GameOver.js        # TODO: Refactor
```

## 🎯 Design Principles

### 1. Separation of Concerns
- **Services**: Pure business logic, no Phaser dependencies
- **Components**: Reusable UI elements extending Phaser classes
- **Managers**: Coordinate between services and components
- **Scenes**: Thin orchestration layer, delegate to managers

### 2. Single Responsibility
Each class has ONE clear purpose:
- `SaveDataService` → Data access
- `ParticleService` → Particle effects
- `Button` → Interactive button display
- `UIManager` → UI creation & tracking

### 3. Dependency Injection
Pass dependencies through constructors:
```javascript
class CollisionManager {
    constructor(scene, gameObjectManager) {
        this.scene = scene;
        this.gom = gameObjectManager;
    }
}
```

### 4. Service Layer Pattern
Services provide static methods for stateless operations:
```javascript
SaveDataService.getTotalSkulls(registry);
ParticleService.createBurst(scene, x, y, options);
UpgradeService.calculateCost(basePrice, level);
```

## 📝 Refactoring Patterns

### Pattern 1: Basic Scene Refactoring

**BEFORE** (old Shop.js - 517 lines):
```javascript
class Shop extends Phaser.Scene {
    create() {
        // 50 lines of background setup
        // 100 lines of header creation
        // 300 lines of upgrade button logic
        // 67 lines of navigation buttons
    }

    createUpgradeButton(x, y, upgrade) {
        // 50 lines of button creation
        // Manual cost calculation
        // Manual registry access
        // Manual particle effects
    }
}
```

**AFTER** (ShopRefactored.js - 145 lines):
```javascript
class ShopRefactored extends Phaser.Scene {
    create() {
        this.add.image(centerX, centerY, 'background');

        this.uiManager = new UIManager(this);
        this.inputManager = new InputManager(this);

        this.createHeader();
        this.createUpgradeButtons();
        this.createNavigationButtons();
    }

    createHeader() {
        this.header = this.uiManager.createHeader('SKULL SHOP');
    }

    createUpgradeButtons() {
        const configs = UpgradeService.getUpgradeConfigs(this.registry);
        // Simple button creation using UpgradeButton component
    }

    purchaseUpgrade(upgradeType, config) {
        const result = UpgradeService.purchaseUpgrade(this.registry, upgradeType, config);
        if (result.success) {
            ParticleService.createBurst(...);
            this.upgradeButtons.forEach(btn => btn.refresh());
        }
    }
}
```

**Improvements:**
- ✅ Scene reduced from 517 → 145 lines (72% reduction)
- ✅ Business logic moved to UpgradeService
- ✅ UI creation delegated to UIManager & components
- ✅ Particle effects centralized in ParticleService
- ✅ Data access through SaveDataService

### Pattern 2: Component Creation

**Creating reusable buttons:**
```javascript
// OLD WAY (repeated in every scene)
const buttonBg = this.add.graphics();
buttonBg.fillStyle(color);
buttonBg.fillRoundedRect(x-100, y-30, 200, 60, 15);
buttonBg.lineStyle(3, 0x000000);
buttonBg.strokeRoundedRect(x-100, y-30, 200, 60, 15);
buttonBg.setInteractive(...);
buttonBg.on('pointerdown', callback);
const buttonText = this.add.text(x, y, text, {...});

// NEW WAY (one line)
const button = new Button(this, x, y, 'PLAY', {
    color: 0xFF6347,
    callback: () => this.scene.start('ClickerGame')
});

// Or through UIManager
const button = this.uiManager.createButton(x, y, 'PLAY', {...});
```

### Pattern 3: Service Usage

**Data Access:**
```javascript
// OLD WAY (direct registry access everywhere)
const totalSkulls = this.registry.get('totalSkulls');
this.registry.set('totalSkulls', totalSkulls - cost);

// NEW WAY (centralized through service)
const totalSkulls = SaveDataService.getTotalSkulls(this.registry);
SaveDataService.subtractSkulls(this.registry, cost);
```

**Particle Effects:**
```javascript
// OLD WAY (manual particle creation)
for (let i = 0; i < count; i++) {
    const particle = this.add.circle(x, y, 3, color);
    const angle = (i / count) * Math.PI * 2;
    this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        duration: 800,
        onComplete: () => particle.destroy()
    });
}

// NEW WAY (one line)
ParticleService.createBurst(this, x, y, { color: 0xFF0000, count: 10 });
```

## 🔧 Refactoring Checklist

When refactoring a scene, follow these steps:

### Step 1: Setup Phase
```javascript
create() {
    // 1. Create background
    this.add.image(centerX, centerY, 'background');

    // 2. Initialize managers
    this.uiManager = new UIManager(this);
    this.inputManager = new InputManager(this);

    // 3. Call creation methods
    this.createHeader();
    this.createMainContent();
    this.createButtons();
}
```

### Step 2: Extract UI Creation
```javascript
// Use UIManager for common UI patterns
createHeader() {
    this.header = this.uiManager.createHeader('TITLE');
}

createButtons() {
    this.backButton = this.uiManager.createBackButton('MainMenu');
}
```

### Step 3: Replace Direct Registry Access
```javascript
// Replace all this.registry.get/set calls
// OLD: const skulls = this.registry.get('totalSkulls');
// NEW: const skulls = SaveDataService.getTotalSkulls(this.registry);
```

### Step 4: Replace Particle Effects
```javascript
// Replace GameUtils.createParticleEffect
// OLD: GameUtils.createParticleEffect(this, x, y, color, count);
// NEW: ParticleService.createBurst(this, x, y, { color, count });
```

### Step 5: Add Cleanup
```javascript
shutdown() {
    if (this.uiManager) this.uiManager.destroy();
    if (this.inputManager) this.inputManager.destroy();
}
```

## 📊 Migration Status

| Scene | Status | Lines Before | Lines After | Reduction |
|-------|--------|--------------|-------------|-----------|
| Boot | ✅ No changes needed | 14 | 14 | 0% |
| Preloader | ✅ No changes needed | 105 | 105 | 0% |
| MainMenu | ⏳ TODO | 270 | ? | ? |
| Settings | ⏳ TODO | 124 | ? | ? |
| **Shop** | ✅ **COMPLETE** | **517** | **145** | **72%** |
| Altar | ⏳ TODO | 879 | ? | ? |
| Lightbox | ⏳ TODO | 86 | ? | ? |
| ClickerGame | ⏳ TODO | 1957 | ? | ? |
| GameOver | ⏳ TODO | 193 | ? | ? |

## 🎓 Key Learnings

### What Changed
1. **Scene files**: Scenes are now thin orchestration layers
2. **Business logic**: Moved to services (reusable, testable)
3. **UI components**: Reusable components reduce duplication
4. **Managers**: Coordinate complex operations

### What Stayed the Same
1. **Game logic**: Core gameplay unchanged
2. **Assets**: No asset changes required
3. **Physics**: Physics behavior identical
4. **User experience**: Same game, better code

### Benefits
- 🚀 **Performance**: No impact (same runtime behavior)
- 📖 **Readability**: Scenes are much easier to understand
- 🔧 **Maintainability**: Changes isolated to single files
- ♻️ **Reusability**: Components used across scenes
- 🧪 **Testability**: Services can be unit tested
- 📈 **Scalability**: Easy to add new features

## 🔜 Next Steps

### Immediate (High Priority)
1. ✅ Refactor Shop scene (DONE)
2. ⏳ Refactor MainMenu scene (uses similar patterns to Shop)
3. ⏳ Refactor Altar scene (cards + lightbox)
4. ⏳ Refactor Settings scene (simple UI)

### Future (Lower Priority)
5. ⏳ Refactor ClickerGame scene (complex - needs GameObjectManager)
6. ⏳ Refactor GameOver scene (simple)
7. ⏳ Extract game components (Basket, Bumper, Flipper, etc.)
8. ⏳ Create DragManager for unified dragging

### Optional Enhancements
- Add TypeScript definitions for better IDE support
- Create unit tests for services
- Add JSDoc comments for better documentation
- Implement event bus for decoupled communication

## 📚 Code Examples

### Example: Refactoring MainMenu

**Current structure:**
- createUI() - 200 lines
- createButton() - 50 lines
- addFloatingAnimation() - 10 lines
- setupInputHandlers() - 20 lines

**Refactored structure:**
```javascript
class MainMenu extends Phaser.Scene {
    create() {
        this.setupBackground();
        this.uiManager = new UIManager(this);
        this.inputManager = new InputManager(this);

        this.createStatsDisplay();
        this.createInstructions();
        this.createButtons();
        this.createAutoStartUI();
    }

    createStatsDisplay() {
        const { panel, text } = this.uiManager.createSkullCountDisplay(20, 20);
        this.uiManager.addFloatingAnimation([panel, text]);
    }

    createButtons() {
        this.uiManager.createNavigationButtons([
            { x: centerX - 384, y: 650, text: 'PLAY', color: 0xFF6347, callback: () => this.scene.start('ClickerGame') },
            { x: centerX - 128, y: 650, text: 'SHOP', color: COLORS.MINT_GREEN, callback: () => this.scene.start('Shop') },
            // ...
        ]);
    }
}
```

## 🐛 Common Issues & Solutions

### Issue: "UIManager is not defined"
**Solution**: Check index.html - ensure managers are loaded before scenes

### Issue: "Cannot read property 'registry' of undefined"
**Solution**: Pass `this` correctly to services:
```javascript
// WRONG: SaveDataService.getTotalSkulls(registry)
// RIGHT:  SaveDataService.getTotalSkulls(this.registry)
```

### Issue: Components not showing
**Solution**: Ensure you call `scene.add.existing(this)` in component constructor

### Issue: Button not clickable
**Solution**: Check that interactive area is set correctly and callback is provided

## 📖 References

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Phaser 3 Examples](https://phaser.io/examples)
- [Clean Code Principles](https://github.com/ryanmcdermott/clean-code-javascript)

---

**Last Updated**: 2025-10-27
**Refactoring Progress**: 1/9 scenes completed (11%)
