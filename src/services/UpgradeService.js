/**
 * UpgradeService
 * Centralized service for upgrade cost calculations and purchase logic
 */
class UpgradeService {
    /**
     * Calculate upgrade cost based on level
     */
    static calculateCost(basePrice, level, multiplier = 1.6) {
        return Math.floor(basePrice * Math.pow(multiplier, level));
    }

    /**
     * Get upgrade configuration for all upgrades
     */
    static getUpgradeConfigs(registry) {
        const totalSkulls = SaveDataService.getTotalSkulls(registry);

        return {
            maxSkull: {
                name: 'Max Skulls',
                basePrice: 10,
                multiplier: 1.6,
                registryKey: 'upgrade',
                level: SaveDataService.getUpgradeLevel(registry, 'upgrade'),
                description: 'Increase max skulls on screen',
                getValue: (level) => 10 + level,
                onPurchase: (registry, level) => {
                    SaveDataService.setMaxSkulls(registry, 10 + level);
                }
            },
            gameTime: {
                name: 'Game Time',
                basePrice: 25,
                multiplier: 1.8,
                registryKey: 'timer',
                level: SaveDataService.getUpgradeLevel(registry, 'timer'),
                description: 'Increase round duration',
                getValue: (level) => `${10 + (level * 2)}s`,
                onPurchase: (registry, level) => {
                    SaveDataService.setGameTime(registry, 10 + (level * 2));
                }
            },
            basket: {
                name: 'Basket',
                basePrice: 50,
                multiplier: 1.7,
                registryKey: 'basket',
                level: SaveDataService.getUpgradeLevel(registry, 'basket'),
                maxLevel: 10,
                description: 'Add a skull basket',
                getValue: (level) => {
                    if (level === 0) return '';
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    return `${baskets.length}/${level}`;
                },
                canPurchase: (registry) => {
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    return PositionManager.findBasketPosition(baskets, bumpers, flippers, triangles) !== null;
                },
                onPurchase: (registry, level) => {
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    const newPosition = PositionManager.findBasketPosition(baskets, bumpers, flippers, triangles);
                    if (newPosition) {
                        baskets.push(newPosition);
                        registry.set('baskets', baskets);
                    }
                },
                needsPlacement: true
            },
            bumper: {
                name: 'Bumper',
                basePrice: 25,
                multiplier: 1.7,
                registryKey: 'bumper',
                level: SaveDataService.getUpgradeLevel(registry, 'bumper'),
                maxLevel: 15,
                description: 'Add a bumper',
                getValue: (level) => {
                    if (level === 0) return '';
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    return `${bumpers.length}/${level}`;
                },
                canPurchase: (registry) => {
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    return PositionManager.findBumperPosition(bumpers, baskets, flippers, triangles) !== null;
                },
                onPurchase: (registry, level) => {
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    const newPosition = PositionManager.findBumperPosition(bumpers, baskets, flippers, triangles);
                    if (newPosition) {
                        bumpers.push(newPosition);
                        registry.set('bumpers', bumpers);
                    }
                },
                needsPlacement: true
            },
            flipper: {
                name: 'Flipper',
                basePrice: 20,
                multiplier: 1.5,
                registryKey: 'flipper',
                level: SaveDataService.getUpgradeLevel(registry, 'flipper'),
                maxLevel: 10,
                description: 'Add a flipper',
                getValue: (level) => {
                    if (level === 0) return '';
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    return `${flippers.length}/${level}`;
                },
                canPurchase: (registry) => {
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    return PositionManager.findFlipperPosition(flippers, baskets, bumpers, triangles) !== null;
                },
                onPurchase: (registry, level) => {
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    const newPosition = PositionManager.findFlipperPosition(flippers, baskets, bumpers, triangles);
                    if (newPosition) {
                        const facingLeft = flippers.length % 2 === 0;
                        newPosition.facingLeft = facingLeft;
                        newPosition.angle = facingLeft ? 30 : -30;
                        flippers.push(newPosition);
                        registry.set('flippers', flippers);
                    }
                },
                needsPlacement: true
            },
            triangle: {
                name: 'Board',
                basePrice: 10,
                multiplier: 1.5,
                registryKey: 'triangle',
                level: SaveDataService.getUpgradeLevel(registry, 'triangle'),
                maxLevel: 10,
                description: 'Add a board',
                getValue: (level) => {
                    if (level === 0) return '';
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    return `${triangles.length}/${level}`;
                },
                canPurchase: (registry) => {
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    return PositionManager.findTrianglePosition(triangles, baskets, bumpers, flippers) !== null;
                },
                onPurchase: (registry, level) => {
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    const newPosition = PositionManager.findTrianglePosition(triangles, baskets, bumpers, flippers);
                    if (newPosition) {
                        newPosition.angle = 0;
                        triangles.push(newPosition);
                        registry.set('triangles', triangles);
                    }
                },
                needsPlacement: true
            },
            booster: {
                name: 'Booster',
                basePrice: 10,
                multiplier: 1.5,
                registryKey: 'booster',
                level: SaveDataService.getUpgradeLevel(registry, 'booster'),
                maxLevel: 6,
                description: 'Add a speed booster',
                getValue: (level) => {
                    if (level === 0) return '';
                    const boosters = SaveDataService.getGameObjects(registry, 'boosters');
                    return `${boosters.length}/${level}`;
                },
                canPurchase: (registry) => {
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    const boosters = SaveDataService.getGameObjects(registry, 'boosters');
                    return PositionManager.findBoosterPosition(boosters, baskets, bumpers, flippers, triangles) !== null;
                },
                onPurchase: (registry, level) => {
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    const boosters = SaveDataService.getGameObjects(registry, 'boosters');
                    const newPosition = PositionManager.findBoosterPosition(boosters, baskets, bumpers, flippers, triangles);
                    if (newPosition) {
                        newPosition.angle = 0;
                        boosters.push(newPosition);
                        registry.set('boosters', boosters);
                    }
                },
                needsPlacement: true
            },
            shrinker: {
                name: 'Shrinker',
                basePrice: 15,
                multiplier: 1.5,
                registryKey: 'shrinker',
                level: SaveDataService.getUpgradeLevel(registry, 'shrinker'),
                maxLevel: 6,
                description: 'Add a skull shrinker',
                getValue: (level) => {
                    if (level === 0) return '';
                    const shrinkers = SaveDataService.getGameObjects(registry, 'shrinkers');
                    return `${shrinkers.length}/${level}`;
                },
                canPurchase: (registry) => {
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    const shrinkers = SaveDataService.getGameObjects(registry, 'shrinkers');
                    return PositionManager.findShrinkerPosition(shrinkers, baskets, bumpers, flippers, triangles) !== null;
                },
                onPurchase: (registry, level) => {
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    const shrinkers = SaveDataService.getGameObjects(registry, 'shrinkers');
                    const newPosition = PositionManager.findShrinkerPosition(shrinkers, baskets, bumpers, flippers, triangles);
                    if (newPosition) {
                        shrinkers.push(newPosition);
                        registry.set('shrinkers', shrinkers);
                    }
                },
                needsPlacement: true
            },
            portal: {
                name: 'Portal',
                basePrice: 500,
                multiplier: 1.5,
                registryKey: 'portal',
                level: SaveDataService.getUpgradeLevel(registry, 'portal'),
                maxLevel: 4,
                description: 'Add a portal pair',
                getValue: (level) => {
                    if (level === 0) return '';
                    const portals = SaveDataService.getGameObjects(registry, 'portals');
                    return `${portals.length/2}/${level}`;
                },
                canPurchase: (registry) => {
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    const portals = SaveDataService.getGameObjects(registry, 'portals');
                    return PositionManager.findPortalPosition(portals, baskets, bumpers, flippers, triangles) !== null;
                },
                onPurchase: (registry, level) => {
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    const portals = SaveDataService.getGameObjects(registry, 'portals');
                    const newPosition = PositionManager.findPortalPosition(portals, baskets, bumpers, flippers, triangles);
                    if (newPosition) {
                        portals.push({ x: newPosition.x - 10, y: newPosition.y, color: 'blue' });
                        portals.push({ x: newPosition.x + 10, y: newPosition.y, color: 'orange' });
                        registry.set('portals', portals);
                    }
                },
                needsPlacement: true
            },
            duplicator: {
                name: 'Duplicator',
                basePrice: 1000,
                multiplier: 1.5,
                registryKey: 'duplicator',
                level: SaveDataService.getUpgradeLevel(registry, 'duplicator'),
                maxLevel: 3,
                description: 'Add a skull duplicator',
                getValue: (level) => {
                    if (level === 0) return '';
                    const duplicators = SaveDataService.getGameObjects(registry, 'duplicators');
                    const maxDuplicators = registry.get('maxDuplicators') || 3;
                    return `${duplicators.length}/${maxDuplicators}`;
                },
                canPurchase: (registry) => {
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    const duplicators = SaveDataService.getGameObjects(registry, 'duplicators');
                    const maxDuplicators = registry.get('maxDuplicators') || 3;
                    return duplicators.length < maxDuplicators &&
                           PositionManager.findDuplicatorPosition(duplicators, baskets, bumpers, flippers, triangles) !== null;
                },
                onPurchase: (registry, level) => {
                    const baskets = SaveDataService.getGameObjects(registry, 'baskets');
                    const bumpers = SaveDataService.getGameObjects(registry, 'bumpers');
                    const flippers = SaveDataService.getGameObjects(registry, 'flippers');
                    const triangles = SaveDataService.getGameObjects(registry, 'triangles');
                    const duplicators = SaveDataService.getGameObjects(registry, 'duplicators');
                    const newPosition = PositionManager.findDuplicatorPosition(duplicators, baskets, bumpers, flippers, triangles);
                    if (newPosition) {
                        duplicators.push(newPosition);
                        registry.set('duplicators', duplicators);
                    }
                },
                needsPlacement: true
            },
            autoStart: {
                name: 'Auto-Start',
                basePrice: 100,
                registryKey: 'autoStart',
                level: SaveDataService.getAutoStartLevel(registry),
                maxLevel: 9,
                description: 'Auto-restart rounds',
                getValue: (level) => {
                    const unlocked = SaveDataService.getAutoStartUnlocked(registry);
                    if (!unlocked) return '';
                    const delay = Math.max(1, 10 - level);
                    return `${delay}s delay`;
                },
                canPurchase: (registry) => {
                    const unlocked = SaveDataService.getAutoStartUnlocked(registry);
                    const level = SaveDataService.getAutoStartLevel(registry);
                    return !unlocked || level < 9;
                },
                onPurchase: (registry, level) => {
                    const unlocked = SaveDataService.getAutoStartUnlocked(registry);
                    if (!unlocked) {
                        // First purchase: unlock the feature
                        SaveDataService.setAutoStartUnlocked(registry, true);
                    } else {
                        // Subsequent purchases: increment level
                        const currentLevel = SaveDataService.getAutoStartLevel(registry);
                        SaveDataService.setAutoStartLevel(registry, currentLevel + 1);
                    }
                }
            },
            prestige: {
                name: 'Prestige',
                basePrice: 1000000,
                registryKey: 'prestige',
                level: SaveDataService.getPrestigeLevel(registry),
                multiplier: 2,
                description: '2X Skull Value, +1 Max Duplicators, Resets All (Upgrades, Items, Cards)',
                getValue: (level) => {
                    const multiplier = Math.pow(2, level);
                    return `${multiplier}X Value`;
                },
                onPurchase: (registry, level, scene) => {
                    // Increase prestige level and multiplier
                    SaveDataService.setPrestigeLevel(registry, level);
                    SaveDataService.setPrestigeMultiplier(registry, Math.pow(2, level));

                    // Increase max duplicators (+1 per prestige)
                    const currentMaxDupes = registry.get('maxDuplicators') || 3;
                    registry.set('maxDuplicators', currentMaxDupes + 1);

                    // Reset all progress except prestige and maxDuplicators
                    registry.set('totalSkulls', 200);
                    registry.set('maxSkulls', 10);
                    registry.set('upgradeLevel', 0);
                    registry.set('basketLevel', 0);
                    registry.set('timerLevel', 0);
                    registry.set('bumperLevel', 0);
                    registry.set('flipperLevel', 0);
                    registry.set('triangleLevel', 0);
                    registry.set('boosterLevel', 0);
                    registry.set('shrinkerLevel', 0);
                    registry.set('portalLevel', 0);
                    registry.set('duplicatorLevel', 0);
                    registry.set('gameTime', 10);
                    registry.set('baskets', []);
                    registry.set('bumpers', []);
                    registry.set('flippers', []);
                    registry.set('triangles', []);
                    registry.set('boosters', []);
                    registry.set('shrinkers', []);
                    registry.set('portals', []);
                    registry.set('duplicators', []);
                    registry.set('highscore', 0);
                    registry.set('autoStartUnlocked', false);
                    registry.set('autoStartLevel', 0);
                    registry.set('autoStartEnabled', false);
                    registry.set('fastForwardEnabled', false);

                    // Reset all unlocked cards
                    registry.set('unlockedItems', []);

                    // Reset card bonuses
                    registry.set('bumperMaxMultiplier', 4);
                    registry.set('cardBonusGameTime', 0);
                    registry.set('cardBonusMaxSkulls', 0);
                    registry.set('cardBonusFlipperAddition', 0);

                    // Set flag to show prestige screen
                    registry.set('justPrestiged', true);
                }
            }
        };
    }

