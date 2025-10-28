/**
 * Shop Scene - REFACTORED VERSION
 * Demonstrates clean architecture using managers, services, and components
 */
class ShopRefactored extends Phaser.Scene {
    constructor() {
        super('Shop');
    }

    create() {
        // Setup background
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        this.add.image(centerX, GAME_CONFIG.WORLD_HEIGHT / 2, 'background');

        // Create managers
        this.uiManager = new UIManager(this);
        this.inputManager = new InputManager(this);

        // Create UI
        this.createHeader();
        this.createUpgradeButtons();
        this.createNavigationButtons();
    }

    createHeader() {
        this.header = this.uiManager.createHeader('SKULL SHOP');
    }

    createUpgradeButtons() {
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const startY = 240;
        const buttonSpacing = UI_CONFIG.SPACING.UPGRADE_BUTTON;

        // Get all upgrade configurations from service
        const upgradeConfigs = UpgradeService.getUpgradeConfigs(this.registry);

        // Organize upgrades into columns
        const leftColumn = ['maxSkull', 'basket', 'bumper', 'booster'];
        const centerColumn = ['gameTime', 'flipper', 'triangle', 'shrinker'];
        const rightColumn = ['autoStart', 'portal', 'duplicator', 'prestige'];

        this.upgradeButtons = [];

        // Create left column
        leftColumn.forEach((upgradeType, index) => {
            const config = upgradeConfigs[upgradeType];
            if (!config || (config.unlockRequirement && !config.unlockRequirement())) return;

            const x = centerX - 342;
            const y = startY + index * buttonSpacing;
            const button = new UpgradeButton(this, x, y, upgradeType, config, {
                callback: (type, cfg) => this.purchaseUpgrade(type, cfg)
            });
            this.upgradeButtons.push(button);
        });

        // Create center column
        centerColumn.forEach((upgradeType, index) => {
            const config = upgradeConfigs[upgradeType];
            if (!config || (config.unlockRequirement && !config.unlockRequirement())) return;

            const x = centerX;
            const y = startY + index * buttonSpacing;
            const button = new UpgradeButton(this, x, y, upgradeType, config, {
                callback: (type, cfg) => this.purchaseUpgrade(type, cfg)
            });
            this.upgradeButtons.push(button);
        });

        // Create right column
        rightColumn.forEach((upgradeType, index) => {
            const config = upgradeConfigs[upgradeType];
            if (!config || (config.unlockRequirement && !config.unlockRequirement())) return;

            const x = centerX + 342;
            const y = startY + index * buttonSpacing;
            const button = new UpgradeButton(this, x, y, upgradeType, config, {
                callback: (type, cfg) => this.purchaseUpgrade(type, cfg)
            });
            this.upgradeButtons.push(button);
        });
    }

    createNavigationButtons() {
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;

        // Back button (left)
        this.uiManager.createButton(centerX - 282, 670, 'BACK', {
            width: UI_CONFIG.BUTTON.SMALL.width,
            height: UI_CONFIG.BUTTON.SMALL.height,
            fontSize: UI_CONFIG.BUTTON.SMALL.fontSize,
            color: 0x0B5563,
            callback: () => this.scene.start('MainMenu')
        });

        // Play button (right)
        this.uiManager.createButton(centerX + 282, 670, 'PLAY', {
            width: UI_CONFIG.BUTTON.SMALL.width,
            height: UI_CONFIG.BUTTON.SMALL.height,
            fontSize: UI_CONFIG.BUTTON.SMALL.fontSize,
            color: 0x8B1A1A,
            callback: () => this.scene.start('ClickerGame')
        });
    }

    purchaseUpgrade(upgradeType, config) {
        const result = UpgradeService.purchaseUpgrade(this.registry, upgradeType, config);

        if (result.success) {
            // Show particle effect
            ParticleService.createBurst(this, GAME_CONFIG.WORLD_WIDTH / 2, GAME_CONFIG.WORLD_HEIGHT / 2, {
                color: COLORS.MINT_GREEN,
                count: 10
            });

            // Restart scene to show new items (like original shop)
            this.scene.restart();
        } else {
            // Show error feedback
            if (result.reason === 'insufficient_funds') {
                console.log('Not enough skulls!');
            } else if (result.reason === 'needs_placement') {
                console.log('No space available!');
            }
        }
    }

    shutdown() {
        if (this.uiManager) {
            this.uiManager.destroy();
        }
        if (this.inputManager) {
            this.inputManager.destroy();
        }
    }
}
