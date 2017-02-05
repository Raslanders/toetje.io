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
        if (this.sprite) {
            return this.sprite;
        }

        const sprite = PIXI.Sprite.fromImage('static/building_dps.png');

        // Hardcode the scaling for now
        const scale = Globals.cellWidth / Globals.spriteSize
        sprite.scale.x = scale;
        sprite.scale.y = scale;

        this.sprite = sprite;
        return sprite;
    }

    set displayObject(displayObject) {
        this._sprite = displayObject;
    }
}

module.exports = Building;
