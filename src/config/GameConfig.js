const GAME_CONFIG = {
    WORLD_WIDTH: 1366,
    WORLD_HEIGHT: 768,
    PLAY_AREA_WIDTH: 1024,
    SIDEBAR_WIDTH: 342,
    FLOOR_Y: 740,
    GRAVITY: 400,
    PHYSICS_BOUNDS: {
        x: 0,
        y: -400,
        width: 1024,
        height: 768 + 310
    }
};

/**
 * Format a number with commas and round to nearest whole number
 */
function formatScore(value) {
    const rounded = Math.round(value);
    return rounded.toLocaleString('en-US');
}

/**
 * Create a slow color-changing overlay for atmospheric effect
 * @param {Phaser.Scene} scene - The scene to add the overlay to
 * @returns {Object} - Object containing the overlay graphics and cleanup function
 */
function createColorOverlay(scene) {
    // Create graphics for overlay
    const overlay = scene.add.graphics();
    overlay.setDepth(0.5); // Just above background, below all UI

    // Initial color (semi-transparent purple)
    let currentColor = { r: 138, g: 43, b: 226, a: 0.15 };

    // Define color sequence (RGB values)
    const colors = [
        { r: 138, g: 43, b: 226 },   // Purple
        { r: 75, g: 0, b: 130 },     // Indigo
        { r: 0, g: 0, b: 139 },      // Dark Blue
        { r: 72, g: 61, b: 139 },    // Dark Slate Blue
        { r: 138, g: 43, b: 226 }    // Back to Purple
    ];

    let colorIndex = 0;

    // Function to redraw overlay
    const redrawOverlay = () => {
        overlay.clear();
        const hexColor = Phaser.Display.Color.GetColor(
            Math.round(currentColor.r),
            Math.round(currentColor.g),
            Math.round(currentColor.b)
        );
        overlay.fillStyle(hexColor, currentColor.a);
        overlay.fillRect(0, 0, GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.WORLD_HEIGHT);
    };

    // Initial draw
    redrawOverlay();

    // Create tween chain for color transitions
    const createColorTween = () => {
        const nextIndex = (colorIndex + 1) % colors.length;
        const targetColor = colors[nextIndex];

        scene.tweens.add({
            targets: currentColor,
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration: 8000, // 8 seconds per transition
            ease: 'Sine.easeInOut',
            onUpdate: redrawOverlay,
            onComplete: () => {
                colorIndex = nextIndex;
                if (scene.scene.isActive()) {
                    createColorTween(); // Continue the loop
                }
            }
        });
    };

    // Start the color animation
    createColorTween();

    // Return cleanup function
    return {
        overlay,
        destroy: () => {
            scene.tweens.killTweensOf(currentColor);
            overlay.destroy();
        }
    };
}

const CHARACTER_UNLOCKABLES = {
    'Skull Knight': [
        'Skull Helm',
        'Skull Dagger',
        'Skull Gauntlets',
        'Skull Breastplate',
        'Skull Skirt',
        'Skull Boots',
        'Skull Shoulderpads',
        'Skull Shield',
        'Skull Belt',
        'Skull Bow',
        'Skull Quiver',
        'Skull Sword'
    ],
    'Skull Shamaness': [
        'Skull Headdress',
        'Skull Dress',
        'Skull Potion',
        'Skull Staff',
        'Skull Scimitar',
        'Skull Necklace',
        'Skull Bodice',
        'Skull Bra',
        'Skull Bikini',
        'Skull Midriff Belt',
        'Skull Bracer',
        'Skull Lipstick'
    ]
};

// Flat list of all unlockables for easy lookup
const ALL_UNLOCKABLES = [
    ...CHARACTER_UNLOCKABLES['Skull Knight'],
    ...CHARACTER_UNLOCKABLES['Skull Shamaness']
];

// For backwards compatibility
const UNLOCKABLES = ALL_UNLOCKABLES;

// Card upgrade types (24 cards: 6 of each type)
const CARD_UPGRADES = {
    // Bumper Max Multiplier (6 cards)
    'Skull Helm': 'bumperMultiplier',
    'Skull Gauntlets': 'bumperMultiplier',
    'Skull Shoulderpads': 'bumperMultiplier',
    'Skull Belt': 'bumperMultiplier',
    'Skull Headdress': 'bumperMultiplier',
    'Skull Necklace': 'bumperMultiplier',

    // Game Time (6 cards)
    'Skull Dagger': 'gameTime',
    'Skull Boots': 'gameTime',
    'Skull Quiver': 'gameTime',
    'Skull Dress': 'gameTime',
    'Skull Bodice': 'gameTime',
    'Skull Bracer': 'gameTime',

    // Flipper Addition (6 cards)
    'Skull Breastplate': 'flipperAddition',
    'Skull Shield': 'flipperAddition',
    'Skull Bow': 'flipperAddition',
    'Skull Potion': 'flipperAddition',
    'Skull Scimitar': 'flipperAddition',
    'Skull Lipstick': 'flipperAddition',

    // Max Skulls (6 cards)
    'Skull Skirt': 'maxSkulls',
    'Skull Sword': 'maxSkulls',
    'Skull Staff': 'maxSkulls',
    'Skull Bra': 'maxSkulls',
    'Skull Bikini': 'maxSkulls',
    'Skull Midriff Belt': 'maxSkulls'
};

