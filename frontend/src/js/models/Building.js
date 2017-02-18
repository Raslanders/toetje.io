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
    constructor(data, techTree) {
        super();
        this.updateFromTick(data, techTree);
    }

    render(stage, groups, renderer) {
        super.render(stage, groups, renderer);
        this.add({x: this.tile.x, y: this.tile.y});
    }

    animate() {
    }

    updateFromTick(data, techTree) {
        this.name = data.name;
        this.owner = data.owner;
        this.technology = data.technology;

        // Only upon the initial construction a techTree is given
        if (techTree) {
            this.spriteUrl = techTree.getSpriteUrlForTechId(data.technology);
        }
        //position is in tile coordinates
        this.position = {x: data.position.x, y: data.position.y};
    }

    get displayObject() {
        if (this.sprite) {
            return this.sprite;
        }

        const sprite = PIXI.Sprite.fromImage(this.spriteUrl);

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
