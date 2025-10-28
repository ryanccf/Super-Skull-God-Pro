const PHYSICS_CONFIG = {
    // Collision categories (using bit flags)
    CATEGORIES: {
        SKULL: 0x0001,
        BASKET: 0x0002,
        BUMPER: 0x0004,
        FLIPPER: 0x0008,
        TRIANGLE: 0x0010,
        BOOSTER: 0x0020,
        SHRINKER: 0x0040,
        PORTAL: 0x0080,
        DUPLICATOR: 0x0100,
        WALL: 0x0200
    },

    // Bounciness values
    RESTITUTION: {
        SKULL: 0.6,
        BUMPER: 1.0,
        BASKET: 0.3,
        FLIPPER: 0.8,
        TRIANGLE: 0.8,
        WALL: 0.4
    },

    // Friction values
    FRICTION: {
        SKULL: 0.001,
        BASKET: 0.1,
        DEFAULT: 0.001
    },

    // Force multipliers
    FORCE: {
        FLIPPER: 0.02,
        TRIANGLE: 0.015,
        BUMPER: 0.2,
        BOOSTER_SPEED: 10,
        SKULL_CLICK: -8,
        BIG_SKULL_BOUNCE: 2
    },

    // Size and scale
    SIZE: {
        SKULL_RADIUS: 16,
        BIG_SKULL_RADIUS: 24,
        BASKET_SCALE: 0.2,
        BUMPER_SCALE: 0.2,
        FLIPPER_SCALE: 0.6,
        TRIANGLE_SCALE: 0.3,
        BOOSTER_SCALE: 0.3,
        SHRINKER_SCALE: 0.3,
        PORTAL_SCALE: 0.3,
        DUPLICATOR_SCALE: 0.3
    },

    // Spawn parameters
    SPAWN: {
        INITIAL_SKULLS: 2,
        BIG_SKULL_COUNT: 100,
        SPAWN_INTERVAL: 1000,
        SPAWN_AREA: {
            MIN_X: 100,
            MAX_X: GAME_CONFIG.PLAY_AREA_WIDTH - 100,
            Y: 50
        }
    },

    // Portal cooldown
    PORTAL: {
        COOLDOWN: 500
    },

    // Shrinker parameters
    SHRINKER: {
        SCALE_AMOUNT: 0.9,
        MIN_SCALE: 0.3,
        COOLDOWN: 500
    },

    // Duplicator parameters
    DUPLICATOR: {
        MAX_DUPES: 3,
        OFFSET: 20
    }
};
