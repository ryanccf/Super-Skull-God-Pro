/**
 * UIManager
 * Manages UI elements like score display, timer, and HUD
 */
class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.panels = [];
        this.texts = [];
        this.buttons = [];
    }

    /**
     * Create a panel with automatic tracking
     */
    createPanel(x, y, width, height, options = {}) {
        const panel = new Panel(this.scene, x, y, width, height, options);
        this.panels.push(panel);
        return panel;
    }

    /**
     * Create a button with automatic tracking
     */
    createButton(x, y, text, options = {}) {
        const button = new Button(this.scene, x, y, text, options);
        this.buttons.push(button);
        return button;
    }

    /**
     * Create text with standard styling
     */
    createText(x, y, text, style = 'BODY') {
        const textStyle = UI_CONFIG.TEXT_STYLE[style] || UI_CONFIG.TEXT_STYLE.BODY;
        const textObj = this.scene.add.text(x, y, text, textStyle);
        this.texts.push(textObj);
        return textObj;
    }

    /**
     * Create a skull count display panel
     */
    createSkullCountDisplay(x, y) {
        const totalSkulls = SaveDataService.getTotalSkulls(this.scene.registry);
        const panel = this.createPanel(x, y, 460, 60);
        const text = this.createText(x + 428, y + 12, `Total Skulls: ${totalSkulls}`, 'TITLE');
        text.setOrigin(1, 0);

        return { panel, text };
    }

    /**
     * Create a header with title and skull count
     */
    createHeader(title) {
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const totalSkulls = SaveDataService.getTotalSkulls(this.scene.registry);
        const maxSkulls = SaveDataService.getMaxSkulls(this.scene.registry);
        const gameTime = SaveDataService.getGameTime(this.scene.registry);

        const backdrop = this.createPanel(centerX - 350, 30, 700, 150);

        const titleText = this.createText(centerX, 60, title, 'HEADER');
        titleText.setOrigin(0.5);

        const skullsText = this.createText(centerX, 120, `Your Skulls: ${totalSkulls}`, 'BODY');
        skullsText.setOrigin(0.5);

        const statsText = this.createText(centerX, 160, `Max Skulls: ${maxSkulls} | Game Time: ${gameTime}s`, 'BODY');
        statsText.setOrigin(0.5);

        return { backdrop, titleText, skullsText, statsText };
    }

    /**
     * Create navigation buttons (Play, Shop, Altar, Settings)
     */
    createNavigationButtons(buttonConfigs) {
        const buttons = [];
        buttonConfigs.forEach(config => {
            const button = this.createButton(config.x, config.y, config.text, {
                color: config.color,
                callback: config.callback
            });
            buttons.push(button);
        });
        return buttons;
    }

    /**
     * Create a back button
     */
    createBackButton(targetScene = 'MainMenu') {
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const buttonY = GAME_CONFIG.WORLD_HEIGHT - 68;

        return this.createButton(centerX, buttonY, 'BACK', {
            width: UI_CONFIG.BUTTON.SMALL.width,
            height: UI_CONFIG.BUTTON.SMALL.height,
            fontSize: UI_CONFIG.BUTTON.SMALL.fontSize,
            color: 0x0B5563,
            callback: () => this.scene.scene.start(targetScene)
        });
    }

    /**
     * Update skull count display
     */
    updateSkullCount(textElement) {
        const totalSkulls = SaveDataService.getTotalSkulls(this.scene.registry);
        textElement.setText(`Total Skulls: ${totalSkulls}`);
    }

    /**
     * Add floating animation to elements
     */
    addFloatingAnimation(targets) {
        this.scene.tweens.add({
            targets: targets,
            y: '+=3',
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    /**
     * Add pulse animation to elements
     */
    addPulseAnimation(targets) {
        this.scene.tweens.add({
            targets: targets,
            scaleX: 1.02,
            scaleY: 1.02,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    /**
     * Destroy all managed UI elements
     */
    destroy() {
        this.panels.forEach(panel => panel.destroy());
        this.texts.forEach(text => text.destroy());
        this.buttons.forEach(button => button.destroy());
        this.panels = [];
        this.texts = [];
        this.buttons = [];
    }
}
