import Phaser from 'phaser'
import Player from '../entities/Player'
import ChargeBar from '../hud/chargeBar'
class Play extends Phaser.Scene {

    constructor(config) {
        super('PlayScene');
        this.config = config;
    }

    create() {
        this.lightFactor = 1.2;
        this.scaledLightFactor = 0;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.canDecreaseLight = true;
        this.map = this.createMap()
        const layers = this.createLayers()
        const playerZones = this.getPlayerZones(layers.playerZones);
        this.player = this.createPlayer(playerZones.start);
        this.player.addCollider(this.player, layers.platformsColliders)
        this.createPlayerColliders({
            colliders: {
                platformsColliders: layers.platformsColliders,
            }
        })
        this.createLevelEnd(playerZones.end);
        this.setupFollowCamera();
        // setInterval(this.handleLightIncrease(), 500)
        setInterval(() => {
            this.canDecreaseLight = !this.canDecreaseLight
        }, 200)

        this.chargebar = new ChargeBar(
          this,
          this.config.width / 2,
          this.config.leftTopCorner.y,
          (this.lightFactor - 1.2) * 20
        )
    
    }

    createMap() {
        const map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });
        map.addTilesetImage('dungeon_v4', 'tiles');
        return map;
    }

    createLayers() {
        const tileset = this.map.getTileset('dungeon_v4');
        const platformsColliders = this.map.createStaticLayer('platforms_colliders', tileset)
        const platforms = this.map.createDynamicLayer('platforms', tileset)
        platformsColliders.setAlpha(0);
        platformsColliders.setCollisionByProperty({ collider: true })
        const playerZones = this.map.getObjectLayer('player_zones').objects;

        return { platforms, platformsColliders, playerZones }
    }

    createPlayer(start) {
        return new Player(this, start.x, start.y);
    }

    createPlayerColliders({ colliders }) {
        this.player.addCollider(this.player, colliders.platformsColliders)
    }

    setupFollowCamera() {
        const { Height, Width, MapOffset } = this.config;
        this.physics.world.setBounds(0, 0, Width + MapOffset, Height) + 200;
        this.cameraDolly = new Phaser.Geom.Point(this.player.x, this.player.y);
        this.cameras.main.startFollow(this.cameraDolly);
        this.cameras.main.setBounds(0, 0, Width + MapOffset, Height)
    }

    getPlayerZones(playerZonesLayer) {
        const playerZones = playerZonesLayer;
        return {
            start: playerZones.find(zone => zone.name === 'startZone'),
            end: playerZones.find(zone => zone.name === 'endZone')
        }
    }

    createLevelEnd(end) {
        const levelEnd = this.physics.add.sprite(end.x, end.y, 'end')
            .setSize(5, 200);

        const winState = this.physics.add.overlap(this.player, levelEnd, () => {
            winState.active = false;
            console.log('wins')
        })
    }


    update() {
        this.updateMap();
        this.cameraDolly.x = Math.floor(this.player.x);
        this.cameraDolly.y = Math.floor(this.player.y);

    }

    updateMap() {
        const { left, right, up, space, shift } = this.cursors;
        // chargeLight
        const lightIncreaseFactor = 0.05;
        const lightDecreaseFactor = 0.1;
        
        if (shift.isDown && !left.isDown && !right.isDown && !space.isDown && !up.isDown) {
            if (this.lightFactor < 5.2) {
                this.lightFactor += lightIncreaseFactor
                this.chargebar = new ChargeBar(
                    this,
                    this.config.width / 2,
                    this.config.leftTopCorner.y,
                    (this.lightFactor - 1.2) * 25
                    )
            }
        }

        if (this.canDecreaseLight && !shift.isDown || left.isDown || right.isDown || space.isDown || up.isDown) {
            if (this.lightFactor > 1.2) {
                this.lightFactor -= lightDecreaseFactor
                this.chargebar = new ChargeBar(
                    this,
                    this.config.width / 2,
                    this.config.leftTopCorner.y,
                    (this.lightFactor - 1.2) * 25
                    )
            }
        }

        const origin = this.map.getTileAtWorldXY(this.player.x, this.player.y);
        this.map.forEachTile(tile => {
            tile.setAlpha(0);
            const dist = Phaser.Math.Distance.Snake(
                origin.x,
                origin.y,
                tile.x,
                tile.y
            );

            tile.setAlpha(1 - (0.2 * dist / this.lightFactor));
        });
    }

}

export default Play;