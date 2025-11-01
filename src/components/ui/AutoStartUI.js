class AutoStartUI {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        // UI elements
        this.backdrop = null;
        this.checkbox = null;
        this.checkmark = null;
        this.label = null;
        this.timerText = null;
        this.timer = null;

        this.create();
    }

    create() {
        const checkboxSize = 48; // 2x size
        const backdropWidth = 240;
        const backdropHeight = 70;

        // White backdrop
        this.backdrop = this.scene.add.graphics();
        this.backdrop.fillStyle(0xffffff, 0.9);
        this.backdrop.fillRoundedRect(this.x, this.y, backdropWidth, backdropHeight, 12);
        this.backdrop.setDepth(1);

        // Checkbox background
        this.checkbox = this.scene.add.graphics();
        this.checkbox.fillStyle(0xffffff);
        this.checkbox.fillRect(this.x + 10, this.y + 11, checkboxSize, checkboxSize);
        this.checkbox.lineStyle(3, 0x000000);
        this.checkbox.strokeRect(this.x + 10, this.y + 11, checkboxSize, checkboxSize);
        this.checkbox.setDepth(2);

        // Checkmark (if enabled)
        this.checkmark = this.scene.add.graphics();
        this.checkmark.setDepth(3);
        this.updateCheckmark();

        // Label (matching other labels: Arial Black, 28px)
        this.label = this.scene.add.text(this.x + 70, this.y + 35, 'Auto-Start', {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#000000'
        }).setOrigin(0, 0.5).setDepth(2);

        // Timer text (appears when counting down)
        this.timerText = this.scene.add.text(this.x + backdropWidth / 2, this.y + backdropHeight - 10, '', {
            fontFamily: 'Arial Black',
            fontSize: 18,
            color: '#000000'
        }).setOrigin(0.5, 1).setDepth(2);

        // Make checkbox interactive
        const hitArea = new Phaser.Geom.Rectangle(this.x, this.y, backdropWidth, backdropHeight);
        this.checkbox.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
        this.checkbox.on('pointerdown', () => this.toggle());

        // Start timer if enabled
        if (this.scene.scene.key === 'MainMenu') {
            this.resumeTimer();
        }
    }

    updateCheckmark() {
        if (!this.checkmark) return;

        this.checkmark.clear();

        if (this.scene.registry.get('autoStartEnabled')) {
            const checkboxSize = 48;
            const checkboxX = this.x + 10;
            const checkboxY = this.y + 11;

            // Draw checkmark (scaled up)
            this.checkmark.lineStyle(5, 0x000000);
            this.checkmark.beginPath();
            this.checkmark.moveTo(checkboxX + 10, checkboxY + 24);
            this.checkmark.lineTo(checkboxX + 20, checkboxY + 34);
            this.checkmark.lineTo(checkboxX + 38, checkboxY + 14);
            this.checkmark.strokePath();
        }
    }

    toggle() {
        const current = this.scene.registry.get('autoStartEnabled');
        this.scene.registry.set('autoStartEnabled', !current);
        this.updateCheckmark();

        // Only MainMenu scene handles the timer
        if (this.scene.scene.key === 'MainMenu') {
            if (!current) {
                this.resumeTimer();
            } else {
                this.stopTimer();
            }
        }
    }

    resumeTimer() {
        if (!this.scene.registry.get('autoStartEnabled')) return;

        const autoStartLevel = this.scene.registry.get('autoStartLevel');
        const maxDelay = Math.max(1, 10 - autoStartLevel);
        let remainingTime = this.scene.registry.get('autoStartRemainingTime');

        // If timer hasn't started yet, initialize it
        if (remainingTime <= 0) {
            remainingTime = maxDelay;
            this.scene.registry.set('autoStartRemainingTime', remainingTime);
        }

        // Create countdown timer
        this.timer = this.scene.time.addEvent({
            delay: remainingTime * 1000,
            callback: () => this.autoStartGame(),
            callbackScope: this
        });
    }

    stopTimer() {
        if (this.timer) {
            const remaining = this.timer.getRemainingSeconds();
            this.scene.registry.set('autoStartRemainingTime', Math.max(0, remaining));
            this.timer.remove();
            this.timer = null;
        }
    }

    pauseTimer() {
        this.stopTimer();
    }

    autoStartGame() {
        if (!this.scene.registry.get('autoStartEnabled')) return;

        // Reset timer for next cycle
        this.scene.registry.set('autoStartRemainingTime', 0);

        this.scene.scene.start('ClickerGame');
    }

    update() {
        if (this.scene.registry.get('autoStartEnabled') && this.timer && this.timerText) {
            const remaining = Math.ceil(this.timer.getRemainingSeconds());
            this.timerText.setText(`${remaining}s`);
        } else if (this.timerText) {
            this.timerText.setText('');
        }
    }

    destroy() {
        if (this.timer) {
            this.timer.remove();
            this.timer = null;
        }
        if (this.backdrop) this.backdrop.destroy();
        if (this.checkbox) this.checkbox.destroy();
        if (this.checkmark) this.checkmark.destroy();
        if (this.label) this.label.destroy();
        if (this.timerText) this.timerText.destroy();
    }
}
