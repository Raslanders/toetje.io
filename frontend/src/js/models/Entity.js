'use strict'

const PIXI = require('pixi.js');

class Entity {
    constructor() {
        this.isRendered = false;
    }

    render(stage, renderer) {
        if (this.isRendered) {
            this.destroy();
        }
        this.stage = stage;
        this.renderer = renderer;
        this.isRendered = true;
    }

    animate(){
        throw new TypeError("Method animate should have been overridden");
    }

    destroy() {
        if (this.displayObject) {
            this.isRendered = false;
            this.stage.removeChild(this.displayObject);
            this.displayObject.destroy();
            this.displayObject = undefined;
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

    set displayObject(displayObject) {
        this._sprite = displayObject;
    }

    get x() {
        if (this.displayObject) {
            return this.displayObject.x;
        }
    }

    set x(x) {
        this.displayObject.x = x;
    }

    get y() {
        if (this.displayObject) {
            return this.displayObject.y;
        }
    }

    set y(y) {
        this.displayObject.y = y;
    }
}

module.exports = Entity;
