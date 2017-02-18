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
        this.entityType = "Building";
    }

    render(stage, groups, renderer) {
        super.render(stage, groups, renderer);
        this.add({
            x: this.gridPosition.x * Globals.cellWidth,
            y: this.gridPosition.y * Globals.cellHeight
        });
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
        this.gridPosition = {x: data.position.x, y: data.position.y};
    }

    get displayObject() {
        if (this._sprite) {
            return this._sprite;
        }

        const sprite = PIXI.Sprite.fromImage(this.spriteUrl);
        sprite.scale.x = 0.25;
        sprite.scale.y = 0.25;

        this._sprite = sprite;
        return this._sprite;
    }

    set displayObject(displayObject) {
        this._sprite = displayObject;
    }
}

module.exports = Building;
