'use strict';

const PIXI = require('pixi.js');
const Entity = require('./Entity');
const Globals = require('../data/Globals');

/*
 #8dd3c7
 #ffffb3
 #bebada
 #fb8072
 #80b1d3
 #fdb462
 */

class Building extends Entity {
    // Instantiate building from bootstrap map data
    constructor(data) {
        super();
        this.updateFromTick(data);
    }

    render(stage, renderer) {
        super.render(stage, renderer);
        this.add({x: this.tile.x, y: this.tile.y});
    }

    animate() {
    }

    updateFromTick(data) {
        this.name = data.name;
        this.owner = data.owner;
        this.technology = data.technology;
        //position is in tile coordinates
        this.position = {x: data.position.x, y: data.position.y};
    }

    get displayObject() {
        if (this._sprite) {
            return this._sprite;
        }

        const graphics = new PIXI.Graphics();
        if (this.owner == 1) {
            graphics.beginFill(0xFF4136);
        }
        if (this.owner == 2) {
            graphics.beginFill(0x66CCFF);
        }
        if (this.owner == 3) {
            graphics.beginFill(0xFFDC00);
        }
        if (this.owner == 4) {
            graphics.beginFill(0x2ECC40);

        }


        graphics.moveTo(Globals.cellWidth * 0.5, 0);
        graphics.lineTo(0, 0);
        graphics.lineTo(0, Globals.cellHeight * 0.5);

        graphics.moveTo(Globals.cellWidth * 0.5, 0);
        graphics.lineTo(Globals.cellWidth, 0);
        graphics.lineTo(Globals.cellWidth, Globals.cellHeight * 0.5);

        graphics.moveTo(0, Globals.cellHeight * 0.5);
        graphics.lineTo(0, Globals.cellHeight);
        graphics.lineTo(Globals.cellWidth * 0.5, Globals.cellHeight);

        graphics.moveTo(Globals.cellWidth * 0.5, Globals.cellHeight);
        graphics.lineTo(Globals.cellWidth, Globals.cellHeight);
        graphics.lineTo(Globals.cellWidth, Globals.cellHeight * 0.5);

        graphics.endFill();

        const texture = this.renderer.generateTexture(graphics);
        this._sprite = new PIXI.Sprite(texture);
        return this._sprite;
    }

    set displayObject(displayObject) {
        this._sprite = displayObject;
    }
}

module.exports = Building;
