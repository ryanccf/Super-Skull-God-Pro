class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }
    
    create() {
        Object.keys(DEFAULT_SAVE_DATA).forEach(key => {
            if (!this.registry.has(key)) {
                this.registry.set(key, DEFAULT_SAVE_DATA[key]);
            }
        });

        // Recalculate card bonuses based on unlocked items
        SaveDataService.recalculateCardBonuses(this.registry);

        this.scene.start('Preloader');
    }
}