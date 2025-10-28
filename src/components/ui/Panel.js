/**
 * Panel Component
 * Reusable white backdrop panel with rounded corners
 */
class Panel extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y, width, height, options = {}) {
        super(scene);

        const {
            fillColor = UI_CONFIG.PANEL.FILL_COLOR,
            fillAlpha = UI_CONFIG.PANEL.FILL_ALPHA,
            borderRadius = UI_CONFIG.PANEL.BORDER_RADIUS
        } = options;

        this.panelX = x;
        this.panelY = y;
        this.panelWidth = width;
        this.panelHeight = height;
        this.fillColor = fillColor;
        this.fillAlpha = fillAlpha;
        this.borderRadius = borderRadius;

        this.draw();
        scene.add.existing(this);
    }

    draw() {
        this.clear();
        this.fillStyle(this.fillColor, this.fillAlpha);
        this.fillRoundedRect(
            this.panelX,
            this.panelY,
            this.panelWidth,
            this.panelHeight,
            this.borderRadius
        );
    }

    setPanelSize(width, height) {
        this.panelWidth = width;
        this.panelHeight = height;
        this.draw();
    }

    setPanelBounds(x, y, width, height) {
        this.panelX = x;
        this.panelY = y;
        if (width !== undefined) this.panelWidth = width;
        if (height !== undefined) this.panelHeight = height;
        this.draw();
    }

    setPanelColor(color, alpha) {
        this.fillColor = color;
        if (alpha !== undefined) {
            this.fillAlpha = alpha;
        }
        this.draw();
    }
}
