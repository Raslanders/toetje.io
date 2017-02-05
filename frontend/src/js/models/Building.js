'use strict';

const PIXI = require('pixi.js');
const Entity = require('./Entity');

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
    constructor() {
        super();
        this.isEmpty = true;
        this.tile = null;
    }

    render(stage, renderer, position) {
        super.render(stage, renderer);
        this.gridSize = 50;
        this.add(position);
    }

    animate() {
    }

    updateFromTick(data) {
        this.isEmpty = false;
        this.name = data.name;
        this.owner = data.owner;
        this.technology = data.technology;
    }

    get displayObject() {
        if (this._sprite) {
            return this._sprite;
        }

        const graphics = new PIXI.Graphics();

        graphics.beginFill(0xfdb462);

        graphics.moveTo(this.gridSize * 0.5, 0);
        graphics.lineTo(0, 0);
        graphics.lineTo(0, this.gridSize * 0.5);

        graphics.moveTo(this.gridSize * 0.5, 0);
        graphics.lineTo(this.gridSize, 0);
        graphics.lineTo(this.gridSize, this.gridSize * 0.5);

        graphics.moveTo(0, this.gridSize * 0.5);
        graphics.lineTo(0, this.gridSize);
        graphics.lineTo(this.gridSize * 0.5, this.gridSize);

        graphics.moveTo(this.gridSize * 0.5, this.gridSize);
        graphics.lineTo(this.gridSize, this.gridSize);
        graphics.lineTo(this.gridSize, this.gridSize * 0.5);

        graphics.endFill();

        const texture = this.renderer.generateTexture(graphics);
        this._sprite = new PIXI.Sprite(texture);
        return this._sprite;
    }
}

module.exports = Building;
