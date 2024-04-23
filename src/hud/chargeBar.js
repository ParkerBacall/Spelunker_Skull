
import Phaser from 'phaser';


class ChargeBar {

    constructor(scene, x, y, charge) {
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.setScrollFactor(0, 0);
        this.x = x;
        this.y = y;
        this.value = charge;

        this.size = {
            width: 100,
            height: 8
        }

        this.pixelPerCharge = this.size.width / this.value;

        scene.add.existing(this.bar);
        this.draw(x, y)
    }

    draw(x, y) {

        this.bar.clear();
        const { width, height } = this.size;

        const margin = 2;

        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRect(x, y, width + margin, height + margin);

        this.bar.fillStyle(0xEFFF200);
        this.bar.fillRect(x + margin, y + margin, width - margin, height - margin);


        const chargeWidth = Math.floor(this.value / this.pixelPerCharge) < 100 ? Math.floor(this.value / this.pixelPerCharge) : 100

        this.bar.fillStyle(0x4ADEDE);
        this.bar.fillRect(x + margin, y + margin, chargeWidth ? chargeWidth - (margin) : 0, height - margin);

        this.bar.fillStyle(0xFFFFFF);


        // if (this.value === 0) {
        //     this.bar.fillStyle(0x000000);
        //     this.bar.fillRect(x, y, width + margin, height + margin);
        // }
    }
}


export default ChargeBar;