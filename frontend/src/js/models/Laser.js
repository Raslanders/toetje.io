const Entity = require("./Entity");
const PIXI = require('pixi.js');

class Laser extends Entity {
    constructor(originX, originY, targetX, targetY, owner) {
        super();

        this.originX = originX;
        this.originY = originY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.owner = owner;
        this.alpha = 1;
    }

    render (stage, renderer){
        super.render(stage, renderer);

        this.add({x: this.originX, y: this.originY});
    }

    animate() {
        this.alpha -= 0.1;
        if (this.alpha <= -1) {
            this.alpha = 1;
        }
        this.displayObject.alpha = this.alpha;
    }

    get displayObject() {
        if (this._sprite) {
            return this._sprite;
        }

        const graphics = new PIXI.Graphics();
        console.log(this.owner);
        if (this.owner == 1) {
            graphics.lineStyle(1, 0xFF4136);
        }
        if (this.owner == 2) {
            graphics.lineStyle(1, 0x66CCFF);
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
