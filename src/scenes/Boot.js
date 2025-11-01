class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Load the Quintuple A Games logo for the loading screen
        this.load.image('quintuple_a_logo', 'src/assets/images/logos/QuintupleALogo.png');
        // Load the inverted logo for main menu
        this.load.image('quintuple_a_logo_inverted', 'src/assets/images/logos/QuintupleALogoWhite.png');
    }

    create() {
        // Try to load saved game, if not found use defaults
        const loaded = SaveDataService.loadGame(this.registry);

        if (!loaded) {
            // No save found, initialize with defaults
            Object.keys(DEFAULT_SAVE_DATA).forEach(key => {
                if (!this.registry.has(key)) {
                    this.registry.set(key, DEFAULT_SAVE_DATA[key]);
                }
            });
        }

        // Recalculate card bonuses based on unlocked items
        SaveDataService.recalculateCardBonuses(this.registry);

        this.scene.start('Preloader');
    }
}