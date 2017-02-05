const Entity = require("./Entity");
const PIXI = require('pixi.js');

class Laser extends Entity {


    constructor(stage, renderer, originX, originY, targetX, targetY) {
        super(stage, renderer);

        this.originX = originX;
        this.originY = originY;
        this.targetX = targetX;
        this.targetY = targetY;

        this.add({x:originX,y:originY});

    }


    get displayObject() {

        if (this._sprite) {
            return this._sprite;
        }

        const graphics = new PIXI.Graphics();
        graphics.lineStyle(5, 0xFF0000, 1);
        //draw line from center to center
        //TODO: Draw line from edge of origin to center of target
        graphics.moveTo(0, 0);
        graphics.lineTo(this.targetX-this.originX, this.targetY-this.originY);
        // graphics.antiAlias = true;

        this._sprite = graphics;
        return this._sprite;
    }

}

module.exports = Laser;
