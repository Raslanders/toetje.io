'use strict';

const PIXI = require('pixi.js');
const Entity = require('./Entity');
const Globals = require('../data/Globals');

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
        let filter = new PIXI.filters.ColorMatrixFilter();
        let matrix = filter.matrix;
        if (this.owner == 1) {
            matrix[6] = 0;
            matrix[12] = 0;
        } else {
            matrix[0] = 0;
            matrix[6] = 0;
        }
        sprite.filters = [filter]
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
