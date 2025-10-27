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