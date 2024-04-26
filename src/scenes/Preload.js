import Phaser from 'phaser'

class Preload extends Phaser.Scene {

    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.image('tiles', 'assets/dungeon_v7.png');
        this.load.tilemapTiledJSON('map', 'assets/dungeon_world_map.json');
        this.load.spritesheet('player', 'assets/player-moveset.png', {
            frameWidth: 30,
            frameHeight: 64,
            spacing: 34        
        })
        this.load.image('bolt', 'assets/bolt.png')
        this.load.audio('beepboop', 'assets/beepboop.wav')
        this.load.audio('jump', 'assets/jump.wav')
        this.load.audio('win', 'assets/win.wav')
        this.load.audio('powerUp', 'assets/powerUp.wav')
        this.load.audio('die', 'assets/die.wav')
    }


    create() {
        this.scene.start('PlayScene')
    }
}

export default Preload;