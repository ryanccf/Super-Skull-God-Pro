/**
 * UpgradeButton Component
 * Specialized button for shop upgrades with cost, level, and status display
 */
class UpgradeButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, upgradeType, config, options = {}) {
        super(scene, x, y);

        this.upgradeType = upgradeType;
        this.config = config;
        this.registry = scene.registry;

        const {
            width = 300,
            height = 80,
            callback = null
        } = options;

        this.buttonWidth = width;
        this.buttonHeight = height;
        this.callback = callback;

        this.createBackground();
        this.createText();
        this.updateDisplay();
        this.setupInteractivity();

        scene.add.existing(this);
    }

    createBackground() {
        this.bg = this.scene.add.graphics();
        this.add(this.bg);
    }

    createText() {
        // Title
        this.titleText = this.scene.add.text(0, -20, this.config.name, {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#000000'
        }).setOrigin(0.5);
        this.add(this.titleText);

        // Cost / Status
        this.costText = this.scene.add.text(0, 5, '', {
            fontFamily: 'Arial Black',
            fontSize: 18,
            color: '#000000'
        }).setOrigin(0.5);
        this.add(this.costText);

        // Value / Level
        this.valueText = this.scene.add.text(0, 25, '', {
            fontFamily: 'Arial',
            fontSize: 16,
            color: '#000000'
        }).setOrigin(0.5);
        this.add(this.valueText);
    }

    updateDisplay() {
        // Determine button state
        const canPurchase = UpgradeService.canPurchaseUpgrade(this.registry, this.config, this.upgradeType);

        // Special cost calculation for auto-start
        let cost;
        if (this.upgradeType === 'autoStart') {
            const unlocked = SaveDataService.getAutoStartUnlocked(this.registry);
            cost = unlocked ? 200 : 100;
        } else {
            const multiplier = this.config.multiplier || 1.6;
            cost = UpgradeService.calculateCost(this.config.basePrice, this.config.level, multiplier);
        }

        const isMaxLevel = this.config.maxLevel && this.config.level >= this.config.maxLevel;
        const needsPlacement = this.config.needsPlacement &&
                              this.config.canPurchase &&
                              !this.config.canPurchase(this.registry);

        // Update title text - show "Buy [Name] #[number]" or just upgrade name
        if (this.upgradeType === 'autoStart') {
            const unlocked = SaveDataService.getAutoStartUnlocked(this.registry);
            if (!unlocked) {
                this.titleText.setText('Unlock Auto-Start');
            } else if (isMaxLevel) {
                this.titleText.setText('Auto-Start (MAX)');
            } else {
                const delay = Math.max(1, 10 - this.config.level);
                this.titleText.setText(`Auto-Start -1s`);
            }
        } else if (this.config.needsPlacement && !isMaxLevel) {
            const nextNumber = this.config.level + 1;
            this.titleText.setText(`Buy ${this.config.name} #${nextNumber}`);
        } else if (isMaxLevel) {
            this.titleText.setText(`${this.config.name} (MAX)`);
        } else {
            this.titleText.setText(this.config.name);
        }

        // Update background color
        let bgColor;
        if (isMaxLevel) {
            bgColor = 0x444444; // Gray for max level
        } else if (needsPlacement) {
            bgColor = 0xFFA500; // Orange for needs placement
        } else if (canPurchase) {
            bgColor = COLORS.MINT_GREEN; // Green for can afford
        } else {
            bgColor = 0xCC6666; // Red for can't afford
        }

        this.bg.clear();
        this.bg.fillStyle(bgColor);
        this.bg.fillRoundedRect(
            -this.buttonWidth / 2,
            -this.buttonHeight / 2,
            this.buttonWidth,
            this.buttonHeight,
            12
        );
        this.bg.lineStyle(3, 0x000000);
        this.bg.strokeRoundedRect(
            -this.buttonWidth / 2,
            -this.buttonHeight / 2,
            this.buttonWidth,
            this.buttonHeight,
            12
        );

        // Update cost text - always show cost
        if (isMaxLevel) {
            this.costText.setText('MAX LEVEL');
        } else {
            this.costText.setText(`${cost} Skulls`);
        }

        // Hide value text (not needed)
        this.valueText.setText('');

        this.isEnabled = canPurchase && !isMaxLevel && !needsPlacement;
    }

    setupInteractivity() {
        const hitArea = new Phaser.Geom.Rectangle(
            -this.buttonWidth / 2,
            -this.buttonHeight / 2,
            this.buttonWidth,
            this.buttonHeight
        );
        this.bg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        this.bg.on('pointerover', () => {
            if (this.isEnabled) {
                this.bg.setAlpha(0.8);
            }
        });

        this.bg.on('pointerout', () => {
            this.bg.setAlpha(1);
        });

        this.bg.on('pointerdown', () => {
            if (this.isEnabled && this.callback) {
                this.callback(this.upgradeType, this.config);
            }
        });
    }

    refresh() {
        // Refresh config from service
        const allConfigs = UpgradeService.getUpgradeConfigs(this.registry);
        this.config = allConfigs[this.upgradeType];
        this.updateDisplay();
    }
}
