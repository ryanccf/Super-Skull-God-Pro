/**
 * Button Component
 * Reusable button with graphics background and text
 */
class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, options = {}) {
        super(scene, x, y);

        const {
            width = UI_CONFIG.BUTTON.MEDIUM.width,
            height = UI_CONFIG.BUTTON.MEDIUM.height,
            fontSize = UI_CONFIG.BUTTON.MEDIUM.fontSize,
            color = 0xFF6347,
            textColor = '#000000',
            callback = null,
            enabled = true
        } = options;

        this.buttonWidth = width;
        this.buttonHeight = height;
        this.buttonColor = color;
        this.textColor = textColor;
        this.callback = callback;
        this.isEnabled = enabled;

        // Create button background
        this.bg = scene.add.graphics();
        this.updateBackground();
        this.add(this.bg);

        // Create button text
        this.text = scene.add.text(0, 0, text, {
            fontFamily: 'Arial Black',
            fontSize: fontSize,
            color: textColor
        }).setOrigin(0.5);
        this.add(this.text);

        // Set up interactivity
        if (this.isEnabled) {
            this.enableInteractivity();
        }

        scene.add.existing(this);
    }

    updateBackground() {
        this.bg.clear();
        this.bg.fillStyle(this.buttonColor);
        this.bg.fillRoundedRect(
            -this.buttonWidth / 2,
            -this.buttonHeight / 2,
            this.buttonWidth,
            this.buttonHeight,
            15
        );
        this.bg.lineStyle(3, 0x000000);
        this.bg.strokeRoundedRect(
            -this.buttonWidth / 2,
            -this.buttonHeight / 2,
            this.buttonWidth,
            this.buttonHeight,
            15
        );
    }

    enableInteractivity() {
        const hitArea = new Phaser.Geom.Rectangle(
            -this.buttonWidth / 2,
            -this.buttonHeight / 2,
            this.buttonWidth,
            this.buttonHeight
        );
        this.bg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        this.bg.on('pointerover', () => {
            this.bg.setAlpha(0.8);
        });

        this.bg.on('pointerout', () => {
            this.bg.setAlpha(1);
        });

        if (this.callback) {
            this.bg.on('pointerdown', () => {
                if (this.isEnabled) {
                    this.callback();
                }
            });
        }

        this.isEnabled = true;
    }

    disableInteractivity() {
        this.bg.disableInteractive();
        this.bg.removeAllListeners();
        this.text.setAlpha(0.5);
        this.isEnabled = false;
    }

    setText(newText) {
        this.text.setText(newText);
    }

    setEnabled(enabled) {
        if (enabled && !this.isEnabled) {
            this.text.setAlpha(1);
            this.enableInteractivity();
        } else if (!enabled && this.isEnabled) {
            this.disableInteractivity();
        }
    }

    setColor(color) {
        this.buttonColor = color;
        this.updateBackground();
    }
}
