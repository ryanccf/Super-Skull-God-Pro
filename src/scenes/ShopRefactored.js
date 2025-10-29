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
        const bg = this.add.image(centerX, GAME_CONFIG.WORLD_HEIGHT / 2, 'game_background');
        bg.setOrigin(0.5, 0.5); // Explicitly center the background
        // Scale to cover the entire screen
        const scaleX = GAME_CONFIG.WORLD_WIDTH / bg.width;
        const scaleY = GAME_CONFIG.WORLD_HEIGHT / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);

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
        const buttonSpacing = UI_CONFIG.SPACING.UPGRADE_BUTTON;

        // Get all upgrade configurations from service
        const upgradeConfigs = UpgradeService.getUpgradeConfigs(this.registry);

        // Organize into two sections
        const upgradesSection = ['maxSkull', 'gameTime', 'autoStart', 'prestige'];
        const itemsSection = ['basket', 'bumper', 'flipper', 'triangle', 'booster', 'shrinker', 'portal', 'duplicator'];

        this.upgradeButtons = [];

        // Left section: Upgrades
        const leftX = centerX - 350;
        const leftSectionY = 200;

        // Create bordered panel for upgrades
        const upgradesPanelWidth = 340;
        const upgradesPanelHeight = 460;
        const upgradesPanel = this.add.graphics();
        upgradesPanel.fillStyle(0xffffff, 0.85);
        upgradesPanel.fillRoundedRect(leftX - upgradesPanelWidth/2, leftSectionY, upgradesPanelWidth, upgradesPanelHeight, 12);
        upgradesPanel.lineStyle(4, 0x000000);
        upgradesPanel.strokeRoundedRect(leftX - upgradesPanelWidth/2, leftSectionY, upgradesPanelWidth, upgradesPanelHeight, 12);

        // Section header
        this.add.text(leftX, leftSectionY + 30, 'UPGRADES', {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#000000'
        }).setOrigin(0.5);

        // Create upgrade buttons
        upgradesSection.forEach((upgradeType, index) => {
            const config = upgradeConfigs[upgradeType];
            if (!config) return;

            const x = leftX;
            const y = leftSectionY + 90 + index * buttonSpacing;
            const button = new UpgradeButton(this, x, y, upgradeType, config, {
                callback: (type, cfg) => this.purchaseUpgrade(type, cfg)
            });
            this.upgradeButtons.push(button);
        });

        // Right section: Items (50% wider)
        const rightX = centerX + 265;
        const rightSectionY = 200;

        // Create bordered panel for items (50% wider: 340 * 1.5 = 510)
        const itemsPanelWidth = 510;
        const itemsPanelHeight = 460;
        const itemsPanel = this.add.graphics();
        itemsPanel.fillStyle(0xffffff, 0.85);
        itemsPanel.fillRoundedRect(rightX - itemsPanelWidth/2, rightSectionY, itemsPanelWidth, itemsPanelHeight, 12);
        itemsPanel.lineStyle(4, 0x000000);
        itemsPanel.strokeRoundedRect(rightX - itemsPanelWidth/2, rightSectionY, itemsPanelWidth, itemsPanelHeight, 12);

        // Section header
        this.add.text(rightX, rightSectionY + 30, 'ITEMS', {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#000000'
        }).setOrigin(0.5);

        // Create item buttons (2 columns within the section)
        const itemsPerColumn = 4;
        itemsSection.forEach((upgradeType, index) => {
            const config = upgradeConfigs[upgradeType];
            if (!config) return;

            const column = Math.floor(index / itemsPerColumn);
            const row = index % itemsPerColumn;
            const x = rightX - 120 + (column * 240);
            const y = rightSectionY + 90 + row * buttonSpacing;
            const button = new UpgradeButton(this, x, y, upgradeType, config, {
                width: 200,
                callback: (type, cfg) => this.purchaseUpgrade(type, cfg)
            });
            this.upgradeButtons.push(button);
        });
    }

    createNavigationButtons() {
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;

        // Back button (left) - moved down to avoid overlap
        this.uiManager.createButton(centerX - 282, 700, 'BACK', {
            width: UI_CONFIG.BUTTON.SMALL.width,
            height: UI_CONFIG.BUTTON.SMALL.height,
            fontSize: UI_CONFIG.BUTTON.SMALL.fontSize,
            color: 0x0B5563,
            callback: () => this.scene.start('MainMenu')
        });

        // Play button (right) - moved down to avoid overlap
        this.uiManager.createButton(centerX + 282, 700, 'PLAY', {
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
