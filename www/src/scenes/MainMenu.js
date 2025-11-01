class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        this.setupBackground();

        // Check if just prestiged and show message
        const justPrestiged = this.registry.get('justPrestiged');
        if (justPrestiged) {
            this.registry.set('justPrestiged', false);
            this.showPrestigeMessage();
        }

        this.createUI();
        this.setupInputHandlers();

        // Create auto-start UI if unlocked
        if (this.registry.get('autoStartUnlocked')) {
            this.createAutoStartUI();
        }
    }

    setupBackground() {
        const bg = this.add.image(GAME_CONFIG.WORLD_WIDTH / 2, GAME_CONFIG.WORLD_HEIGHT / 2, 'main_menu_background');
        // Scale to cover the entire screen
        const scaleX = GAME_CONFIG.WORLD_WIDTH / bg.width;
        const scaleY = GAME_CONFIG.WORLD_HEIGHT / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);

        // Add small Quintuple A Games logo (adjusted position)
        const logoX = 80 + (GAME_CONFIG.WORLD_WIDTH * 0.05); // 5% from left edge
        const logoY = (GAME_CONFIG.WORLD_HEIGHT - 80) - (GAME_CONFIG.WORLD_HEIGHT * 0.09); // 9% from bottom

        const logo = this.add.image(logoX, logoY, 'quintuple_a_logo_inverted');
        logo.setOrigin(0.5);
        logo.setScale(0.27); // 10% smaller than original (was 0.3)
        logo.setDepth(5); // Behind buttons

        // Add subtle breathing animation (15% larger breathing effect)
        this.tweens.add({
            targets: logo,
            scaleX: 0.27 + (0.27 * 0.15 * 0.5), // Breathe to 15% larger
            scaleY: 0.27 + (0.27 * 0.15 * 0.5),
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createUI() {
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const totalSkulls = this.registry.get('totalSkulls');
        const highscore = this.registry.get('highscore');
        const prestigeLevel = this.registry.get('prestigeLevel') || 0;

        // Stats container matching in-game style
        const containerX = 20;
        const containerY = 20;
        const containerWidth = 300;
        const containerHeight = 170;
        const padding = 20;
        const lineHeight = 50;

        // Create backdrop matching in-game style
        const statsBackdrop = this.add.graphics();
        statsBackdrop.fillStyle(0xffffff, 0.9);
        statsBackdrop.fillRoundedRect(containerX, containerY, containerWidth, containerHeight, 12);

        // Consistent label and value styles (matching in-game)
        const labelStyle = {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#000000',
            align: 'left'
        };

        const valueStyle = {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#333333',
            align: 'right'
        };

        const labelX = containerX + padding;
        const valueX = containerX + containerWidth - padding;

        // Total Skulls
        const totalLabel = this.add.text(labelX, containerY + padding, 'Total:', labelStyle);
        const totalValue = this.add.text(valueX, containerY + padding, formatScore(totalSkulls), valueStyle).setOrigin(1, 0);

        // Best Round
        const bestLabel = this.add.text(labelX, containerY + padding + lineHeight, 'Best:', labelStyle);
        const bestValue = this.add.text(valueX, containerY + padding + lineHeight, formatScore(highscore), valueStyle).setOrigin(1, 0);

        // Prestige
        const prestigeLabel = this.add.text(labelX, containerY + padding + lineHeight * 2, 'Prestige:', labelStyle);
        const prestigeValue = this.add.text(valueX, containerY + padding + lineHeight * 2, prestigeLevel.toString(), valueStyle).setOrigin(1, 0);

        // Add breathing animation to all stats elements
        const statsElements = [statsBackdrop, totalLabel, totalValue, bestLabel, bestValue, prestigeLabel, prestigeValue];
        this.tweens.add({
            targets: statsElements,
            scaleX: 1.09,
            scaleY: 1.09,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const instructions = [
            "SUPER SKULL GOD PRO",
            "CHAMPIONSHIP EDITION",
            "",
            "How many skulls can you",
            "collect for the Skull God?",
            "",
            "Buy upgrades in the shop",
            "& collect more skulls!",
            "",
            "SKULLS FOR THE SKULL GOD!"
        ];

        // Position text in the center of the right third of the screen
        const rightThirdCenterX = GAME_CONFIG.WORLD_WIDTH * (5/6);

        // White backdrop for instructions
        const instructionBackdrop = this.add.graphics();
        instructionBackdrop.fillStyle(0xffffff, 0.9);
        instructionBackdrop.fillRoundedRect(rightThirdCenterX - 250, 200, 500, 400, 12);

        const instructionText = this.add.text(rightThirdCenterX, 400, instructions, {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);

        this.addPulseAnimation([instructionBackdrop, instructionText]);

        this.createButton(centerX - 384, 650, 'PLAY', 0xFF6347, () => this.scene.start('ClickerGame'));
        this.createButton(centerX - 128, 650, 'SHOP', COLORS.MINT_GREEN, () => this.scene.start('Shop'));
        this.createButton(centerX + 128, 650, 'ALTAR', 0x4A4A4A, () => this.scene.start('Altar'));
        this.createButton(centerX + 384, 650, 'SETTINGS', COLORS.SOFT_PINK, () => this.scene.start('Settings'));
    }

    createButton(x, y, text, color, callback) {
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(color);
        buttonBg.fillRoundedRect(x-100, y-30, 200, 60, 15);
        buttonBg.lineStyle(3, 0x000000);
        buttonBg.strokeRoundedRect(x-100, y-30, 200, 60, 15);
        buttonBg.setInteractive(new Phaser.Geom.Rectangle(x-100, y-30, 200, 60), Phaser.Geom.Rectangle.Contains);
        buttonBg.setDepth(10); // Above logo

        const buttonText = this.add.text(x, y, text, {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#000000'
        }).setOrigin(0.5);
        buttonText.setDepth(10); // Above logo

        GameUtils.addButtonEffect(buttonBg, buttonText, callback);
    }

    addFloatingAnimation(targets) {
        this.tweens.add({
            targets: targets,
            y: '+=3',
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    addPulseAnimation(target) {
        this.tweens.add({
            targets: target,
            scaleX: 1.02,
            scaleY: 1.02,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    setupInputHandlers() {
        this.input.on('pointerdown', (pointer, currentlyOver) => {
            // Resume audio context on first user interaction
            if (this.sound.context && this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
            // Removed: click anywhere to start functionality
        });

        // Add P key listener for testing
        this.input.keyboard.on('keydown-P', () => {
            const currentTotal = this.registry.get('totalSkulls');
            this.registry.set('totalSkulls', currentTotal + 100);
            this.scene.restart();
        });
    }

    createAutoStartUI() {
        // Position in bottom-right corner
        const x = GAME_CONFIG.WORLD_WIDTH - 270;
        const y = GAME_CONFIG.WORLD_HEIGHT - 100;
        this.autoStartUI = new AutoStartUI(this, x, y);
    }

    update() {
        // Update Auto-Start UI countdown
        if (this.autoStartUI) {
            this.autoStartUI.update();
        }
    }

    showPrestigeMessage() {
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const centerY = GAME_CONFIG.WORLD_HEIGHT / 2;

        // Create big gold "PRESTIGE!" text
        const prestigeText = this.add.text(centerX, centerY, 'PRESTIGE!', {
            fontFamily: 'Arial Black',
            fontSize: 120,
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 12
        }).setOrigin(0.5).setDepth(1000);

        // Pulse animation
        this.tweens.add({
            targets: prestigeText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            repeat: 3
        });

        // Fade out after 3 seconds
        this.tweens.add({
            targets: prestigeText,
            alpha: 0,
            duration: 1000,
            delay: 2500,
            onComplete: () => {
                prestigeText.destroy();
            }
        });

        // Particle burst
        GameUtils.createParticleEffect(this, centerX, centerY, 0xFFD700, 30);
    }

    shutdown() {
        this.pauseAutoStartTimer();
    }
}