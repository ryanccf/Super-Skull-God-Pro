/**
 * ParticleService
 * Centralized service for creating and managing particle effects
 */
class ParticleService {
    /**
     * Create a simple white circular particle texture
     */
    static createParticleTexture(scene) {
        if (!scene.textures.exists('particle')) {
            const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
            graphics.fillStyle(0xffffff, 1);
            graphics.fillCircle(4, 4, 4);
            graphics.generateTexture('particle', 8, 8);
            graphics.destroy();
        }
    }

    /**
     * Create skull emoji texture for special effects
     */
    static createSkullEmojiTexture(scene) {
        if (!scene.textures.exists('skull_emoji')) {
            const skullText = scene.add.text(0, 0, '💀', { fontSize: '32px' });
            skullText.setOrigin(0.5);
            const renderTexture = scene.add.renderTexture(0, 0, 32, 32);
            renderTexture.draw(skullText, 16, 16);
            renderTexture.saveTexture('skull_emoji');
            renderTexture.destroy();
            skullText.destroy();
        }
    }

    /**
     * Create a burst of colored particles
     */
    static createBurst(scene, x, y, options = {}) {
        const {
            color = 0xffffff,
            count = 5,
            speed = { min: 50, max: 150 },
            lifespan = 800,
            scale = { start: 0.5, end: 0 },
            depth = UI_CONFIG.DEPTH.PARTICLES
        } = options;

        this.createParticleTexture(scene);

        const particles = [];
        for (let i = 0; i < count; i++) {
            const particle = scene.add.circle(x, y, 3, color);
            particle.setDepth(depth);
            const angle = (i / count) * Math.PI * 2;
            const velocityX = Math.cos(angle) * Phaser.Math.Between(speed.min, speed.max);
            const velocityY = Math.sin(angle) * Phaser.Math.Between(speed.min, speed.max);

            scene.tweens.add({
                targets: particle,
                x: x + velocityX,
                y: y + velocityY,
                alpha: 0,
                scaleX: 0,
                scaleY: 0,
                duration: lifespan,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
            particles.push(particle);
        }
        return particles;
    }

    /**
     * Create a particle emitter explosion
     */
    static createExplosion(scene, x, y, options = {}) {
        const {
            texture = 'particle',
            tint = [0xffffff, 0x4A90E2],
            quantity = 15,
            speed = { min: 50, max: 150 },
            lifespan = 600,
            scale = { start: 0.5, end: 0 },
            depth = UI_CONFIG.DEPTH.PARTICLES,
            duration = 700
        } = options;

        this.createParticleTexture(scene);

        if (!scene.textures.exists(texture)) {
            return null;
        }

        const emitter = scene.add.particles(x, y, texture, {
            speed: speed,
            angle: { min: 0, max: 360 },
            scale: scale,
            lifespan: lifespan,
            quantity: quantity,
            tint: tint
        });
        emitter.setDepth(depth);
        emitter.explode(quantity);

        // Auto cleanup
        scene.time.delayedCall(duration, () => {
            emitter.destroy();
        });

        return emitter;
    }

    /**
     * Create skull emoji particle explosion
     */
    static createSkullExplosion(scene, x, y, options = {}) {
        const {
            quantity = 20,
            speed = { min: 100, max: 300 },
            lifespan = 1000,
            gravityY = 200,
            depth = UI_CONFIG.DEPTH.PARTICLES,
            duration = 1200
        } = options;

        this.createSkullEmojiTexture(scene);

        const emitter = scene.add.particles(x, y, 'skull_emoji', {
            speed: speed,
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            lifespan: lifespan,
            quantity: quantity,
            gravityY: gravityY
        });
        emitter.setDepth(depth);
        emitter.explode(quantity);

        // Auto cleanup
        scene.time.delayedCall(duration, () => {
            emitter.destroy();
        });

        return emitter;
    }

    /**
     * Create edge particles for card hover effect
     */
    static createCardEdgeParticles(scene, x, y, width, height) {
        this.createParticleTexture(scene);

        const emitters = [];

        // Configuration for all edges
        const edgeConfigs = [
            // Top edge
            {
                x: x, y: y - height/2,
                angle: { min: -100, max: -80 },
                emitZone: { type: 'edge', source: new Phaser.Geom.Line(-width/2, 0, width/2, 0), quantity: 10, stepRate: 1 }
            },
            // Bottom edge
            {
                x: x, y: y + height/2,
                angle: { min: 80, max: 100 },
                emitZone: { type: 'edge', source: new Phaser.Geom.Line(-width/2, 0, width/2, 0), quantity: 10, stepRate: 1 }
            },
            // Left edge
            {
                x: x - width/2, y: y,
                angle: { min: 170, max: 190 },
                emitZone: { type: 'edge', source: new Phaser.Geom.Line(0, -height/2, 0, height/2), quantity: 10, stepRate: 1 }
            },
            // Right edge
            {
                x: x + width/2, y: y,
                angle: { min: -10, max: 10 },
                emitZone: { type: 'edge', source: new Phaser.Geom.Line(0, -height/2, 0, height/2), quantity: 10, stepRate: 1 }
            }
        ];

        edgeConfigs.forEach(config => {
            const emitter = scene.add.particles(config.x, config.y, 'particle', {
                speed: { min: 20, max: 40 },
                angle: config.angle,
                scale: { start: 0.3, end: 0 },
                lifespan: 500,
                frequency: 30,
                tint: [0xffffff, 0x4A90E2],
                emitZone: config.emitZone
            });
            emitters.push(emitter);
        });

        return emitters;
    }

    /**
     * Stop and destroy card edge particles
     */
    static stopCardEdgeParticles(scene, emitters) {
        if (emitters) {
            emitters.forEach(emitter => {
                emitter.stop();
                scene.time.delayedCall(600, () => emitter.destroy());
            });
        }
    }

    /**
     * Create collection particle effect (for basket collection)
     */
    static createCollectionEffect(scene, x, y, color = COLORS.SOFT_PINK) {
        return this.createBurst(scene, x, y, {
            color: color,
            count: 8,
            speed: { min: 50, max: 120 },
            lifespan: 600
        });
    }

    /**
     * Create bump particle effect (for bumper collision)
     */
    static createBumpEffect(scene, x, y) {
        return this.createBurst(scene, x, y, {
            color: 0xFFFFFF,
            count: 5,
            speed: { min: 30, max: 80 },
            lifespan: 400
        });
    }
}
