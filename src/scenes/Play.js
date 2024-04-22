import Phaser from 'phaser'
import Player from '../entities/Player'
class Play extends Phaser.Scene {

    constructor(config) {
        super('PlayScene');
        this.config = config;
    }

    create() {
        this.map = this.createMap()
        const layers = this.createLayers()
        this.player = this.createPlayer();
        this.player.addCollider(this.player, layers.platformsColliders)
        this.createPlayerColliders(this.player, {
            colliders: {
                platformsColliders: layers.platformsColliders,
            }
        })
        this.setupFollowCamera();
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

        console.log(playerZones)

        return { platforms, platformsColliders }
    }

    createPlayer() {
        return new Player(this, 100, 250);
    }

    update() {
        this.updateMap();
        this.cameraDolly.x = Math.floor(this.player.x);
        this.cameraDolly.y = Math.floor(this.player.y);
    
    }

    updateMap() {
        const origin = this.map.getTileAtWorldXY(this.player.x, this.player.y);
        this.map.forEachTile(tile => {

            tile.setAlpha(0);

            const dist = Phaser.Math.Distance.Snake(
                origin.x,
                origin.y,
                tile.x,
                tile.y
            );

            tile.setAlpha(1 - (0.1 * dist / 1.5));
        });
    }

    createPlayerColliders(player, {colliders}){
        this.player.addCollider(player, colliders.platformsColliders)
    }

    setupFollowCamera() {
        const { Height, Width, MapOffset} = this.config;
        this.physics.world.setBounds(0, 0, Width + MapOffset, Height) + 200;
        this.cameraDolly = new Phaser.Geom.Point(this.player.x, this.player.y);
        this.cameras.main.startFollow(this.cameraDolly);
        this.cameras.main.setBounds(0, 0, Width + MapOffset, Height)
    }


}

export default Play;