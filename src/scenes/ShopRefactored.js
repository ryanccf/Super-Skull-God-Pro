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
        const bg = this.add.image(centerX, GAME_CONFIG.WORLD_HEIGHT / 2, 'shop_background');
        bg.setOrigin(0.5, 0.5); // Explicitly center the background
        // Scale to cover the entire screen
        const scaleX = GAME_CONFIG.WORLD_WIDTH / bg.width;
        const scaleY = GAME_CONFIG.WORLD_HEIGHT / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);

        // Add color changing overlay
        this.colorOverlay = createColorOverlay(this);

        // Create managers
        this.uiManager = new UIManager(this);
        this.inputManager = new InputManager(this);

        // Create UI
        this.createHeader();
        this.createUpgradeButtons();
        this.createNavigationButtons();
    }

    shutdown() {
        // Cleanup color overlay
        if (this.colorOverlay) {
            this.colorOverlay.destroy();
            this.colorOverlay = null;
        }
    }

    createHeader() {
        this.header = this.uiManager.createHeader('SKULL SHOP');

        // Move header up and left by 2%
        const offsetX = GAME_CONFIG.WORLD_WIDTH * 0.02;
        const offsetY = GAME_CONFIG.WORLD_HEIGHT * 0.02;
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;

        // Adjust header backdrop position
        this.header.backdrop.setPanelBounds(
            centerX - 350 - offsetX,
            30 - offsetY,
            700,
            150
        );

        // Adjust text positions
        this.header.titleText.setPosition(centerX - offsetX, 60 - offsetY);
        this.header.skullsText.setPosition(centerX - offsetX, 120 - offsetY);
        this.header.statsText.setPosition(centerX - offsetX, 160 - offsetY);

        // Add breathing animation to header elements
        this.tweens.add({
            targets: [this.header.backdrop, this.header.titleText, this.header.skullsText, this.header.statsText],
            scaleX: 1.03,
            scaleY: 1.03,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
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

        // Offset boxes up and left by 2%
        const offsetX = GAME_CONFIG.WORLD_WIDTH * 0.02;
        const offsetY = GAME_CONFIG.WORLD_HEIGHT * 0.02;

        // Left section: Upgrades
        const leftX = centerX - 350 - offsetX;
        const leftSectionY = 200 - offsetY;

        // Create panel for upgrades (no border)
        const upgradesPanelWidth = 340;
        const upgradesPanelHeight = 460;
        const upgradesPanel = this.add.graphics();
        upgradesPanel.fillStyle(0xffffff, 0.9);
        upgradesPanel.fillRoundedRect(leftX - upgradesPanelWidth/2, leftSectionY, upgradesPanelWidth, upgradesPanelHeight, 12);

        // Section header
        const upgradesHeader = this.add.text(leftX, leftSectionY + 30, 'UPGRADES', {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#000000'
        }).setOrigin(0.5);

        // Add breathing animation
        this.tweens.add({
            targets: [upgradesPanel, upgradesHeader],
            scaleX: 1.03,
            scaleY: 1.03,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

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
        const rightX = centerX + 265 - offsetX;
        const rightSectionY = 200 - offsetY;

        // Create panel for items (50% wider: 340 * 1.5 = 510, no border)
        const itemsPanelWidth = 510;
        const itemsPanelHeight = 460;
        const itemsPanel = this.add.graphics();
        itemsPanel.fillStyle(0xffffff, 0.9);
        itemsPanel.fillRoundedRect(rightX - itemsPanelWidth/2, rightSectionY, itemsPanelWidth, itemsPanelHeight, 12);

        // Section header
        const itemsHeader = this.add.text(rightX, rightSectionY + 30, 'ITEMS', {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#000000'
        }).setOrigin(0.5);

        // Add breathing animation
        this.tweens.add({
            targets: [itemsPanel, itemsHeader],
            scaleX: 1.03,
            scaleY: 1.03,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

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

            // Check if prestiged - go to MainMenu instead of restarting
            if (upgradeType === 'prestige') {
                this.scene.start('MainMenu');
            } else {
                // Update header and all buttons without restarting (preserves animations)
                this.updateUI();
            }
        } else {
            // Show error feedback
            if (result.reason === 'insufficient_funds') {
                console.log('Not enough skulls!');
            } else if (result.reason === 'needs_placement') {
                console.log('No space available!');
            }
        }
    }

    updateUI() {
        // Update header
        if (this.header) {
            const totalSkulls = this.registry.get('totalSkulls');
            const skullsPerSecond = this.registry.get('skullsPerSecond') || 0;
            this.header.skullsText.setText(`Skulls: ${formatScore(totalSkulls)}`);
            this.header.statsText.setText(`Per Second: ${formatScore(skullsPerSecond)}`);
        }

        // Update all upgrade buttons
        if (this.upgradeButtons) {
            this.upgradeButtons.forEach(button => {
                button.refresh();
            });
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
