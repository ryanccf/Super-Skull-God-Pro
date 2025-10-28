/**
 * CollisionManager
 * Handles all collision detection and response logic for game objects
 */
class CollisionManager {
    constructor(scene, gameObjectManager) {
        this.scene = scene;
        this.gom = gameObjectManager;  // Reference to GameObjectManager for skull array access
    }

    /**
     * Set up collision handlers for a skull
     */
    setupSkullCollisions(skullObj) {
        const skull = skullObj.sprite;

        // Basket collection
        this.gom.baskets.forEach(basket => {
            this.scene.matter.world.on('collisionstart', (event) => {
                event.pairs.forEach(pair => {
                    if ((pair.bodyA === skull.body && pair.bodyB === basket.body) ||
                        (pair.bodyB === skull.body && pair.bodyA === basket.body)) {
                        this.handleBasketCollection(skullObj, basket);
                    }
                });
            });
        });

        // Bumper collision
        this.gom.bumpers.forEach(bumper => {
            this.scene.matter.world.on('collisionstart', (event) => {
                event.pairs.forEach(pair => {
                    if ((pair.bodyA === skull.body && pair.bodyB === bumper.body) ||
                        (pair.bodyB === skull.body && pair.bodyA === bumper.body)) {
                        this.handleBumperCollision(skullObj, bumper);
                    }
                });
            });
        });

        // Flipper collision
        this.gom.flippers.forEach(flipper => {
            this.scene.matter.world.on('collisionstart', (event) => {
                event.pairs.forEach(pair => {
                    if ((pair.bodyA === skull.body && pair.bodyB === flipper.body) ||
                        (pair.bodyB === skull.body && pair.bodyA === flipper.body)) {
                        this.handleFlipperCollision(skullObj, flipper);
                    }
                });
            });
        });

        // Triangle collision (no special handling needed - natural bounce)
        // Portal, Booster, Shrinker, Duplicator are handled in update loop
    }

    /**
     * Update continuous collision checks (boosters, shrinkers, portals, duplicators)
     */
    update() {
        // Check booster overlaps
        this.gom.boosters.forEach(booster => {
            if (!booster || !booster.body) return;

            this.gom.skulls.forEach(skullObj => {
                if (!skullObj || !skullObj.sprite || !skullObj.sprite.body) return;

                const collision = this.scene.matter.overlap(skullObj.sprite.body, [booster.body]);
                if (collision) {
                    this.handleBoosterCollision(skullObj, booster);
                }
            });
        });

        // Check shrinker overlaps
        this.gom.shrinkers.forEach(shrinker => {
            if (!shrinker || !shrinker.body) return;

            this.gom.skulls.forEach(skullObj => {
                if (!skullObj || !skullObj.sprite || !skullObj.sprite.body) return;

                const collision = this.scene.matter.overlap(skullObj.sprite.body, [shrinker.body]);
                if (collision) {
                    this.handleShrinkerCollision(skullObj, shrinker);
                }
            });
        });

        // Check portal overlaps
        this.gom.portals.forEach(portal => {
            if (!portal || !portal.body) return;

            this.gom.skulls.forEach(skullObj => {
                if (!skullObj || !skullObj.sprite || !skullObj.sprite.body) return;

                const collision = this.scene.matter.overlap(skullObj.sprite.body, [portal.body]);
                if (collision) {
                    this.handlePortalCollision(skullObj, portal);
                }
            });
        });

        // Check duplicator overlaps
        this.gom.duplicators.forEach(duplicator => {
            if (!duplicator || !duplicator.body) return;

            this.gom.skulls.forEach(skullObj => {
                if (!skullObj || !skullObj.sprite || !skullObj.sprite.body) return;

                const collision = this.scene.matter.overlap(skullObj.sprite.body, [duplicator.body]);
                if (collision) {
                    this.handleDuplicatorCollision(skullObj, duplicator);
                }
            });
        });
    }

    /**
     * Handle basket collection
     */
    handleBasketCollection(skullObj, basket) {
        if (!basket || !basket.body) return;
        if (!skullObj.collectInBasket(basket)) return;

        const prestigeMultiplier = SaveDataService.getPrestigeMultiplier(this.scene.registry);
        const displayValue = skullObj.value * prestigeMultiplier;

        this.scene.events.emit('skull-collected', skullObj.value, basket.x, basket.y, displayValue);
        this.gom.removeSkull(skullObj);
    }

    /**
     * Handle bumper collision
     */
    handleBumperCollision(skullObj, bumper) {
        if (!bumper || !bumper.body) return;
        if (!skullObj.canHitBumper(bumper)) return;

        skullObj.hitBumper(bumper);
        ParticleService.createBumpEffect(this.scene, bumper.x, bumper.y);

        // Bumper animation
        this.scene.tweens.add({
            targets: bumper,
            scaleX: PHYSICS_CONFIG.SIZE.BUMPER_SCALE * 1.2,
            scaleY: PHYSICS_CONFIG.SIZE.BUMPER_SCALE * 1.2,
            duration: 100,
            yoyo: true
        });
    }

