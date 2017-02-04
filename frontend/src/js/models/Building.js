'use strict'

const Entity = require('./Entity');

/*
 #8dd3c7
 #ffffb3
 #bebada
 #fb8072
 #80b1d3
 #fdb462
 */

class Building extends Entity {
    constructor(stage, coordinates) {
        super(stage, coordinates);
        this.gridSize = 50;
        this.anchor = {pos: 30, dir: true};
        this.drawSprite(coordinates);
    }

    animate() {
        this.anchor.pos = this.anchor.dir ? this.anchor.pos + 1 : this.anchor.pos - 1;

        if (this.anchor.pos > this.gridSize - 10) {
            this.anchor.dir = !this.anchor.dir;
        } else if (this.anchor.pos < 10) {
            this.anchor.dir = !this.anchor.dir;
        }

        this.removeSprite();
        this.drawSprite({x: this.x, y: this.y});
        return true;
    }

    removeSprite() {
        if (this.sprite) {
            this.sprite.destroy();
            this.stage.removeChild(this.sprite);
        }
    }

    //draws the sprite of this unit on the given coordinates
    drawSprite(coordinates) {
        this.sprite = new PIXI.Graphics();

        let x = coordinates.x * this.gridSize;
        let y = coordinates.y * this.gridSize;


        this.sprite.beginFill(0x80b1d3);
        this.sprite.lineStyle(1, 0x80b1d3);

        this.sprite.moveTo(x, y + this.anchor.pos);
        this.sprite.lineTo(x + this.gridSize, y + this.anchor.pos);

        this.sprite.moveTo(x + this.anchor.pos, y);
        this.sprite.lineTo(x + this.anchor.pos, y + this.gridSize);

        this.sprite.endFill();


        this.sprite.beginFill(0xfdb462);
        this.sprite.lineStyle(0);

        this.sprite.moveTo(x + this.gridSize * 0.5, y);
        this.sprite.lineTo(x, y);
        this.sprite.lineTo(x, y + this.gridSize * 0.5);

        this.sprite.moveTo(x + this.gridSize * 0.5, y);
        this.sprite.lineTo(x + this.gridSize, y);
        this.sprite.lineTo(x + this.gridSize, y + this.gridSize * 0.5);

        this.sprite.moveTo(x, y + this.gridSize * 0.5);
        this.sprite.lineTo(x, y + this.gridSize);
        this.sprite.lineTo(x + this.gridSize * 0.5, y + this.gridSize);

        this.sprite.moveTo(x + this.gridSize * 0.5, y + this.gridSize);
        this.sprite.lineTo(x + this.gridSize, y + this.gridSize);
        this.sprite.lineTo(x + this.gridSize, y + this.gridSize * 0.5);

        this.sprite.endFill();

        this.stage.addChild(this.sprite);
    }
}

module.exports = Building;