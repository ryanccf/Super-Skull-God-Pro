/**
 * SaveDataService
 * Centralized service for managing game save data through Phaser's registry
 */
class SaveDataService {
    /**
     * Initialize registry with default values
     */
    static initializeRegistry(registry) {
        Object.entries(DEFAULT_SAVE_DATA).forEach(([key, value]) => {
            if (!registry.has(key)) {
                registry.set(key, value);
            }
        });
    }

    // ===== Currency Management =====

    static getTotalSkulls(registry) {
        return registry.get('totalSkulls') || 0;
    }

    static setTotalSkulls(registry, value) {
        registry.set('totalSkulls', Math.max(0, value));
    }

    static addSkulls(registry, amount) {
        const current = this.getTotalSkulls(registry);
        this.setTotalSkulls(registry, current + amount);
    }

    static subtractSkulls(registry, amount) {
        const current = this.getTotalSkulls(registry);
        this.setTotalSkulls(registry, current - amount);
    }

    static canAfford(registry, cost) {
        return this.getTotalSkulls(registry) >= cost;
    }

    // ===== Game Settings =====

    static getMaxSkulls(registry) {
        return registry.get('maxSkulls') || 10;
    }

    static setMaxSkulls(registry, value) {
        registry.set('maxSkulls', value);
    }

    static getGameTime(registry) {
        return registry.get('gameTime') || 10;
    }

    static setGameTime(registry, value) {
        registry.set('gameTime', value);
    }

    static getHighscore(registry) {
        return registry.get('highscore') || 0;
    }

    static setHighscore(registry, value) {
        const current = this.getHighscore(registry);
        if (value > current) {
            registry.set('highscore', value);
        }
    }

    // ===== Upgrade Levels =====

    static getUpgradeLevel(registry, upgradeType) {
        return registry.get(`${upgradeType}Level`) || 0;
    }

    static setUpgradeLevel(registry, upgradeType, value) {
        registry.set(`${upgradeType}Level`, value);
    }

    static incrementUpgradeLevel(registry, upgradeType) {
        const current = this.getUpgradeLevel(registry, upgradeType);
        this.setUpgradeLevel(registry, upgradeType, current + 1);
    }

    // ===== Game Objects =====

    static getGameObjects(registry, objectType) {
        return registry.get(objectType) || [];
    }

    static setGameObjects(registry, objectType, objects) {
        registry.set(objectType, objects);
    }

    static addGameObject(registry, objectType, object) {
        const objects = this.getGameObjects(registry, objectType);
        objects.push(object);
        this.setGameObjects(registry, objectType, objects);
    }

    // ===== Unlockables =====

    static getUnlockedItems(registry) {
        return registry.get('unlockedItems') || [];
    }

    static setUnlockedItems(registry, items) {
        registry.set('unlockedItems', items);
    }

    static unlockItem(registry, itemName) {
        const unlockedItems = this.getUnlockedItems(registry);
        if (!unlockedItems.includes(itemName)) {
            unlockedItems.push(itemName);
            this.setUnlockedItems(registry, unlockedItems);
        }
    }

    static isItemUnlocked(registry, itemName) {
        return this.getUnlockedItems(registry).includes(itemName);
    }

    static isCharacterUnlocked(registry, characterName) {
        const unlockedItems = this.getUnlockedItems(registry);
        const requiredItems = CHARACTER_UNLOCKABLES[characterName];
        return requiredItems.every(item => unlockedItems.includes(item));
    }

    // ===== Auto-Start Feature =====

    static getAutoStartUnlocked(registry) {
        return registry.get('autoStartUnlocked') || false;
    }

    static setAutoStartUnlocked(registry, value) {
        registry.set('autoStartUnlocked', value);
    }

    static getAutoStartEnabled(registry) {
        return registry.get('autoStartEnabled') || false;
    }

    static setAutoStartEnabled(registry, value) {
        registry.set('autoStartEnabled', value);
    }

    static getAutoStartLevel(registry) {
        return registry.get('autoStartLevel') || 0;
    }

    static setAutoStartLevel(registry, value) {
        registry.set('autoStartLevel', value);
    }

    static getAutoStartRemainingTime(registry) {
        return registry.get('autoStartRemainingTime') || 0;
    }

    static setAutoStartRemainingTime(registry, value) {
        registry.set('autoStartRemainingTime', value);
    }

    // ===== Fast Forward =====

    static getFastForwardEnabled(registry) {
        return registry.get('fastForwardEnabled') || false;
    }

    static setFastForwardEnabled(registry, value) {
        registry.set('fastForwardEnabled', value);
    }

    // ===== Prestige System =====

    static getPrestigeLevel(registry) {
        return registry.get('prestigeLevel') || 0;
    }

    static setPrestigeLevel(registry, value) {
        registry.set('prestigeLevel', value);
    }

    static getPrestigeMultiplier(registry) {
        return registry.get('prestigeMultiplier') || 1;
    }

    static setPrestigeMultiplier(registry, value) {
        registry.set('prestigeMultiplier', value);
    }
}
