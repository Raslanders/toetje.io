const Entity = require("./Entity");
const Globals = require('../data/Globals');
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

    render(stage, renderer){
        super.render(stage, renderer);

        this.add({x: this.originX, y: this.originY});
    }

    destroy() {
        super.destroy();
    }

    animate() {
        this.alpha -= Math.random() * 0.05;
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
        if (this.owner == 1) {
            graphics.lineStyle(2, 0xFF4136);
        }
        if (this.owner == 2) {
            graphics.lineStyle(2, 0x4169E1);

        }

        let angle = Math.atan2(this.targetY - this.originY,this.targetX - this.originX);

        let exitX =  Math.cos(angle)*Globals.gridWidth;
        let exitY =  Math.sin(angle)*Globals.gridHeight;

        graphics.moveTo(exitX, exitY);
        graphics.lineTo(this.targetX - this.originX, this.targetY - this.originY);

        if (this.owner == 1) {
            graphics.lineStyle(1, 0xFF4500);
        }
        if (this.owner == 2) {
            graphics.lineStyle(1, 0x7Fdbff);
        }

        graphics.moveTo(3+exitX, exitY);
        graphics.lineTo(this.targetX - this.originX, this.targetY - this.originY);
        graphics.moveTo(-3+exitX, exitY);
        graphics.lineTo(this.targetX - this.originX , this.targetY - this.originY);
        // graphics.antiAlias = true;

        this._sprite = graphics;
        return this._sprite;
    }

    set displayObject(displayObject) {
        this._sprite = displayObject;
    }

}

module.exports = Laser;
