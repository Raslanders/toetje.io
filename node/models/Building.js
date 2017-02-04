/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


const Troop = require('./Troop');

class Building {
    constructor(cell, unit) {
        this.cell = cell;
        this.unit = unit;
        this.buildCounter = 0;
    }

    /**
     * Attempts to create a new unit
     * @param id The troop id to use
     * @param direction The direction this troop should walk towards
     * @returns returns troop if it can, undefined otherwise
     */
    attemptSpawn(id, direction) {
        if (this.isBuild) {
            return new Troop(id, this.unit, this.owner, this.cell, direction);
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

    get buildCounter() {
        return this._buildCounter;
    }

    set buildCounter(buildCounter) {
        if (buildCounter) {
            this._buildCounter = buildCounter;
        }
    }

    get isBuild() {
        return this.buildCounter >= this.unit.buildTime;
    }
}


module.exports = Building;