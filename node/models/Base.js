/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class Base {
    constructor(owner, buildings, lanes, direction) {
        this.owner = owner;
        this.buildings = buildings || [];
        this._lanes = lanes || [];
        this.direction = owner.id == 1 ? {x: 1, y: 0} : {x: -1, y: 0};

        for (let k in this.buildings) {
            this.buildings[k].base = this;
        }
    }

    // Getters & Setters
    get owner() {
        return this._owner;
    }
    set owner(owner) {
        if (owner) {
            this._owner = owner;
        }
    }

    get buildings() {
        return this._buildings;
    }

    set buildings(buildings) {
        if (buildings) {
            this._buildings = buildings;
        }
    }

    get direction() {
        return this._direction;
    }

    set direction(direction) {
        if (direction) {
            this._direction = direction;
        }
    }
}


module.exports = Base;