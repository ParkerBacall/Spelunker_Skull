import Phaser from 'phaser';
import initAnimations from './playerAnims'

import collidable from '../mixins/collidable';

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Mixins
        Object.assign(this, collidable)

        this.init();
    }
    init() {
        this.gravity = 500;
        this.playerSpeed = 200;

        this.cursors = this.scene.input = this.scene.input.keyboard.createCursorKeys();

        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.initEvents()
        initAnimations(this.scene.anims)

    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    }

    update() {
        const { left, right, space, up } = this.cursors;
        const onFloor = this.body.onFloor();
        if (left.isDown) {
            this.setFlipX(true);
            this.setVelocityX(-this.playerSpeed);
        } else if (right.isDown) {
            this.setVelocityX(this.playerSpeed);
            this.setFlipX(false);

        } else {
            this.setVelocityX(0);
        }

        if ((space.isDown || up.isDown) && onFloor) {
            this.setVelocityY(-this.playerSpeed * 1.5)
        }

        onFloor ?
            this.body.velocity.x !== 0 ?
                this.play('run', true) : this.play('idle', true) :
            this.play('jump', true)

    }

}

export default Player;