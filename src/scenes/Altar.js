class Altar extends Phaser.Scene {
    constructor() {
        super('Altar');
    }

    create() {
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const centerY = GAME_CONFIG.WORLD_HEIGHT / 2;

        // Use custom altar background
        const bg = this.add.image(centerX, centerY, 'altar_background');
        // Scale to cover the entire screen
        const scaleX = GAME_CONFIG.WORLD_WIDTH / bg.width;
        const scaleY = GAME_CONFIG.WORLD_HEIGHT / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);

        // Add black square
        const squareSize = 300;
        const squareY = centerY - 180;
        const square = this.add.graphics();
        square.fillStyle(0x000000);
        square.fillRect(centerX - squareSize / 2, squareY - squareSize / 2, squareSize, squareSize);

        this.createSkullCountDisplay();
        this.createFlavorText();
        this.createCardsList();
        this.createCharacters();
        this.createPrayButton();
        this.createBackButton();
        this.setupInput();
        this.createLightboxContainer();
    }

    setupInput() {
        // Add P key listener for testing
        this.input.keyboard.on('keydown-P', () => {
            const currentTotal = this.registry.get('totalSkulls');
            this.registry.set('totalSkulls', currentTotal + 100);
            this.scene.restart();
        });
    }

    createSkullCountDisplay() {
        const totalSkulls = this.registry.get('totalSkulls');

        // White backdrop for skull count
        const skullBackdrop = this.add.graphics();
        skullBackdrop.fillStyle(0xffffff, 0.9);
        skullBackdrop.fillRoundedRect(GAME_CONFIG.WORLD_WIDTH - 480, 20, 460, 60, 12);

        this.add.text(GAME_CONFIG.WORLD_WIDTH - 32, 32, `Total Skulls: ${totalSkulls}`, {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#000000'
        }).setOrigin(1, 0);
    }

    createFlavorText() {
        const padding = 32;
        const rightX = GAME_CONFIG.WORLD_WIDTH - padding;
        const textWidth = 480;

        // White backdrop for flavor text
        const flavorBackdrop = this.add.graphics();
        flavorBackdrop.fillStyle(0xffffff, 0.9);
        flavorBackdrop.fillRoundedRect(rightX - textWidth, 90, textWidth, 100, 12);

        this.add.text(rightX - 16, 100,
            "Resurrect the 2 Skull Champions\nto beckon the Skull God's return\nto the material plane!",
            {
                fontFamily: 'Arial Black',
                fontSize: 20,
                color: '#000000',
                align: 'right',
                wordWrap: { width: 400 }
            }
        ).setOrigin(1, 0);
    }

    createCardsList() {
        const unlockedItems = this.registry.get('unlockedItems') || [];

        const startX = 80;
        const startY = 100;
        const cardWidth = 60;
        const cardHeight = 84;
        const spacingX = 70;
        const spacingY = 94;
        const cardsPerRow = 4;

        // Display Skull Knight cards
        CHARACTER_UNLOCKABLES['Skull Knight'].forEach((itemName, index) => {
            const row = Math.floor(index / cardsPerRow);
            const col = index % cardsPerRow;
            const x = startX + (col * spacingX);
            const y = startY + (row * spacingY);
            const isUnlocked = unlockedItems.includes(itemName);

            this.createCard(x, y, cardWidth, cardHeight, itemName, isUnlocked, 'Skull Knight');
        });

        // Display Skull Shamaness cards (below Skull Knight cards)
        const shamOffset = Math.ceil(CHARACTER_UNLOCKABLES['Skull Knight'].length / cardsPerRow) * spacingY;
        CHARACTER_UNLOCKABLES['Skull Shamaness'].forEach((itemName, index) => {
            const row = Math.floor(index / cardsPerRow);
            const col = index % cardsPerRow;
            const x = startX + (col * spacingX);
            const y = startY + shamOffset + (row * spacingY);
            const isUnlocked = unlockedItems.includes(itemName);

            this.createCard(x, y, cardWidth, cardHeight, itemName, isUnlocked, 'Skull Shamaness');
        });
    }

    createCard(x, y, width, height, itemName, isUnlocked, characterName) {
        const container = this.add.container(x, y);

        if (isUnlocked) {
            // Add item image first (behind transparent card face)
            const itemImage = this.add.image(0, 0, itemName);
            // Calculate scale and crop to fit card dimensions
            const desiredHeight = height * 0.85;
            const scale = desiredHeight / itemImage.height;
            const cropWidth = width / scale;
            const cropHeight = itemImage.height;
            const cropX = (itemImage.width - cropWidth) / 2;
            // Crop the center portion of the square image
            itemImage.setCrop(cropX, 0, cropWidth, cropHeight);
            itemImage.setScale(scale);
            container.add(itemImage);

            // Add card face on top (with transparent center)
            const cardFace = this.add.image(0, 0, 'card_face');
            cardFace.setDisplaySize(width, height);
            container.add(cardFace);

            // Add character indicator in bottom right
            this.addCharacterIndicator(container, width, height, characterName);

            // Create invisible zone for reliable input handling (containers have buggy interactivity)
            const clickZone = this.add.zone(x, y, width, height);
            clickZone.setInteractive();
            clickZone.on('pointerdown', () => this.viewItem(itemName));
            clickZone.on('pointerover', () => this.startCardHoverEffect(container, x, y, width, height));
            clickZone.on('pointerout', () => this.stopCardHoverEffect(container));
        } else {
            // Show card back (locked)
            const cardBack = this.add.image(0, 0, 'card_back');
            cardBack.setDisplaySize(width, height);
            cardBack.setAlpha(0.5);
            container.add(cardBack);

            // Add character indicator in bottom right (even for locked cards)
            this.addCharacterIndicator(container, width, height, characterName);
        }
    }

    addCharacterIndicator(container, cardWidth, cardHeight, characterName) {
        const indicatorSize = 18;
        const offsetX = cardWidth / 2 - indicatorSize / 2 - 2;
        const offsetY = cardHeight / 2 - indicatorSize / 2 - 2;

        // Create a separate container for the indicator
        const indicatorContainer = this.add.container(offsetX, offsetY);

        // Character icon background (circular) - positioned at 0,0 within indicator container
        const bgCircle = this.add.graphics();
        bgCircle.fillStyle(0xffffff, 0.9);
        bgCircle.fillCircle(0, 0, indicatorSize / 2);
        bgCircle.lineStyle(1, 0x000000);
        bgCircle.strokeCircle(0, 0, indicatorSize / 2);
        indicatorContainer.add(bgCircle);

        // Character icon - positioned at 0,0 within indicator container
        const characterIcon = this.add.image(0, 0, characterName);
        const iconScale = (indicatorSize * 0.8) / characterIcon.height;
        characterIcon.setScale(iconScale);
        indicatorContainer.add(characterIcon);

        // Add indicator container to card container
        container.add(indicatorContainer);
    }

    createLightboxContainer() {
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const centerY = GAME_CONFIG.WORLD_HEIGHT / 2;

        // Visual: Semi-transparent black overlay - depth 1000
        this.lightboxOverlayGraphics = this.add.graphics();
        this.lightboxOverlayGraphics.fillStyle(0x000000, 0.9);
        this.lightboxOverlayGraphics.fillRect(0, 0, GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.WORLD_HEIGHT);
        this.lightboxOverlayGraphics.setDepth(1000);
        this.lightboxOverlayGraphics.setVisible(false);

        // Image - depth 1001
        this.lightboxImage = this.add.image(centerX, centerY, 'card_back');
        this.lightboxImage.setDepth(1001);
        this.lightboxImage.setVisible(false);

        // Card face overlay - depth 1001.5 (between image and text)
        this.lightboxCardFace = this.add.image(centerX, centerY, 'card_face');
        this.lightboxCardFace.setDepth(1001.5);
        this.lightboxCardFace.setVisible(false);

        // White backdrop for item name - depth 1002
        this.lightboxNameBackdrop = this.add.graphics();
        this.lightboxNameBackdrop.fillStyle(0xffffff, 0.9);
        this.lightboxNameBackdrop.fillRoundedRect(centerX - 300, 20, 600, 60, 12);
        this.lightboxNameBackdrop.setDepth(1002);
        this.lightboxNameBackdrop.setVisible(false);

        // Item name text - depth 1003
        this.lightboxNameText = this.add.text(centerX, 50, '', {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#000000'
        }).setOrigin(0.5);
        this.lightboxNameText.setDepth(1003);
        this.lightboxNameText.setVisible(false);

        // Character indicator background (circular) - depth 1002
        this.lightboxCharacterBg = this.add.graphics();
        this.lightboxCharacterBg.setDepth(1002);
        this.lightboxCharacterBg.setVisible(false);

        // Character indicator icon - depth 1003
        this.lightboxCharacterIcon = this.add.image(0, 0, 'card_back');
        this.lightboxCharacterIcon.setDepth(1003);
        this.lightboxCharacterIcon.setVisible(false);

        // Card text backdrop - depth 1002
        this.lightboxTextBackdrop = this.add.graphics();
        this.lightboxTextBackdrop.setDepth(1002);
        this.lightboxTextBackdrop.setVisible(false);

        // Card text - depth 1003
        this.lightboxCardText = this.add.text(centerX, 0, '', {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#000000',
            align: 'center',
            wordWrap: { width: 350 }
        }).setOrigin(0.5, 0);
        this.lightboxCardText.setDepth(1003);
        this.lightboxCardText.setVisible(false);

        // Track if lightbox is open
        this.lightboxIsOpen = false;
        this.lightboxCanClose = false; // Separate flag to prevent immediate closing

        // ESC key to close
        this.escKey = this.input.keyboard.addKey('ESC');

        // Scene-level click handler for closing lightbox
        // This is more reliable than individual game object listeners
        this.lightboxSceneClickHandler = (pointer) => {
            if (this.lightboxIsOpen && this.lightboxCanClose) {
                this.closeLightbox();
            }
        };
    }

    viewItem(itemName) {
        // Prevent opening if already open
        if (this.lightboxIsOpen) {
            return;
        }

        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const centerY = GAME_CONFIG.WORLD_HEIGHT / 2;

        // Determine which character this item belongs to
        let characterName = null;
        if (CHARACTER_UNLOCKABLES['Skull Knight'].includes(itemName)) {
            characterName = 'Skull Knight';
        } else if (CHARACTER_UNLOCKABLES['Skull Shamaness'].includes(itemName)) {
            characterName = 'Skull Shamaness';
        }

        // Update the text
        this.lightboxNameText.setText(itemName);

        // Change the image texture
        this.lightboxImage.setTexture(itemName);
        this.lightboxImage.setPosition(centerX, centerY);

        // Calculate card dimensions - portrait orientation (1.4 aspect ratio like standard cards)
        const maxHeight = GAME_CONFIG.WORLD_HEIGHT * 0.7;
        const cardWidth = maxHeight / 1.4;
        const cardHeight = maxHeight;

        // Calculate scale and crop to fit card dimensions (portrait)
        const desiredHeight = cardHeight * 0.85; // Leave room for card frame
        const scale = desiredHeight / this.lightboxImage.height;
        const cropWidth = cardWidth / scale;
        const cropHeight = this.lightboxImage.height;
        const cropX = Math.max(0, (this.lightboxImage.width - cropWidth) / 2);

        // Crop the center portion of the square image
        this.lightboxImage.setCrop(cropX, 0, cropWidth, cropHeight);
        this.lightboxImage.setScale(scale);

        // Position and scale the card face to match
        this.lightboxCardFace.setPosition(centerX, centerY);
        this.lightboxCardFace.setDisplaySize(cardWidth, cardHeight);

        // Add character indicator in bottom right
        if (characterName) {
            const indicatorSize = 80;
            const indicatorX = centerX + cardWidth / 2 - indicatorSize / 2 - 10;
            const indicatorY = centerY + cardHeight / 2 - indicatorSize / 2 - 10;

            // Draw circular background
            this.lightboxCharacterBg.clear();
            this.lightboxCharacterBg.fillStyle(0xffffff, 0.9);
            this.lightboxCharacterBg.fillCircle(indicatorX, indicatorY, indicatorSize / 2);
            this.lightboxCharacterBg.lineStyle(2, 0x000000);
            this.lightboxCharacterBg.strokeCircle(indicatorX, indicatorY, indicatorSize / 2);
            this.lightboxCharacterBg.setVisible(true);

            // Set character icon
            this.lightboxCharacterIcon.setTexture(characterName);
            this.lightboxCharacterIcon.setPosition(indicatorX, indicatorY);
            const iconScale = (indicatorSize * 0.8) / this.lightboxCharacterIcon.height;
            this.lightboxCharacterIcon.setScale(iconScale);
            this.lightboxCharacterIcon.setVisible(true);
        }

        // Add card text at bottom
        const cardText = CARD_TEXT[itemName] || 'No description available.';
        this.lightboxCardText.setText(cardText);
        const textY = centerY + cardHeight / 2 + 20;
        this.lightboxCardText.setPosition(centerX, textY);

        // Calculate text backdrop size
        const textHeight = this.lightboxCardText.height;
        const textBackdropHeight = textHeight + 30;

        this.lightboxTextBackdrop.clear();
        this.lightboxTextBackdrop.fillStyle(0xffffff, 0.9);
        this.lightboxTextBackdrop.fillRoundedRect(centerX - 200, textY - 15, 400, textBackdropHeight, 12);
        this.lightboxTextBackdrop.setVisible(true);
        this.lightboxCardText.setVisible(true);

        // Show all lightbox elements
        this.lightboxOverlayGraphics.setVisible(true);
        this.lightboxImage.setVisible(true);
        this.lightboxCardFace.setVisible(true);
        this.lightboxNameBackdrop.setVisible(true);
        this.lightboxNameText.setVisible(true);

        this.lightboxIsOpen = true;
        this.lightboxCanClose = false; // Don't allow closing yet

        // Attach scene-level input listener
        this.input.off('pointerdown', this.lightboxSceneClickHandler); // Remove if exists
        this.input.on('pointerdown', this.lightboxSceneClickHandler);

        // CRITICAL: Enable closing after a short delay to prevent same-click closing
        this.time.delayedCall(200, () => {
            if (this.lightboxIsOpen) {
                this.lightboxCanClose = true;
            }
        });
    }

    closeLightbox() {
        // Only close if actually open
        if (!this.lightboxIsOpen) {
            return;
        }

        // Hide all lightbox elements
        this.lightboxOverlayGraphics.setVisible(false);
        this.lightboxImage.setVisible(false);
        this.lightboxCardFace.setVisible(false);
        this.lightboxNameBackdrop.setVisible(false);
        this.lightboxNameText.setVisible(false);
        this.lightboxCharacterBg.setVisible(false);
        this.lightboxCharacterIcon.setVisible(false);
        this.lightboxTextBackdrop.setVisible(false);
        this.lightboxCardText.setVisible(false);

        this.lightboxIsOpen = false;
        this.lightboxCanClose = false;

        // Remove scene-level input listener
        this.input.off('pointerdown', this.lightboxSceneClickHandler);
    }

    startCardHoverEffect(container, x, y, width, height) {
        // Create particle texture if it doesn't exist
        if (!this.textures.exists('particle')) {
            const graphics = this.make.graphics({ x: 0, y: 0, add: false });
            graphics.fillStyle(0xffffff, 1);
            graphics.fillCircle(4, 4, 4);
            graphics.generateTexture('particle', 8, 8);
            graphics.destroy();
        }

        // Create particle emitters for each edge
        const emitters = [];

        // Top edge
        const topEmitter = this.add.particles(x, y - height/2, 'particle', {
            speed: { min: 20, max: 40 },
            angle: { min: -100, max: -80 },
            scale: { start: 0.3, end: 0 },
            lifespan: 500,
            frequency: 30,
            tint: [0xffffff, 0x4A90E2],
            emitZone: { type: 'edge', source: new Phaser.Geom.Line(-width/2, 0, width/2, 0), quantity: 10, stepRate: 1 }
        });
        emitters.push(topEmitter);

        // Bottom edge
        const bottomEmitter = this.add.particles(x, y + height/2, 'particle', {
            speed: { min: 20, max: 40 },
            angle: { min: 80, max: 100 },
            scale: { start: 0.3, end: 0 },
            lifespan: 500,
            frequency: 30,
            tint: [0xffffff, 0x4A90E2],
            emitZone: { type: 'edge', source: new Phaser.Geom.Line(-width/2, 0, width/2, 0), quantity: 10, stepRate: 1 }
        });
        emitters.push(bottomEmitter);

        // Left edge
        const leftEmitter = this.add.particles(x - width/2, y, 'particle', {
            speed: { min: 20, max: 40 },
            angle: { min: 170, max: 190 },
            scale: { start: 0.3, end: 0 },
            lifespan: 500,
            frequency: 30,
            tint: [0xffffff, 0x4A90E2],
            emitZone: { type: 'edge', source: new Phaser.Geom.Line(0, -height/2, 0, height/2), quantity: 10, stepRate: 1 }
        });
        emitters.push(leftEmitter);

        // Right edge
        const rightEmitter = this.add.particles(x + width/2, y, 'particle', {
            speed: { min: 20, max: 40 },
            angle: { min: -10, max: 10 },
            scale: { start: 0.3, end: 0 },
            lifespan: 500,
            frequency: 30,
            tint: [0xffffff, 0x4A90E2],
            emitZone: { type: 'edge', source: new Phaser.Geom.Line(0, -height/2, 0, height/2), quantity: 10, stepRate: 1 }
        });
        emitters.push(rightEmitter);

        // Store emitters on container for cleanup
        container.setData('hoverEmitters', emitters);
    }

    stopCardHoverEffect(container) {
        const emitters = container.getData('hoverEmitters');
        if (emitters) {
            emitters.forEach(emitter => {
                emitter.stop();
                this.time.delayedCall(600, () => emitter.destroy());
            });
            container.setData('hoverEmitters', null);
        }
    }

    update() {
        // Check for ESC key to close lightbox
        if (this.escKey && Phaser.Input.Keyboard.JustDown(this.escKey) && this.lightboxIsOpen) {
            this.closeLightbox();
        }
    }

    createCharacters() {
        const unlockedItems = this.registry.get('unlockedItems') || [];
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const centerY = GAME_CONFIG.WORLD_HEIGHT / 2;
        const squareSize = 300;

        // Position to the right of the altar, below the flavor text
        const altarRightEdge = centerX + squareSize / 2;
        const characterSize = 220;
        const padding = 70;
        const characterSpacing = 240;
        const characterY = 300; // Position below flavor text (which ends around y: 190)

        // Check if Skull Knight is unlocked (all 12 items)
        const knightUnlocked = CHARACTER_UNLOCKABLES['Skull Knight'].every(item =>
            unlockedItems.includes(item)
        );

        if (knightUnlocked) {
            this.createCharacterCard(
                altarRightEdge + padding + characterSize / 2,
                characterY,
                characterSize,
                'Skull Knight',
                'Adds 2X Fast Forward'
            );
        }

        // Check if Skull Shamaness is unlocked (all 12 items)
        const shamanessUnlocked = CHARACTER_UNLOCKABLES['Skull Shamaness'].every(item =>
            unlockedItems.includes(item)
        );

        if (shamanessUnlocked) {
            this.createCharacterCard(
                altarRightEdge + padding + characterSize / 2 + characterSpacing,
                characterY,
                characterSize,
                'Skull Shamaness',
                'Mystical Powers'
            );
        }
    }

    createCharacterCard(x, y, size, characterName, abilityText) {
        const container = this.add.container(x, y);
        const cardWidth = size * 0.9;
        const cardHeight = size * 1.26;

        // Character image first (behind transparent card face)
        const characterImage = this.add.image(0, 0, characterName);
        // Calculate scale and crop to fit card dimensions
        const desiredHeight = cardHeight * 0.85;
        const scale = desiredHeight / characterImage.height;
        const cropWidth = cardWidth / scale;
        const cropHeight = characterImage.height;
        const cropX = (characterImage.width - cropWidth) / 2;
        // Crop the center portion of the square image
        characterImage.setCrop(cropX, 0, cropWidth, cropHeight);
        characterImage.setScale(scale);
        container.add(characterImage);

        // Card face on top (with transparent center)
        const cardFace = this.add.image(0, 0, 'card_face');
        cardFace.setDisplaySize(cardWidth, cardHeight);
        container.add(cardFace);

        // Create invisible zone for reliable input handling (containers have buggy interactivity)
        const clickZone = this.add.zone(x, y, cardWidth, cardHeight);
        clickZone.setInteractive();
        clickZone.on('pointerdown', () => this.viewItem(characterName));
        clickZone.on('pointerover', () => this.startCardHoverEffect(container, x, y, cardWidth, cardHeight));
        clickZone.on('pointerout', () => this.stopCardHoverEffect(container));

        // White backdrop for ability label
        const abilityBackdrop = this.add.graphics();
        abilityBackdrop.fillStyle(0xffffff, 0.9);
        abilityBackdrop.fillRoundedRect(x - 120, y + cardHeight / 2 + 8, 240, 40, 12);

        // Add ability label below the character
        this.add.text(x, y + cardHeight / 2 + 20, abilityText, {
            fontFamily: 'Arial Black',
            fontSize: 18,
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);
    }

    createPrayButton() {
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const centerY = GAME_CONFIG.WORLD_HEIGHT / 2;
        const buttonY = centerY + 50;
        const cost = 200;

        this.prayButton = this.add.graphics();
        this.prayButton.fillStyle(0x8B1A1A);  // Dark red
        this.prayButton.fillRoundedRect(centerX - 150, buttonY - 30, 300, 60, 10);
        this.prayButton.lineStyle(3, 0x000000);
        this.prayButton.strokeRoundedRect(centerX - 150, buttonY - 30, 300, 60, 10);

        this.prayButtonText = this.add.text(centerX, buttonY, `PRAY (${cost} Skulls)`, {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#000000'
        }).setOrigin(0.5);

        this.prayButton.setInteractive(new Phaser.Geom.Rectangle(centerX - 150, buttonY - 30, 300, 60), Phaser.Geom.Rectangle.Contains);
        this.prayButton.on('pointerdown', () => this.pray(cost));

        this.isPrayButtonEnabled = true;
    }

    disablePrayButton() {
        this.isPrayButtonEnabled = false;
        this.prayButton.disableInteractive();
        this.prayButtonText.setAlpha(0.5);
    }

    enablePrayButton() {
        this.isPrayButtonEnabled = true;
        this.prayButton.setInteractive(new Phaser.Geom.Rectangle(GAME_CONFIG.WORLD_WIDTH / 2 - 150, GAME_CONFIG.WORLD_HEIGHT / 2 + 20, 300, 60), Phaser.Geom.Rectangle.Contains);
        this.prayButtonText.setAlpha(1);
    }

    pray(cost) {
        if (!this.isPrayButtonEnabled) return;

        const totalSkulls = this.registry.get('totalSkulls');
        if (totalSkulls >= cost) {
            this.registry.set('totalSkulls', totalSkulls - cost);
            this.disablePrayButton();
            this.openBoosterPack();
        }
    }

    openBoosterPack() {
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const centerY = GAME_CONFIG.WORLD_HEIGHT / 2;

        // Disable back button during pack opening
        this.disableBackButton();

        // Track pack opening state for click-to-advance
        this.packOpeningState = {
            phase: 'dropping', // dropping -> clicked -> flipping -> done
            overlay: null,
            boosterPack: null,
            cards: null,
            cardContainers: [],
            currentCardIndex: 0,
            activeTweens: [],
            activeTimers: [],
            skullEmitter: null
        };

        // Dim the background
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.WORLD_HEIGHT);
        overlay.setDepth(100);
        this.packOpeningState.overlay = overlay;

        // Make overlay clickable to advance through pack opening
        overlay.setInteractive(new Phaser.Geom.Rectangle(0, 0, GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.WORLD_HEIGHT), Phaser.Geom.Rectangle.Contains);
        overlay.on('pointerdown', () => this.advancePackOpening());

        // Create booster pack off-screen (above)
        const boosterPack = this.add.image(centerX, -200, 'booster_pack');
        boosterPack.setScale(0.5);
        boosterPack.setDepth(101);
        this.packOpeningState.boosterPack = boosterPack;

        // Animate booster pack dropping from top
        const dropTween = this.tweens.add({
            targets: boosterPack,
            y: centerY,
            duration: 800,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                this.packOpeningState.phase = 'waiting_for_click';
            }
        });
        this.packOpeningState.activeTweens.push(dropTween);
    }

    advancePackOpening() {
        const state = this.packOpeningState;
        if (!state) return;

        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const centerY = GAME_CONFIG.WORLD_HEIGHT / 2;

        if (state.phase === 'dropping') {
            // Skip drop animation, move pack to center immediately
            state.activeTweens.forEach(tween => tween.stop());
            state.activeTweens = [];
            state.boosterPack.setPosition(centerX, centerY);
            state.phase = 'waiting_for_click';

        } else if (state.phase === 'waiting_for_click') {
            // Open the pack
            state.phase = 'opening';

            // Generate 3 random cards
            state.cards = this.generateBoosterCards();

            // Create skull emoji texture for particles if it doesn't exist
            if (!this.textures.exists('skull_emoji')) {
                const graphics = this.make.graphics({ x: 0, y: 0, add: false });
                graphics.fillStyle(0xffffff, 1);
                const skullText = this.add.text(0, 0, '💀', { fontSize: '32px' });
                skullText.setOrigin(0.5);
                const renderTexture = this.add.renderTexture(0, 0, 32, 32);
                renderTexture.draw(skullText, 16, 16);
                renderTexture.saveTexture('skull_emoji');
                renderTexture.destroy();
                skullText.destroy();
                graphics.destroy();
            }

            // Create skull emoji particle emitter (BIGGER explosion!)
            const skullEmitter = this.add.particles(centerX, centerY, 'skull_emoji', {
                speed: { min: 150, max: 400 },
                angle: { min: 0, max: 360 },
                scale: { start: 2, end: 0 },
                lifespan: 1200,
                quantity: 30,
                gravityY: 200
            });
            skullEmitter.setDepth(103);
            skullEmitter.explode(30);
            state.skullEmitter = skullEmitter;

            // Pack expansion and disappear animation
            const packTween = this.tweens.add({
                targets: state.boosterPack,
                scaleX: 0.7,
                scaleY: 0.7,
                alpha: 0,
                duration: 300,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    state.boosterPack.destroy();
                }
            });
            state.activeTweens.push(packTween);

            // Show cards after brief delay
            const showCardsTimer = this.time.delayedCall(200, () => {
                this.showCards(state.overlay, state.cards);
            });
            state.activeTimers.push(showCardsTimer);

            // Clean up skull emitter after particles die
            const cleanupTimer = this.time.delayedCall(1400, () => {
                if (state.skullEmitter) {
                    state.skullEmitter.destroy();
                    state.skullEmitter = null;
                }
            });
            state.activeTimers.push(cleanupTimer);

        } else if (state.phase === 'opening') {
            // Skip to showing cards
            state.activeTweens.forEach(tween => tween.stop());
            state.activeTimers.forEach(timer => timer.remove());
            state.activeTweens = [];
            state.activeTimers = [];

            if (state.boosterPack) {
                state.boosterPack.destroy();
                state.boosterPack = null;
            }
            if (state.skullEmitter) {
                state.skullEmitter.destroy();
                state.skullEmitter = null;
            }

            this.showCards(state.overlay, state.cards);

        } else if (state.phase === 'flipping') {
            // Flip next card immediately
            this.flipNextCardImmediately();

        } else if (state.phase === 'done') {
            // Close immediately
            this.closePackOpening();
        }
    }

    flipNextCardImmediately() {
        const state = this.packOpeningState;
        if (!state || !state.cardContainers) return;

        // Stop all active tweens and timers
        state.activeTweens.forEach(tween => tween.stop());
        state.activeTimers.forEach(timer => timer.remove());
        state.activeTweens = [];
        state.activeTimers = [];

        // If current card is mid-flip, complete it
        if (state.currentCardIndex < state.cardContainers.length) {
            const container = state.cardContainers[state.currentCardIndex];
            const cardBack = container.getData('cardBack');
            const cardFace = container.getData('cardFace');
            const itemImage = container.getData('itemImage');

            // Complete the flip instantly
            container.setScale(1, 1);
            cardBack.setVisible(false);
            cardFace.setVisible(true);
            itemImage.setVisible(true);

            // Move to next card
            state.currentCardIndex++;
        }

        // Start flipping the next card (or finish if done)
        this.flipCardsSequentially(state.overlay, state.cardContainers, state.currentCardIndex);
    }

    closePackOpening() {
        const state = this.packOpeningState;
        if (!state) return;

        // Stop all active animations
        state.activeTweens.forEach(tween => tween.stop());
        state.activeTimers.forEach(timer => timer.remove());

        // Unlock the items
        const unlockedItems = this.registry.get('unlockedItems') || [];
        state.cardContainers.forEach(container => {
            const item = container.getData('item');
            if (!unlockedItems.includes(item)) {
                unlockedItems.push(item);
            }
        });
        this.registry.set('unlockedItems', unlockedItems);

        // Cleanup and restart scene
        state.cardContainers.forEach(container => container.destroy());
        state.overlay.destroy();
        if (state.boosterPack) state.boosterPack.destroy();
        if (state.skullEmitter) state.skullEmitter.destroy();

        this.packOpeningState = null;
        this.enablePrayButton();
        this.enableBackButton();
        this.scene.restart();
    }

    generateBoosterCards() {
        const unlockedItems = this.registry.get('unlockedItems') || [];
        const lockedItems = ALL_UNLOCKABLES.filter(item => !unlockedItems.includes(item));

        // Pick 3 random locked items (or less if not enough locked items)
        const cards = [];
        const numCards = Math.min(3, lockedItems.length);

        for (let i = 0; i < numCards; i++) {
            const randomIndex = Math.floor(Math.random() * lockedItems.length);
            cards.push(lockedItems.splice(randomIndex, 1)[0]);
        }

        return cards;
    }

    showCards(overlay, cards) {
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const centerY = GAME_CONFIG.WORLD_HEIGHT / 2;
        const cardWidth = 180;
        const cardHeight = 252;
        const cardSpacing = 220;

        const cardContainers = [];

        // Create 3 card containers with both front and back
        cards.forEach((cardItem, index) => {
            const x = centerX - cardSpacing + (index * cardSpacing);

            // Create container for the card
            const container = this.add.container(x, centerY);
            container.setDepth(102);

            // Card back (visible initially)
            const cardBack = this.add.image(0, 0, 'card_back');
            cardBack.setDisplaySize(cardWidth, cardHeight);
            cardBack.setData('side', 'back');
            container.add(cardBack);

            // Item image (hidden initially, behind card face)
            const itemImage = this.add.image(0, 0, cardItem);
            // Calculate scale and crop to fit card dimensions
            const desiredHeight = cardHeight * 0.85;
            const scale = desiredHeight / itemImage.height;
            const cropWidth = cardWidth / scale;
            const cropHeight = itemImage.height;
            const cropX = (itemImage.width - cropWidth) / 2;
            // Crop the center portion of the square image
            itemImage.setCrop(cropX, 0, cropWidth, cropHeight);
            itemImage.setScale(scale);
            itemImage.setVisible(false);
            container.add(itemImage);

            // Card front on top (hidden initially, with transparent center)
            const cardFace = this.add.image(0, 0, 'card_face');
            cardFace.setDisplaySize(cardWidth, cardHeight);
            cardFace.setVisible(false);
            cardFace.setData('side', 'front');
            container.add(cardFace);

            container.setData('item', cardItem);
            container.setData('cardBack', cardBack);
            container.setData('cardFace', cardFace);
            container.setData('itemImage', itemImage);

            cardContainers.push(container);
        });

        // Update state
        if (this.packOpeningState) {
            this.packOpeningState.cardContainers = cardContainers;
            this.packOpeningState.currentCardIndex = 0;
            this.packOpeningState.phase = 'flipping';
        }

        // Flip cards one at a time
        this.flipCardsSequentially(overlay, cardContainers, 0);
    }

    flipCardsSequentially(overlay, cardContainers, index) {
        // Update current card index
        if (this.packOpeningState) {
            this.packOpeningState.currentCardIndex = index;
        }

        if (index >= cardContainers.length) {
            // All cards flipped, wait then close
            if (this.packOpeningState) {
                this.packOpeningState.phase = 'done';
            }

            const closeTimer = this.time.delayedCall(2000, () => {
                this.closePackOpening();
            });

            if (this.packOpeningState) {
                this.packOpeningState.activeTimers.push(closeTimer);
            }
            return;
        }

        const container = cardContainers[index];
        const cardBack = container.getData('cardBack');
        const cardFace = container.getData('cardFace');
        const itemImage = container.getData('itemImage');

        // Get card world position
        const cardX = container.x;
        const cardY = container.y;

        // First half of flip: Shrink to middle (showing back)
        const shrinkTween = this.tweens.add({
            targets: container,
            scaleX: 0,
            duration: 250,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                // At the middle of the flip, swap the visible side
                cardBack.setVisible(false);
                cardFace.setVisible(true);
                itemImage.setVisible(true);

                // Create particle burst at card flip moment
                if (this.textures.exists('particle')) {
                    const flipEmitter = this.add.particles(cardX, cardY, 'particle', {
                        speed: { min: 50, max: 150 },
                        angle: { min: 0, max: 360 },
                        scale: { start: 0.5, end: 0 },
                        lifespan: 600,
                        quantity: 15,
                        tint: [0xffffff, 0x4A90E2]
                    });
                    flipEmitter.setDepth(103);
                    flipEmitter.explode(15);

                    // Clean up emitter after particles die
                    const cleanupTimer = this.time.delayedCall(700, () => {
                        flipEmitter.destroy();
                    });

                    if (this.packOpeningState) {
                        this.packOpeningState.activeTimers.push(cleanupTimer);
                    }
                }

                // Second half of flip: Expand from middle (showing front)
                const expandTween = this.tweens.add({
                    targets: container,
                    scaleX: 1,
                    duration: 250,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        // Wait a bit, then flip next card
                        const nextCardTimer = this.time.delayedCall(500, () => {
                            this.flipCardsSequentially(overlay, cardContainers, index + 1);
                        });

                        if (this.packOpeningState) {
                            this.packOpeningState.activeTimers.push(nextCardTimer);
                        }
                    }
                });

                if (this.packOpeningState) {
                    this.packOpeningState.activeTweens.push(expandTween);
                }
            }
        });

        if (this.packOpeningState) {
            this.packOpeningState.activeTweens.push(shrinkTween);
        }
    }

    createBackButton() {
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const buttonY = GAME_CONFIG.WORLD_HEIGHT - 68;

        this.backButton = this.add.graphics();
        this.backButton.fillStyle(0x0B5563);  // Dark teal
        this.backButton.fillRoundedRect(centerX - 60, buttonY - 20, 120, 40, 6);
        this.backButton.lineStyle(3, 0x000000);
        this.backButton.strokeRoundedRect(centerX - 60, buttonY - 20, 120, 40, 6);
        this.backButton.setInteractive(new Phaser.Geom.Rectangle(centerX - 60, buttonY - 20, 120, 40), Phaser.Geom.Rectangle.Contains);

        this.backButtonText = this.add.text(centerX, buttonY, 'BACK', {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#000000'
        }).setOrigin(0.5);

        this.backButton.on('pointerdown', () => this.scene.start('MainMenu'));

        this.isBackButtonEnabled = true;
    }

    disableBackButton() {
        this.isBackButtonEnabled = false;
        this.backButton.disableInteractive();
        this.backButtonText.setAlpha(0.5);
    }

    enableBackButton() {
        this.isBackButtonEnabled = true;
        const centerX = GAME_CONFIG.WORLD_WIDTH / 2;
        const buttonY = GAME_CONFIG.WORLD_HEIGHT - 68;
        this.backButton.setInteractive(new Phaser.Geom.Rectangle(centerX - 60, buttonY - 20, 120, 40), Phaser.Geom.Rectangle.Contains);
        this.backButtonText.setAlpha(1);
    }
}
