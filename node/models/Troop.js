/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class Troop {
    constructor(unit, health, position) {
        this._unit = unit;
        this._health = health;
        this._position = position;
    }

    // Getters and setters
    get unit() {
        return this._unit;
    }

    set health(health) {
        if (health) {
            this._health = health;
        }
    }

    get health() {
        return this._health;
    }

    set position(position) {
        if (position) {
            this._position = position;
        }
    }

    get position() {
        return this._position;
    }
}


module.exports = Troop;