    /**
     * Purchase an upgrade
     */
    static purchaseUpgrade(registry, upgradeType, config) {
        // Special cost calculation for auto-start
        let cost;
        if (upgradeType === 'autoStart') {
            const unlocked = SaveDataService.getAutoStartUnlocked(registry);
            cost = unlocked ? 200 : 100;
        } else {
            const multiplier = config.multiplier || 1.6;
            cost = this.calculateCost(config.basePrice, config.level, multiplier);
        }

        if (!SaveDataService.canAfford(registry, cost)) {
            return { success: false, reason: 'insufficient_funds' };
        }

        if (config.maxLevel && config.level >= config.maxLevel) {
            return { success: false, reason: 'max_level' };
        }

        if (config.canPurchase && !config.canPurchase(registry)) {
            return { success: false, reason: 'needs_placement' };
        }

        // Deduct cost
        SaveDataService.subtractSkulls(registry, cost);

        // Increment level using the correct registry key (skip for auto-start - it handles its own logic)
        if (upgradeType !== 'autoStart') {
            const registryKey = config.registryKey || upgradeType;
            SaveDataService.incrementUpgradeLevel(registry, registryKey);
        }

        // Call onPurchase callback if exists
        if (config.onPurchase) {
            config.onPurchase(registry, config.level + 1);
        }

        return { success: true, newLevel: config.level + 1 };
    }

    /**
     * Check if an upgrade can be purchased
     */
    static canPurchaseUpgrade(registry, config, upgradeType) {
        // Special cost calculation for auto-start
        let cost;
        if (upgradeType === 'autoStart') {
            const unlocked = SaveDataService.getAutoStartUnlocked(registry);
            cost = unlocked ? 200 : 100;
        } else {
            const multiplier = config.multiplier || 1.6;
            cost = this.calculateCost(config.basePrice, config.level, multiplier);
        }

        if (!SaveDataService.canAfford(registry, cost)) {
            return false;
        }

        if (config.maxLevel && config.level >= config.maxLevel) {
            return false;
        }

        if (config.unlockRequirement && !config.unlockRequirement()) {
            return false;
        }

        if (config.canPurchase && !config.canPurchase(registry)) {
            return false;
        }

        return true;
    }
}
