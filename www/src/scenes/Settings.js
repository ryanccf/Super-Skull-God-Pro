class Settings extends Phaser.Scene {
    constructor() {
        super('Settings');
    }

    create() {
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const centerY = GAME_CONFIG.WORLD_HEIGHT / 2;

        this.add.image(centerX, centerY, 'background');

        // White backdrop for title
        const titleBackdrop = this.add.graphics();
        titleBackdrop.fillStyle(0xffffff, 0.9);
        titleBackdrop.fillRoundedRect(centerX - 200, 160, 400, 80, 12);

        this.add.text(centerX, 200, 'SETTINGS', {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#000000'
        }).setOrigin(0.5);

        this.createMuteButtons(centerX);
        this.createResetButton(centerX);
        this.createBackButton(centerX);
        this.setupInput();
    }

    setupInput() {
        // Add P key listener for testing
        this.input.keyboard.on('keydown-P', () => {
            const currentTotal = this.registry.get('totalSkulls');
            this.registry.set('totalSkulls', currentTotal + 100);
            this.scene.restart();
        });
    }

    createMuteButtons(centerX) {
        const buttonWidth = 300;
        const buttonHeight = 60;
        const buttonSpacing = 80;
        const startY = 280;

        // Mute Volume button
        this.createMuteButton(centerX, startY, buttonWidth, buttonHeight, 'MUTE VOLUME', 0x4A90E2);

        // Mute Music button
        this.createMuteButton(centerX, startY + buttonSpacing, buttonWidth, buttonHeight, 'MUTE MUSIC', 0x50C878);

        // Mute SFX button
        this.createMuteButton(centerX, startY + buttonSpacing * 2, buttonWidth, buttonHeight, 'MUTE SFX', 0xF4A460);
    }

    createMuteButton(centerX, y, width, height, label, color) {
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(color);
        buttonBg.fillRoundedRect(centerX - width/2, y - height/2, width, height, 10);
        buttonBg.lineStyle(3, 0x000000);
        buttonBg.strokeRoundedRect(centerX - width/2, y - height/2, width, height, 10);
        buttonBg.setInteractive(new Phaser.Geom.Rectangle(centerX - width/2, y - height/2, width, height), Phaser.Geom.Rectangle.Contains);

        this.add.text(centerX, y, label, {
            fontFamily: 'Arial Black',
            fontSize: 22,
            color: '#000000'
        }).setOrigin(0.5);

        // Placeholder function - does nothing for now
        buttonBg.on('pointerdown', () => {
            console.log(`${label} clicked (not implemented yet)`);
        });
    }

    createResetButton(centerX) {
        const resetButtonBg = this.add.graphics();
        resetButtonBg.fillStyle(0xCC0000);
        resetButtonBg.fillRoundedRect(centerX - 150, 520, 300, 80, 10);
        resetButtonBg.lineStyle(3, 0x000000);
        resetButtonBg.strokeRoundedRect(centerX - 150, 520, 300, 80, 10);
        resetButtonBg.setInteractive(new Phaser.Geom.Rectangle(centerX - 150, 520, 300, 80), Phaser.Geom.Rectangle.Contains);

        this.add.text(centerX, 560, 'RESET EVERYTHING', {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#000000'
        }).setOrigin(0.5);

        // White backdrop for warning
        const warningBackdrop = this.add.graphics();
        warningBackdrop.fillStyle(0xffffff, 0.9);
        warningBackdrop.fillRoundedRect(centerX - 300, 620, 600, 40, 12);

        this.add.text(centerX, 640, 'Warning: This will reset all your progress!', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#000000'
        }).setOrigin(0.5);

        resetButtonBg.on('pointerdown', () => this.resetGame());
    }

    createBackButton(centerX) {
        const backButtonBg = this.add.graphics();
        backButtonBg.fillStyle(COLORS.ROYAL_BLUE);
        backButtonBg.fillRoundedRect(centerX - 100, 690, 200, 60, 10);
        backButtonBg.lineStyle(3, 0x000000);
        backButtonBg.strokeRoundedRect(centerX - 100, 690, 200, 60, 10);
        backButtonBg.setInteractive(new Phaser.Geom.Rectangle(centerX - 100, 690, 200, 60), Phaser.Geom.Rectangle.Contains);

        this.add.text(centerX, 720, 'BACK', {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#000000'
        }).setOrigin(0.5);

        backButtonBg.on('pointerdown', () => this.scene.start('MainMenu'));
    }

    resetGame() {
        Object.keys(DEFAULT_SAVE_DATA).forEach(key => {
            this.registry.set(key, DEFAULT_SAVE_DATA[key]);
        });
        this.scene.start('MainMenu');
    }
}