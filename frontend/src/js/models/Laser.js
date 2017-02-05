const Entity = require("./Entity");
const PIXI = require('pixi.js');

class Laser extends Entity {


    constructor(stage, renderer, originX, originY, targetX, targetY) {
        super();
        super.render(stage, renderer);

        this.originX = originX;
        this.originY = originY;
        this.targetX = targetX;
        this.targetY = targetY;

        this.add({x: originX, y: originY});

    }


    get displayObject() {

        if (this._sprite) {
            return this._sprite;
        }

        const graphics = new PIXI.Graphics();

        if (this.owner == 1) {
            graphics.lineStyle(2, 0x66CCFF);
        }
        if (this.owner == 2) {
            graphics.lineStyle(2, 0xFF4136);
        }


        //draw line from center to center
        //TODO: Draw line from edge of origin to center of target
        graphics.moveTo(0, 0);
        graphics.lineTo(this.targetX - this.originX, this.targetY - this.originY);
        // graphics.antiAlias = true;

        this._sprite = graphics;
        return this._sprite;
    }

}

module.exports = Laser;
