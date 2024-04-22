import Phaser from 'phaser'

class Preload extends Phaser.Scene {

    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.image('tiles', 'assets/dungeon_v4.png');
        this.load.tilemapTiledJSON('map', 'assets/dungeon_world_map.json');
        this.load.spritesheet('player', 'assets/player-movement.png', {
            frameWidth: 54,
            frameHeight: 128,
            spacing: 74        })

    }

    create() {
        this.scene.start('PlayScene')
    }
}

export default Preload;