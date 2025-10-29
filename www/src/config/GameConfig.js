const GAME_CONFIG = {
    WORLD_WIDTH: 1366,
    WORLD_HEIGHT: 768,
    PLAY_AREA_WIDTH: 1024,
    SIDEBAR_WIDTH: 342,
    FLOOR_Y: 680,
    GRAVITY: 400,
    PHYSICS_BOUNDS: {
        x: 0,
        y: -400,
        width: 1024,
        height: 768 + 310
    }
};

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

// Card text descriptions
const CARD_TEXT = {
    // Skull Knight cards
    'Skull Helm': 'A Skull for a Skull.',
    'Skull Dagger': 'Stabby Skull goes poke poke poke!',
    'Skull Gauntlets': '"What if the Gauntlets had Skulls on them?"',
    'Skull Breastplate': 'Block it with a Skull. Now that\s using your Skull.',
    'Skull Skirt': 'Super Macho Skull-Themed Battle Skirt.',
    'Skull Boots': 'Skull Booties! Adorable.',
    'Skull Shoulderpads': '"You could fit more Skulls on there."',
    'Skull Shield': 'When you\'re hard-headed, you block everything with your Skull.',
    'Skull Belt': 'How else do you expect to hold up your skull pants?',
    'Skull Bow': 'Skeleton Archers ruined Dark Souls. Why not this game, too?',
    'Skull Quiver': 'Skull Quiver? I never even met \'er.',
    'Skull Sword': 'Deadly Weapon? Fearsome Fashion Accessory? Why not both?',

    // Skull Shamaness cards (placeholder text)
    'Skull Headdress': 'The ancient headdress imbued with mystical power and dark wisdom by The Ancestors.',
    'Skull Dress': 'All my Skull Baddies make it Clank Clank Clank!',
    'Skull Potion': 'You should have a sip. Just a little one. Go ahead. Here.',
    'Skull Staff': 'A staff imbued with Big Skull Energy',
    'Skull Scimitar': 'More like Skullmitar.',
    'Skull Necklace': 'Dat Skull drip.',
    'Skull Bodice': 'Layers of Skulls.',
    'Skull Bra': 'Extremely comfortable.',
    'Skull Bikini': 'You can\'t really consider yourself Goth if this isn\'t your daily driver underwear.',
    'Skull Midriff Belt': 'For when you want to accentuate your Skellybutton.',
    'Skull Bracer': 'It needs more skulls.',
    'Skull Lipstick': 'It\'s actually just Skull-Flavored Lip Gloss.',

    // Character cards
    'Skull Knight': 'The legendary Skull Knight. A warrior who has conquered death itself. Unlocks 2X Fast Forward speed.',
    'Skull Shamaness': 'The mystical Skull Shamaness. A sorceress who commands the forces of life and death. Unlocks powerful abilities.'
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
    fastForwardEnabled: false
};