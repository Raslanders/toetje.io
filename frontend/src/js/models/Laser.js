const Entity = require("./Entity");
const Globals = require('../data/Globals');
const PIXI = require('pixi.js');

class Laser extends Entity {
    constructor(originX, originY, targetX, targetY, owner) {
        super();

        this.owner = owner;
        this.alpha = 1;

        this.oldPos = {x: (originX + 0.5) * Globals.cellWidth, y: (originY + 0.5) * Globals.cellHeight};
        const origin = this.screenToIso({x: originX * Globals.cellWidth, y: originY * Globals.cellHeight});
        const target = this.screenToIso({x: targetX * Globals.cellWidth, y: targetY * Globals.cellHeight});
        this.originX = origin.x;
        this.originY = origin.y;
        this.targetX = target.x;
        this.targetY = target.y;
        
        this.entityType = "Weapon";
    }

    render(stage, groups, renderer) {
        super.render(stage, groups, renderer);

        this.add(this.oldPos);
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
        return true;
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

        let angle = Math.atan2(this.targetY - this.originY, this.targetX - this.originX);

        let startX = (Math.cos(angle)) * Globals.cellWidth / 2;
        let startY = (Math.sin(angle)) * Globals.cellHeight / 2;


        graphics.moveTo(startX, startY);
        graphics.lineTo(this.targetX - this.originX, this.targetY - this.originY);

        if (this.owner == 1) {
            graphics.lineStyle(1, 0xFF4500);
        }
        if (this.owner == 2) {
            graphics.lineStyle(1, 0x7Fdbff);
        }

        //3 pixels offset
        let offSetX = Math.cos(angle + 4*(2*Math.PI)/360) * Globals.cellWidth / 2;
        let offSetY = Math.sin(angle + 4*(2*Math.PI)/360) * Globals.cellHeight / 2;


        graphics.moveTo(offSetX, offSetY);
        graphics.lineTo(this.targetX - this.originX, this.targetY - this.originY);

        offSetX = Math.cos(angle - 4*(2*Math.PI)/360) * Globals.cellWidth / 2;
        offSetY = Math.sin(angle - 4*(2*Math.PI)/360) * Globals.cellHeight / 2;

        graphics.moveTo(offSetX, offSetY);
        graphics.lineTo(this.targetX - this.originX, this.targetY - this.originY);
        graphics.antiAlias = true;

        this._sprite = graphics;
        return this._sprite;
    }

    set displayObject(displayObject) {
        this._sprite = displayObject;
    }

}

module.exports = Laser;
