/**
 * CardGrid Component
 * Manages layout and display of multiple cards in a grid
 */
class CardGrid {
    constructor(scene, options = {}) {
        this.scene = scene;

        const {
            startX = 80,
            startY = 100,
            cardWidth = UI_CONFIG.CARD.SMALL.width,
            cardHeight = UI_CONFIG.CARD.SMALL.height,
            spacingX = UI_CONFIG.SPACING.CARD_GRID.HORIZONTAL,
            spacingY = UI_CONFIG.SPACING.CARD_GRID.VERTICAL,
            cardsPerRow = UI_CONFIG.SPACING.CARD_GRID.CARDS_PER_ROW,
            onCardClick = null,
            onCardHover = null,
            onCardHoverOut = null
        } = options;

        this.startX = startX;
        this.startY = startY;
        this.cardWidth = cardWidth;
        this.cardHeight = cardHeight;
        this.spacingX = spacingX;
        this.spacingY = spacingY;
        this.cardsPerRow = cardsPerRow;
        this.onCardClick = onCardClick;
        this.onCardHover = onCardHover;
        this.onCardHoverOut = onCardHoverOut;

        this.cards = [];
    }

    /**
     * Create a grid of cards for a specific character
     */
    createCharacterGrid(characterName, unlockedItems, offsetY = 0) {
        const items = CHARACTER_UNLOCKABLES[characterName];

        items.forEach((itemName, index) => {
            const row = Math.floor(index / this.cardsPerRow);
            const col = index % this.cardsPerRow;
            const x = this.startX + (col * this.spacingX);
            const y = this.startY + offsetY + (row * this.spacingY);
            const isUnlocked = unlockedItems.includes(itemName);

            const card = new Card(this.scene, x, y, itemName, {
                width: this.cardWidth,
                height: this.cardHeight,
                isUnlocked: isUnlocked,
                characterName: characterName,
                onClick: this.onCardClick,
                onHover: this.onCardHover,
                onHoverOut: this.onCardHoverOut
            });

            this.cards.push(card);
        });

        // Return the Y offset for the next character grid
        const numRows = Math.ceil(items.length / this.cardsPerRow);
        return offsetY + (numRows * this.spacingY);
    }

    /**
     * Create grids for all characters
     */
    createAllCharacterGrids(unlockedItems) {
        let offsetY = 0;

        // Skull Knight cards
        offsetY = this.createCharacterGrid('Skull Knight', unlockedItems, offsetY);

        // Skull Shamaness cards
        this.createCharacterGrid('Skull Shamaness', unlockedItems, offsetY);
    }

    /**
     * Destroy all cards
     */
    destroy() {
        this.cards.forEach(card => card.destroy());
        this.cards = [];
    }
}
