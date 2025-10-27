class Lightbox extends Phaser.Scene {
    constructor() {
        super('Lightbox');
    }

    init(data) {
        this.itemName = data.itemName;
        this.parentScene = data.parentScene || 'Altar';

        // Clear any existing content when re-initializing
        if (this.scene.isActive()) {
            this.children.removeAll(true);
        }
    }

    create() {
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const centerY = GAME_CONFIG.WORLD_HEIGHT / 2;

        // Validate that we have an item name
        if (!this.itemName) {
            console.error('Lightbox: No item name provided');
            this.close();
            return;
        }

        // Semi-transparent black overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.9);
        overlay.fillRect(0, 0, GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.WORLD_HEIGHT);
        overlay.setDepth(1000);

        // Display full-size image
        const image = this.add.image(centerX, centerY, this.itemName);
        image.setDepth(1001);

        // Scale image to fit screen while maintaining aspect ratio
        const maxWidth = GAME_CONFIG.WORLD_WIDTH * 0.8;
        const maxHeight = GAME_CONFIG.WORLD_HEIGHT * 0.8;
        const scaleX = maxWidth / image.width;
        const scaleY = maxHeight / image.height;
        const scale = Math.min(scaleX, scaleY);
        image.setScale(scale);

        // White backdrop for item name
        const nameBackdrop = this.add.graphics();
        nameBackdrop.fillStyle(0xffffff, 0.9);
        nameBackdrop.fillRoundedRect(centerX - 300, 20, 600, 60, 12);
        nameBackdrop.setDepth(1002);

        // Add item name text
        const nameText = this.add.text(centerX, 50, this.itemName, {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#000000'
        }).setOrigin(0.5);
        nameText.setDepth(1003);

        // White backdrop for close instruction
        const closeBackdrop = this.add.graphics();
        closeBackdrop.fillStyle(0xffffff, 0.9);
        closeBackdrop.fillRoundedRect(centerX - 200, GAME_CONFIG.WORLD_HEIGHT - 70, 400, 40, 12);
        closeBackdrop.setDepth(1002);

        // Add close instruction
        const closeText = this.add.text(centerX, GAME_CONFIG.WORLD_HEIGHT - 50, 'Click anywhere to close', {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#000000'
        }).setOrigin(0.5);
        closeText.setDepth(1003);

        // Make overlay clickable to close
        overlay.setInteractive(new Phaser.Geom.Rectangle(0, 0, GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.WORLD_HEIGHT), Phaser.Geom.Rectangle.Contains);
        overlay.on('pointerdown', () => this.close());

        // ESC key to close
        this.input.keyboard.once('keydown-ESC', () => this.close());
    }

    close() {
        // Resume the parent scene and sleep this one (don't stop - keeps it ready for reuse)
        this.scene.resume(this.parentScene);
        this.scene.sleep();
    }
}
