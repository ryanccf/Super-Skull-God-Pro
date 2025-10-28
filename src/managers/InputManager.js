/**
 * InputManager
 * Handles keyboard and pointer input for the game
 */
class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.setupKeyboardInput();
        this.setupPointerInput();
    }

    setupKeyboardInput() {
        // Space bar for flipper activation
        this.spaceKey = this.scene.input.keyboard.addKey('SPACE');

        // ESC key (generic - scenes can override)
        this.escKey = this.scene.input.keyboard.addKey('ESC');

        // P key for debug/testing (add skulls)
        this.pKey = this.scene.input.keyboard.addKey('P');
        this.pKey.on('down', () => {
            if (this.scene.scene.key !== 'ClickerGame') {
                const current = SaveDataService.getTotalSkulls(this.scene.registry);
                SaveDataService.setTotalSkulls(this.scene.registry, current + 100);
                this.scene.scene.restart();
            }
        });
    }

    setupPointerInput() {
        // Global pointer down handler
        this.scene.input.on('pointerdown', (pointer) => {
            this.scene.events.emit('pointer-down', pointer);
        });

        // Global pointer up handler
        this.scene.input.on('pointerup', (pointer) => {
            this.scene.events.emit('pointer-up', pointer);
        });

        // Resume audio context on first interaction
        this.scene.input.once('pointerdown', () => {
            if (this.scene.sound.context && this.scene.sound.context.state === 'suspended') {
                this.scene.sound.context.resume();
            }
        });
    }

    /**
     * Check if space key was just pressed
     */
    isSpaceJustPressed() {
        return Phaser.Input.Keyboard.JustDown(this.spaceKey);
    }

    /**
     * Check if ESC key was just pressed
     */
    isEscJustPressed() {
        return Phaser.Input.Keyboard.JustDown(this.escKey);
    }

    /**
     * Check if pointer is within play area
     */
    isInPlayArea(pointer) {
        return pointer.x >= 0 &&
               pointer.x <= GAME_CONFIG.PLAY_AREA_WIDTH &&
               pointer.y >= 0 &&
               pointer.y <= GAME_CONFIG.WORLD_HEIGHT;
    }

    /**
     * Get pointer position clamped to play area
     */
    getClampedPointerPosition(pointer) {
        return {
            x: Phaser.Math.Clamp(pointer.x, 0, GAME_CONFIG.PLAY_AREA_WIDTH),
            y: Phaser.Math.Clamp(pointer.y, 0, GAME_CONFIG.WORLD_HEIGHT)
        };
    }

    destroy() {
        this.scene.input.off('pointerdown');
        this.scene.input.off('pointerup');
    }
}