    /**
     * Handle flipper collision
     */
    handleFlipperCollision(skullObj, flipper) {
        if (!flipper || !flipper.body) return;
        if (!skullObj.canHitFlipper(flipper)) return;

        const flipperAngle = flipper.rotation;
        const forceMagnitude = 500;
        const forceAngle = flipperAngle + Math.PI / 2;
        const horizontalForce = Math.cos(forceAngle) * forceMagnitude * (flipper.scaleX > 0 ? 1 : -1);
        const verticalForce = Math.sin(forceAngle) * forceMagnitude;

        skullObj.hitFlipper(flipper, horizontalForce, verticalForce);
        ParticleService.createBurst(this.scene, flipper.x, flipper.y, { color: 0xFFFF00, count: 3 });
    }

    /**
     * Handle booster collision
     */
    handleBoosterCollision(skullObj, booster) {
        if (!booster || !booster.body) return;
        if (!skullObj || !skullObj.sprite || !skullObj.sprite.body) return;

        const boosterAngle = booster.rotation;
        const forceMagnitude = 0.025;
        const forceX = Math.cos(boosterAngle) * forceMagnitude;
        const forceY = Math.sin(boosterAngle) * forceMagnitude;

        this.scene.matter.body.applyForce(
            skullObj.sprite.body,
            { x: skullObj.sprite.x, y: skullObj.sprite.y },
            { x: forceX, y: forceY }
        );

        // Visual effect (throttled)
        if (!booster.lastEffectTime || this.scene.time.now - booster.lastEffectTime > 200) {
            ParticleService.createBurst(this.scene, booster.x, booster.y, { color: 0x00FF00, count: 4 });
            booster.lastEffectTime = this.scene.time.now;
        }
    }

    /**
     * Handle shrinker collision
     */
    handleShrinkerCollision(skullObj, shrinker) {
        if (!shrinker || !shrinker.body) return;
        if (!skullObj || !skullObj.sprite || !skullObj.sprite.body) return;

        if (!skullObj.shrinkersApplied) {
            skullObj.shrinkersApplied = new Set();
        }

        const shrinkerId = this.gom.shrinkers.indexOf(shrinker);
        if (skullObj.shrinkersApplied.has(shrinkerId)) return;

        // Stop pulsing tweens for big skulls
        if (skullObj.isBig) {
            this.scene.tweens.getTweensOf(skullObj.sprite).forEach(tween => tween.remove());
        }

        // Shrink by 10%, minimum 10%
        const currentScale = skullObj.sprite.scaleX;
        const newScale = Math.max(PHYSICS_CONFIG.SHRINKER.MIN_SCALE, currentScale * PHYSICS_CONFIG.SHRINKER.SCALE_AMOUNT);
        skullObj.sprite.setScale(newScale);

        // Restart pulsing for big skulls
        if (skullObj.isBig) {
            this.scene.tweens.add({
                targets: skullObj.sprite,
                scaleX: newScale * 1.2,
                scaleY: newScale * 1.2,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }

        skullObj.shrinkersApplied.add(shrinkerId);
        ParticleService.createBurst(this.scene, shrinker.x, shrinker.y, { color: 0xFF69B4, count: 6 });
    }

    /**
     * Handle duplicator collision
     */
    handleDuplicatorCollision(skullObj, duplicator) {
        if (!duplicator || !duplicator.body) return;
        if (!skullObj || !skullObj.sprite || !skullObj.sprite.body) return;

        if (!skullObj.duplicatorsApplied) {
            skullObj.duplicatorsApplied = new Set();
        }

        const duplicatorId = this.gom.duplicators.indexOf(duplicator);
        if (skullObj.duplicatorsApplied.has(duplicatorId)) return;

        // Create clone
        const clone = new Skull(this.scene, skullObj.sprite.x, skullObj.sprite.y, skullObj.value, skullObj.isBig);
        clone.sprite.setScale(skullObj.sprite.scaleX);

        // Clone inherits tracking sets
        if (skullObj.shrinkersApplied) {
            clone.shrinkersApplied = new Set(skullObj.shrinkersApplied);
        }
        if (skullObj.duplicatorsApplied) {
            clone.duplicatorsApplied = new Set(skullObj.duplicatorsApplied);
        } else {
            clone.duplicatorsApplied = new Set();
        }
        clone.duplicatorsApplied.add(duplicatorId);

        // Pulsing for big skull clones
        if (clone.isBig) {
            this.scene.tweens.add({
                targets: clone.sprite,
                scaleX: clone.sprite.scaleX * 1.2,
                scaleY: clone.sprite.scaleY * 1.2,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }

        this.gom.addSkull(clone);
        skullObj.duplicatorsApplied.add(duplicatorId);
        ParticleService.createBurst(this.scene, duplicator.x, duplicator.y, { color: 0x4169E1, count: 8 });
    }

    /**
     * Handle portal collision
     */
    handlePortalCollision(skullObj, portal) {
        if (!portal || !portal.body) return;
        if (!skullObj || !skullObj.sprite || !skullObj.sprite.body) return;

        // Check cooldown
        if (!skullObj.canTeleport(portal, PHYSICS_CONFIG.PORTAL.COOLDOWN)) return;

        // Find linked portal
        const linkedPortal = this.gom.portals.find(p => p !== portal && p.linkedPortal === portal);
        if (!linkedPortal) return;

        // Teleport
        skullObj.teleport(portal, linkedPortal);
        ParticleService.createBurst(this.scene, linkedPortal.x, linkedPortal.y, { color: 0xFFA500, count: 8 });
    }
}
