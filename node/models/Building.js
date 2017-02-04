/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


const Troop = require('./Troop');

class Building {
    constructor(cell, technology, player) {
        this.cell = cell;
        this.technology = technology;
        this.owner = player;
        this.buildCounter = 0;
    }

    /**
     * Starts the upgrade from this building to the new unit type given
     * @param technology The unit type to upgrade to
     */
    upgradeTo(technology) {
        this.buildCounter = 0;
        this.technology = technology;
    }

    /**
     * Attempts to create a new unit
     * @param id The troop id to use
     * @param direction The direction this troop should walk towards
     * @returns returns troop if it can, undefined otherwise
     */
    attemptSpawn(id, direction) {
        if (this.isBuild) {
            return new Troop(id, this.technology.unit, this.owner, {x: this.cell.x, y: this.cell.y}, direction);
        }
    }

    // Getters & Setters
    get cell() {
        return this._cell;
    }

    set cell(cell) {
        if (cell) {
            this._cell = cell;
        }
    }

    get technology() {
        return this._technology;
    }

    set technology(technology) {
        if (technology) {
            this._technology = technology;
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

    get buildCounter() {
        return this._buildCounter;
    }

    set buildCounter(buildCounter) {
        if (buildCounter) {
            this._buildCounter = buildCounter;
        }
    }

    get isBuild() {
        return !this.technology || this.buildCounter >= this.technology.buildTime;
    }
}


module.exports = Building;
