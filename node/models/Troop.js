/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class Troop {
    constructor(id, unit, owner, position, direction) {
        this.id = id;
        this.unit = unit;
        this.owner = owner;
        this.position = position;
        this.stats = unit.stats;
        this.direction = direction;
    }

    // Getters and setters
    get id() {
        return this._id;
    }

    set id(id) {
        if (id) {
            this._id = id;
        }
    }

    get unit() {
        return this._unit;
    }

    set unit(unit) {
        if (unit) {
            this._unit = unit;
        }
    }

    get owner() {
        return this._owner;
    }

    set owner(owner) {
        if (owner) {
            this._owner = owner;
        }
    }

    get position() {
        return this._position;
    }

    set position(position) {
        if (position) {
            this._position = position;
        }
    }

    get stats() {
        return this._stats;
    }

    set stats(stats) {
        if (stats) {
            this._stats = stats;
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


module.exports = Troop;