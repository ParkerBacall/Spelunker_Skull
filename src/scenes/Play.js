import Phaser from 'phaser'
import Player from '../entities/Player'
import ChargeBar from '../hud/chargeBar'
import initAnimations from '../entities/playerAnims'

class Play extends Phaser.Scene {

    constructor(config) {
        super('PlayScene');
        this.config = config;
    }

    create() {
        this.isDead = false;
        this.soundTrack = this.sound.add('beepboop', { volume: 0.7, loop: true });
        this.soundTrack.stop();

        if (!this.soundTrack.isPlaying) {
            this.soundTrack.play();
        }
        this.winSound = this.sound.add('win');
        this.powerUpSound = this.sound.add('powerUp');
        this.dieSound = this.sound.add('die');
        initAnimations(this.anims);

        this.lightPercent = 0
        this.maxLightPercent = 0;
        this.lightFactor = 1.2;
        this.maxLightFactor = 1.2
        this.collectedPowerUps = []
        this.map = this.createMap()
        this.layers = this.createLayers()
        this.playerZones = this.getPlayerZones(this.layers.playerZones);
        this.player = this.createPlayer(this.playerZones.start);
        this.player.addCollider(this.player, this.layers.platformsColliders)
        this.createPlayerColliders({
            colliders: {
                platformsColliders: this.layers.platformsColliders,
            }
        })
        this.createKillZones(this.playerZones.kill);
        this.createLevelEnd(this.playerZones.end);
        this.createPowerUps(this.playerZones.powerUp);

        this.setupFollowCamera();

        // init charge bar
        this.chargebar = new ChargeBar(
            this,
            this.config.leftBottomCorner.x,
            this.config.leftBottomCorner.y,
            this.lightPercent
        )
    }

    createMap() {
        const map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });
        map.addTilesetImage('dungeon_v7', 'tiles');

        return map;
    }

    createLayers() {
        const tileset = this.map.getTileset('dungeon_v7');
        const platformsColliders = this.map.createLayer('platforms_colliders', tileset)
        const platforms = this.map.createLayer('platforms', tileset, 0, 0)
        const gameObjects = this.map.createLayer('game_objects', tileset, 0, 0)

        platformsColliders.setAlpha(0);
        platformsColliders.setCollisionByProperty({ is_collider: true })

        const playerZones = this.map.getObjectLayer('player_zones').objects;

        return { platforms, platformsColliders, gameObjects, playerZones }
    }

    createPlayer(start) {
        return new Player(this, start.x, start.y, { isDead: false });
    }

    createPlayerColliders({ colliders }) {
        this.player.addCollider(this.player, colliders.platformsColliders)
    }

    setupFollowCamera() {
        const { Height, Width, MapOffset, zoomFactor } = this.config;
        this.physics.world.setBounds(0, 0, Width + MapOffset, Height) + 200;
        this.cameraDolly = new Phaser.Geom.Point(this.player.x, this.player.y);
        this.cameras.main.startFollow(this.cameraDolly);
        this.cameras.main.setBounds(0, 0, Width + MapOffset, Height).setZoom(zoomFactor);
    }

    getPlayerZones(playerZonesLayer) {
        const playerZones = playerZonesLayer;
        return {
            start: playerZones.find(zone => zone.name === 'startZone'),
            end: playerZones.find(zone => zone.name === 'endZone'),
            kill: playerZones.filter(zone => zone.name === 'killZone'),
            powerUp: playerZones.filter(zone => zone.name === 'powerUp'),
        }
    }

    createPowerUps(powerUps) {
        powerUps.forEach(powerUp => {
            const powerUpSprite = this.physics.add.sprite(powerUp.x, powerUp.y, 'bolt')
                .setSize(10, 10)
                .setOrigin(0.8, 0.5)

            const collectPowerUp = this.physics.add.overlap(this.player, powerUpSprite, () => {
                this.maxLightPercent += 25;
                setInterval(() => {
                    if (this.lightPercent < this.maxLightPercent) {
                        this.lightPercent += 1;
                        this.chargebar = new ChargeBar(
                            this,
                            this.config.leftBottomCorner.x,
                            this.config.leftBottomCorner.y,
                            this.lightPercent
                        )
                    } else {
                        return
                    }
                }, 50)


                this.maxLightFactor += 1;
                setInterval(() => {
                    if (this.lightFactor < this.maxLightFactor) {
                        this.lightFactor += 0.1;

                    } else {
                        return
                    }
                }, 60)
                collectPowerUp.active = false;
                powerUpSprite.visible = false;
                this.collectedPowerUps.push(powerUp.id)
                this.powerUpSound.play();

            })
        });
    }

    createKillZones(killZones) {
        killZones.forEach(killZone => {
            const killZoneSprite = this.physics.add.sprite(killZone.x, killZone.y)
                .setOrigin(-0.5, -0.2)
                .setSize(killZone.width, killZone.height)
            const die = this.physics.add.overlap(this.player, killZoneSprite, () => {
                this.soundTrack.stop();
                die.active = false;
                this.dieSound.play();
                this.physics.pause();
                this.player.isDead = true;
                this.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        this.dieSound.stop();
                        this.scene.restart();
                    },
                    loop: false
                })
            });
        });
    }


    createLevelEnd(end) {
        const levelEnd = this.physics.add.sprite(end.x, end.y)
            .setSize(10, 10)

        const winState = this.physics.add.overlap(this.player, levelEnd, () => {
            winState.active = false;
            this.soundTrack.stop()
            this.physics.pause();
            this.winSound.play();
            this.player.isDead = true;
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.winSound.stop();
                    this.scene.restart();
                },
                loop: false
            })
        })
    }


    update() {
        this.cameraDolly.x = Math.floor(this.player.x);
        this.cameraDolly.y = Math.floor(this.player.y);
        this.setLayerLighting(this.layers.platforms, this.player, this.lightFactor, false);
        this.setLayerLighting(this.layers.gameObjects, this.player, this.lightFactor, false);
        this.updatePowerUps(this.playerZones.powerUp)
    }

    updatePowerUps(powerUps) {
        powerUps.forEach(powerUp => {
            if (!this.collectedPowerUps.includes(powerUp.id)) {
                this.setLayerLighting(this.layers.platforms, powerUp, 0.7, true);
                this.setLayerLighting(this.layers.gameObjects, powerUp, 0.7, true);
            }
        })
    }

    setLayerLighting(layer, object, lightFactor, preserveAlpha) {
        const origin = layer.getTileAtWorldXY(object.x, object.y, true);
        layer.forEachTile(tile => {
            if (!preserveAlpha) {
                tile.setAlpha(0);
            }

            const dist = Phaser.Math.Distance.Snake(
                origin.x,
                origin.y,
                tile.x,
                tile.y
            );

            if (tile.alpha === 0) {
                tile.setAlpha(1 - (0.2 * dist / lightFactor));
            }
        });

    }

}

export default Play;