// Card text descriptions with upgrade info
const CARD_TEXT = {
    // Bumper Max Multiplier cards
    'Skull Helm': 'A Skull for a Skull.\n+1 Bumper Max Multiplier',
    'Skull Gauntlets': '"What if the Gauntlets had Skulls on them?"\n+1 Bumper Max Multiplier',
    'Skull Shoulderpads': '"You could fit more Skulls on there."\n+1 Bumper Max Multiplier',
    'Skull Belt': 'How else do you expect to hold up your skull pants?\n+1 Bumper Max Multiplier',
    'Skull Headdress': 'The ancient headdress imbued with mystical power.\n+1 Bumper Max Multiplier',
    'Skull Necklace': 'Dat Skull drip.\n+1 Bumper Max Multiplier',

    // Game Time cards
    'Skull Dagger': 'Stabby Skull goes poke poke poke!\n+1 Game Time',
    'Skull Boots': 'Skull Booties! Adorable.\n+1 Game Time',
    'Skull Quiver': 'Skull Quiver? I never even met \'er.\n+1 Game Time',
    'Skull Dress': 'All my Skull Baddies make it Clank Clank Clank!\n+1 Game Time',
    'Skull Bodice': 'Layers of Skulls.\n+1 Game Time',
    'Skull Bracer': 'It needs more skulls.\n+1 Game Time',

    // Flipper Addition cards
    'Skull Breastplate': 'Block it with a Skull. Now that\'s using your Skull.\n+1 Flipper Addition',
    'Skull Shield': 'When you\'re hard-headed, you block everything with your Skull.\n+1 Flipper Addition',
    'Skull Bow': 'Skeleton Archers ruined Dark Souls. Why not this game, too?\n+1 Flipper Addition',
    'Skull Potion': 'You should have a sip. Just a little one. Go ahead. Here.\n+1 Flipper Addition',
    'Skull Scimitar': 'More like Skullmitar.\n+1 Flipper Addition',
    'Skull Lipstick': 'It\'s actually just Skull-Flavored Lip Gloss.\n+1 Flipper Addition',

    // Max Skulls cards
    'Skull Skirt': 'Super Macho Skull-Themed Battle Skirt.\n+1 Max Skulls',
    'Skull Sword': 'Deadly Weapon? Fearsome Fashion Accessory? Why not both?\n+1 Max Skulls',
    'Skull Staff': 'A staff imbued with Big Skull Energy.\n+1 Max Skulls',
    'Skull Bra': 'Extremely comfortable.\n+1 Max Skulls',
    'Skull Bikini': 'You can\'t really consider yourself Goth if this isn\'t your daily driver underwear.\n+1 Max Skulls',
    'Skull Midriff Belt': 'For when you want to accentuate your Skellybutton.\n+1 Max Skulls',

    // Character cards
    'Skull Knight': 'The legendary Skull Knight. A warrior who has conquered death itself. Unlocks 2X Fast Forward speed.',
    'Skull Shamaness': 'The mystical Skull Shamaness. A sorceress who commands the forces of life and death. Doubles head shrink rate (20% per shrink).'
};

const DEFAULT_SAVE_DATA = {
    totalSkulls: 200,
    maxSkulls: 10,
    upgradeLevel: 0,
    basketLevel: 0,
    timerLevel: 0,
    bumperLevel: 0,
    flipperLevel: 0,
    triangleLevel: 0,
    boosterLevel: 0,
    shrinkerLevel: 0,
    portalLevel: 0,
    duplicatorLevel: 0,
    maxDuplicators: 3,
    gameTime: 10,
    baskets: [],
    bumpers: [],
    flippers: [],
    triangles: [],
    boosters: [],
    shrinkers: [],
    portals: [],
    duplicators: [],
    highscore: 0,
    unlockedItems: [],
    autoStartUnlocked: false,
    autoStartLevel: 0,
    autoStartEnabled: false,
    autoStartRemainingTime: 0,
    prestigeLevel: 0,
    prestigeMultiplier: 1,
    fastForwardEnabled: false,
    justPrestiged: false,
    // Card upgrade bonuses
    bumperMaxMultiplier: 4,  // Base max multiplier for bumpers
    cardBonusGameTime: 0,    // Bonus time from cards
    cardBonusMaxSkulls: 0,   // Bonus max skulls from cards
    cardBonusFlipperAddition: 0  // Bonus value added by flippers from cards
};