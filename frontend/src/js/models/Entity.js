'use strict'

const PIXI = require('pixi.js');

class Entity {
    constructor(stage, renderer) {
        this.stage = stage;
        this.renderer = renderer;
    }

    animate(){
        throw new TypeError("Method animate should have been overridden");
    }

    destroy() {
        if (this.displayObject) {
            this.displayObject.destroy();
            this.stage.removeChild(this.displayObject);
        }
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }

    add(position) {
        this.x = position.x;
        this.y = position.y;
        this.stage.addChild(this.displayObject);
    }

    get displayObject(){
        throw new TypeError("Method displayObject should have been overridden");
    }

    get x() {
        return this.displayObject.x;
    }

    set x(x) {
        this.displayObject.position.x = x;
    }

    get y() {
        return this.displayObject.y;
    }

    set y(y) {
        this.displayObject.position.y = y;
    }
}

module.exports = Entity;
