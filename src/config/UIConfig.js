const UI_CONFIG = {
    // Button sizes and spacing
    BUTTON: {
        SMALL: { width: 120, height: 40, fontSize: 20 },
        MEDIUM: { width: 200, height: 60, fontSize: 28 },
        LARGE: { width: 300, height: 60, fontSize: 24 }
    },

    // Panel/Backdrop settings
    PANEL: {
        FILL_COLOR: 0xffffff,
        FILL_ALPHA: 0.9,
        BORDER_RADIUS: 12,
        PADDING: 32
    },

    // Card dimensions
    CARD: {
        SMALL: { width: 60, height: 84 },
        MEDIUM: { width: 180, height: 252 },
        LARGE: { width: 220, height: 308 },
        ASPECT_RATIO: 1.4  // Height/Width ratio for portrait cards
    },

    // Text styles
    TEXT_STYLE: {
        HEADER: {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#000000'
        },
        TITLE: {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#000000'
        },
        BODY: {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#000000'
        },
        SMALL: {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#000000'
        },
        DESCRIPTION: {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#000000'
        }
    },

    // Layout spacing
    SPACING: {
        CARD_GRID: {
            HORIZONTAL: 70,
            VERTICAL: 94,
            CARDS_PER_ROW: 4
        },
        UPGRADE_BUTTON: 95
    },

    // Depths for layering
    DEPTH: {
        BACKGROUND: 0,
        GAME_OBJECTS: 50,
        UI: 100,
        OVERLAY: 1000,
        LIGHTBOX_OVERLAY: 1000,
        LIGHTBOX_IMAGE: 1001,
        LIGHTBOX_CARD_FACE: 1001.5,
        LIGHTBOX_BACKDROP: 1002,
        LIGHTBOX_TEXT: 1003,
        PARTICLES: 103
    }
};
