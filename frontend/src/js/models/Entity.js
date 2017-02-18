'use strict'

const PIXI = require('pixi.js');

class Entity {
    constructor() {
        this.isRendered = false;
        this.entityType = "Abstract";
    }

    render(stage, groups, renderer) {
        if (this.isRendered) {
            this.destroy();
        }
        this.stage = stage;
        this.group = groups[this.entityType];
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

    screenToIso(position) {
        return {x: position.x - position.y, y: (position.x + position.y)/2}
    }

    add(position) {
        const pos = this.screenToIso(position);
        this.x = pos.x;
        this.y = pos.y;
        this.displayObject.displayGroup = this.group;
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
