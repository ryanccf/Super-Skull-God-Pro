class FlipperManipulator {
    constructor(scene, flipper) {
        this.scene = scene;
        this.flipper = flipper;
        this.isActive = false;

        // Create UI elements
        this.outline = null;
        this.rotationHandle = null;
        this.flipButton = null;

        this.createUI();
    }

    createUI() {
        // Red outline with 10% opacity
        this.outline = this.scene.add.graphics();
        this.outline.setDepth(100);
        this.outline.setVisible(false);

        // Rotation handle - draggable circle at edge of flipper
        this.rotationHandle = this.scene.add.circle(0, 0, 36, 0x00FF00, 0.8);
        this.rotationHandle.setStrokeStyle(4, 0xFFFFFF);
        this.rotationHandle.setDepth(101);
        this.rotationHandle.setVisible(false);
        this.rotationHandle.setInteractive({ draggable: true });

        // Rotation icon (circular arrows)
        this.rotationIcon = this.scene.add.graphics();
        this.rotationIcon.setDepth(102);
        this.rotationIcon.setVisible(false);

        // Flip button - icon to mirror the flipper
        this.flipButton = this.scene.add.circle(0, 0, 36, 0x0088FF, 0.8);
        this.flipButton.setStrokeStyle(4, 0xFFFFFF);
        this.flipButton.setDepth(101);
        this.flipButton.setVisible(false);
        this.flipButton.setInteractive();

        // Flip icon (horizontal arrows)
        this.flipIcon = this.scene.add.graphics();
        this.flipIcon.setDepth(102);
        this.flipIcon.setVisible(false);

        this.setupHandlers();
    }

    setupHandlers() {
        // Rotation handle drag
        this.rotationHandle.on('drag', (pointer, dragX, dragY) => {
            // CRITICAL: Stop processing if game is over or body doesn't exist
            if (this.scene.isGameOver || !this.flipper.body) return;

            const angle = Phaser.Math.Angle.Between(
                this.flipper.x,
                this.flipper.y,
                dragX,
                dragY
            );

            // Update Matter body angle directly
            this.scene.matter.body.setAngle(this.flipper.body, angle);
            // Sync sprite rotation to match body
            this.flipper.rotation = angle;
            this.flipper.baseAngle = Phaser.Math.RadToDeg(angle); // Update base angle

            this.updateUI();

            // Update saved position angle
            const flipperPositions = this.scene.registry.get('flippers');
            const index = this.scene.flipperSprites.indexOf(this.flipper);
            if (index !== -1 && flipperPositions[index]) {
                flipperPositions[index].angle = this.flipper.baseAngle;
                this.scene.registry.set('flippers', flipperPositions);
            }
        });

        // Flip button click
        this.flipButton.on('pointerdown', (pointer) => {
            // CRITICAL: Stop processing if game is over
            if (this.scene.isGameOver) return;
            pointer.event.stopPropagation();
            this.flipFlipper();
        });

        // Prevent rotation handle from triggering deselection
        this.rotationHandle.on('pointerdown', (pointer) => {
            pointer.event.stopPropagation();
        });
    }

    flipFlipper() {
        // Mirror horizontally - setScale updates both sprite and Matter body
        this.flipper.setScale(this.flipper.scaleX * -1, 1);
        this.flipper.baseScaleX = this.flipper.scaleX; // Update base scale

        // Toggle facingLeft property
        this.flipper.facingLeft = !this.flipper.facingLeft;

        // Flip the angle to the opposite side (mirror the rotation)
        this.flipper.baseAngle = -this.flipper.baseAngle;

        // Update Matter body angle directly
        if (this.flipper.body) {
            const newAngle = Phaser.Math.DegToRad(this.flipper.baseAngle);
            this.scene.matter.body.setAngle(this.flipper.body, newAngle);
            // Sync sprite rotation to match body
            this.flipper.rotation = newAngle;
        }

        // Update saved position
        const flipperPositions = this.scene.registry.get('flippers');
        const index = this.scene.flipperSprites.indexOf(this.flipper);
        if (index !== -1 && flipperPositions[index]) {
            flipperPositions[index].facingLeft = this.flipper.facingLeft;
            flipperPositions[index].scaleX = this.flipper.scaleX;
            flipperPositions[index].angle = this.flipper.baseAngle;  // Save the flipped angle
            this.scene.registry.set('flippers', flipperPositions);
        }

        this.updateUI();
    }

    show() {
        this.isActive = true;
        this.updateUI();
        this.outline.setVisible(true);
        this.rotationHandle.setVisible(true);
        this.rotationIcon.setVisible(true);
        this.flipButton.setVisible(true);
        this.flipIcon.setVisible(true);
    }

    hide() {
        this.isActive = false;
        this.outline.setVisible(false);
        this.rotationHandle.setVisible(false);
        this.rotationIcon.setVisible(false);
        this.flipButton.setVisible(false);
        this.flipIcon.setVisible(false);
    }

    updateUI() {
        if (!this.isActive) return;

        // CRITICAL: Stop if flipper or body is destroyed/missing
        if (!this.flipper || !this.flipper.body) return;

        // Update outline position and rotation
        this.outline.clear();
        this.outline.lineStyle(3, 0xFF0000, 0.1);

        // Draw rotated rectangle outline around flipper
        const width = 60;
        const height = 15;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        // Calculate corners based on flipper's origin
        const originOffsetX = (this.flipper.originX - 0.5) * width;
        const originOffsetY = (this.flipper.originY - 0.5) * height;

        // Use baseScaleX to avoid animation artifacts
        const baseScaleX = this.flipper.baseScaleX || this.flipper.scaleX;
        const isFlipped = baseScaleX < 0;

        // Apply scaleX to x-coordinates (handles horizontal flip)
        const corners = [
            { x: (-halfWidth - originOffsetX) * baseScaleX, y: -halfHeight - originOffsetY },
            { x: (halfWidth - originOffsetX) * baseScaleX, y: -halfHeight - originOffsetY },
            { x: (halfWidth - originOffsetX) * baseScaleX, y: halfHeight - originOffsetY },
            { x: (-halfWidth - originOffsetX) * baseScaleX, y: halfHeight - originOffsetY }
        ];

        // Rotate corners using flipper's rotation
        const cos = Math.cos(this.flipper.rotation);
        const sin = Math.sin(this.flipper.rotation);

        const rotatedCorners = corners.map(corner => ({
            x: this.flipper.x + (corner.x * cos - corner.y * sin),
            y: this.flipper.y + (corner.x * sin + corner.y * cos)
        }));

        this.outline.beginPath();
        this.outline.moveTo(rotatedCorners[0].x, rotatedCorners[0].y);
        for (let i = 1; i < rotatedCorners.length; i++) {
            this.outline.lineTo(rotatedCorners[i].x, rotatedCorners[i].y);
        }
        this.outline.closePath();
        this.outline.strokePath();

        // Position rotation handle at the right edge of flipper (no scaleX - handles don't flip)
        const handleDistance = 40;
        const handleAngle = this.flipper.rotation;
        this.rotationHandle.x = this.flipper.x + Math.cos(handleAngle) * handleDistance;
        this.rotationHandle.y = this.flipper.y + Math.sin(handleAngle) * handleDistance;

        // Position flip button at the left edge of flipper (no scaleX - handles don't flip)
        const flipButtonAngle = this.flipper.rotation + Math.PI;
        this.flipButton.x = this.flipper.x + Math.cos(flipButtonAngle) * handleDistance;
        this.flipButton.y = this.flipper.y + Math.sin(flipButtonAngle) * handleDistance;

        // Draw rotation icon (circular arrow) - static orientation
        this.rotationIcon.clear();
        this.rotationIcon.lineStyle(4, 0xFFFFFF, 1);

        const iconX = this.rotationHandle.x;
        const iconY = this.rotationHandle.y;
        const radius = 18;

        // Draw arc (270 degrees) - always same orientation
        this.rotationIcon.beginPath();
        this.rotationIcon.arc(
            iconX,
            iconY,
            radius,
            Phaser.Math.DegToRad(-45),
            Phaser.Math.DegToRad(225),
            false
        );
        this.rotationIcon.strokePath();

        // Draw arrowhead - always at bottom-left
        const arrowAngle = Phaser.Math.DegToRad(225);
        const arrowX = iconX + Math.cos(arrowAngle) * radius;
        const arrowY = iconY + Math.sin(arrowAngle) * radius;
        const arrowSize = 9;

        this.rotationIcon.fillStyle(0xFFFFFF, 1);
        this.rotationIcon.beginPath();
        this.rotationIcon.moveTo(arrowX, arrowY);
        this.rotationIcon.lineTo(
            arrowX + Math.cos(arrowAngle - Math.PI / 2) * arrowSize,
            arrowY + Math.sin(arrowAngle - Math.PI / 2) * arrowSize
        );
        this.rotationIcon.lineTo(
            arrowX + Math.cos(arrowAngle + Math.PI) * arrowSize,
            arrowY + Math.sin(arrowAngle + Math.PI) * arrowSize
        );
        this.rotationIcon.closePath();
        this.rotationIcon.fillPath();

        // Draw flip icon (horizontal double arrow) - static orientation
        this.flipIcon.clear();
        this.flipIcon.lineStyle(4, 0xFFFFFF, 1);
        this.flipIcon.fillStyle(0xFFFFFF, 1);

        const flipX = this.flipButton.x;
        const flipY = this.flipButton.y;
        const arrowWidth = 24;
        const arrowHeight = 9;

        // Left arrow - pointing left
        this.flipIcon.beginPath();
        this.flipIcon.moveTo(flipX - arrowWidth / 2, flipY);
        this.flipIcon.lineTo(flipX - arrowWidth / 2 + arrowHeight, flipY - arrowHeight);
        this.flipIcon.lineTo(flipX - arrowWidth / 2 + arrowHeight, flipY + arrowHeight);
        this.flipIcon.closePath();
        this.flipIcon.fillPath();

        // Right arrow - pointing right
        this.flipIcon.beginPath();
        this.flipIcon.moveTo(flipX + arrowWidth / 2, flipY);
        this.flipIcon.lineTo(flipX + arrowWidth / 2 - arrowHeight, flipY - arrowHeight);
        this.flipIcon.lineTo(flipX + arrowWidth / 2 - arrowHeight, flipY + arrowHeight);
        this.flipIcon.closePath();
        this.flipIcon.fillPath();

        // Line connecting arrows
        this.flipIcon.strokeLineShape(new Phaser.Geom.Line(
            flipX - arrowWidth / 2 + arrowHeight,
            flipY,
            flipX + arrowWidth / 2 - arrowHeight,
            flipY
        ));
    }

    destroy() {
        // CRITICAL: Remove event listeners BEFORE destroying objects
        if (this.rotationHandle) {
            this.rotationHandle.removeAllListeners();
            this.rotationHandle.destroy();
        }
        if (this.flipButton) {
            this.flipButton.removeAllListeners();
            this.flipButton.destroy();
        }
        if (this.outline) this.outline.destroy();
        if (this.rotationIcon) this.rotationIcon.destroy();
        if (this.flipIcon) this.flipIcon.destroy();
    }
}
