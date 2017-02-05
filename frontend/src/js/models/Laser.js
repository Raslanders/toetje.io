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
        if (this.owner == 2) {
            graphics.lineStyle(1, 0xFF4136, 0.3);
        }
        if (this.owner == 1) {
            graphics.lineStyle(1, 0x66CCFF, 0.3);
        }


        graphics.moveTo(0, 0);
        graphics.lineTo(this.targetX - this.originX, this.targetY - this.originY);
        // graphics.antiAlias = true;

        this._sprite = graphics;
        return this._sprite;
    }

    set displayObject(displayObject) {
        this._sprite = displayObject;
    }

}

module.exports = Laser;
