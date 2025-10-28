/**
 * Card Component
 * Displays a collectible card with item image, card face, and character indicator
 */
class Card extends Phaser.GameObjects.Container {
    constructor(scene, x, y, itemName, options = {}) {
        super(scene, x, y);

        const {
            width = UI_CONFIG.CARD.SMALL.width,
            height = UI_CONFIG.CARD.SMALL.height,
            isUnlocked = false,
            characterName = null,
            onClick = null,
            onHover = null,
            onHoverOut = null
        } = options;

        this.itemName = itemName;
        this.cardWidth = width;
        this.cardHeight = height;
        this.isUnlocked = isUnlocked;
        this.characterName = characterName;
        this.hoverEmitters = null;

        // Build card visual elements
        if (isUnlocked) {
            this.createUnlockedCard();
        } else {
            this.createLockedCard();
        }

        // Add character indicator
        if (characterName) {
            this.addCharacterIndicator();
        }

        // Set up interactivity for unlocked cards
        if (isUnlocked && onClick) {
            this.setupInteractivity(onClick, onHover, onHoverOut);
        }

        scene.add.existing(this);
    }

    createUnlockedCard() {
        // Item image (behind card face)
        const itemImage = this.scene.add.image(0, 0, this.itemName);
        const desiredHeight = this.cardHeight * 0.85;
        const scale = desiredHeight / itemImage.height;
        const cropWidth = this.cardWidth / scale;
        const cropHeight = itemImage.height;
        const cropX = (itemImage.width - cropWidth) / 2;
        itemImage.setCrop(cropX, 0, cropWidth, cropHeight);
        itemImage.setScale(scale);
        this.add(itemImage);

        // Card face overlay (with transparent center)
        const cardFace = this.scene.add.image(0, 0, 'card_face');
        cardFace.setDisplaySize(this.cardWidth, this.cardHeight);
        this.add(cardFace);
    }

    createLockedCard() {
        // Card back (grayed out)
        const cardBack = this.scene.add.image(0, 0, 'card_back');
        cardBack.setDisplaySize(this.cardWidth, this.cardHeight);
        cardBack.setAlpha(0.5);
        this.add(cardBack);
    }

    addCharacterIndicator() {
        const indicatorSize = this.cardWidth < 100 ? 18 : 80;
        const offsetX = this.cardWidth / 2 - indicatorSize / 2 - 2;
        const offsetY = this.cardHeight / 2 - indicatorSize / 2 - 2;

        const indicatorContainer = this.scene.add.container(offsetX, offsetY);

        // Circular background
        const bgCircle = this.scene.add.graphics();
        bgCircle.fillStyle(0xffffff, 0.9);
        bgCircle.fillCircle(0, 0, indicatorSize / 2);
        bgCircle.lineStyle(indicatorSize < 50 ? 1 : 2, 0x000000);
        bgCircle.strokeCircle(0, 0, indicatorSize / 2);
        indicatorContainer.add(bgCircle);

        // Character icon
        const characterIcon = this.scene.add.image(0, 0, this.characterName);
        const iconScale = (indicatorSize * 0.8) / characterIcon.height;
        characterIcon.setScale(iconScale);
        indicatorContainer.add(characterIcon);

        this.add(indicatorContainer);
    }

    setupInteractivity(onClick, onHover, onHoverOut) {
        // Create invisible zone for reliable input handling
        const worldPos = this.getWorldTransformMatrix();
        const clickZone = this.scene.add.zone(this.x, this.y, this.cardWidth, this.cardHeight);
        clickZone.setInteractive();

        clickZone.on('pointerdown', () => {
            if (onClick) onClick(this.itemName);
        });

        clickZone.on('pointerover', () => {
            if (onHover) {
                this.hoverEmitters = onHover(this, this.x, this.y, this.cardWidth, this.cardHeight);
            }
        });

        clickZone.on('pointerout', () => {
            if (onHoverOut && this.hoverEmitters) {
                onHoverOut(this, this.hoverEmitters);
                this.hoverEmitters = null;
            }
        });

        // Store zone reference for cleanup
        this.clickZone = clickZone;
    }

    destroy() {
        if (this.clickZone) {
            this.clickZone.destroy();
        }
        super.destroy();
    }
}
