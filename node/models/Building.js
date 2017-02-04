/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


const Troop = require('./Troop');

class Building {
    constructor(cell, unit, player) {
        this.cell = cell;
        this.unit = unit;
        this.counter = 0;
        this.owner = player
    }

    /**
     * Attempts to create a new unit
     * @param id The troop id to use
     * @param direction The direction this troop should walk towards
     * @returns returns troop if it can, undefined otherwise
     */
    attemptSpawn(id, direction) {
        if (this.canSpawn) {
            this.counter = 0;
            return new Troop(id, this.unit, this.owner, this.cell, direction);
        } else {
            this.counter++;
        }
    }

    // Getters & Setters
    set unit(unit) {
        if (unit) {
            this._unit = unit;
        }
    }

    get unit() {
        return this._unit;
    }

    get cell() {
        return this._cell;
    }

    set cell(cell) {
        if (cell) {
            this._cell = cell;
        }
    }

    get counter() {
        return this._counter;
    }

    set counter(counter) {
        if (counter) {
            this._counter = counter;
        }
    }

    get canSpawn() {
        return this.counter >= this.tech.spawnTime;
    }
}


module.exports = Building;
