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
        if (this.isBuilt && this.technology) {
            return new Troop(id, this.technology.unit, this.owner, {x: this.cell.x, y: this.cell.y}, direction, this.technology.slug);
        }
    }

    // Get renderable building instance
    get view() {
        return {
            position: {
                x: this.cell.x,
                y: this.cell.y,
            },
            owner: this.owner.id,
            technology: this.technology.id,
            name: this.technology.name,
            isBuilding: this.isBuilding,
        };
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

    get base() {
        return this._base;
    }

    set base(base) {
        if (base) {
            this._base = base;
        }
    }

    get buildCounter() {
        return this._buildCounter;
    }

    set buildCounter(buildCounter) {
        this._buildCounter = buildCounter;
    }

    get isBuilt() {
        const isEmpty = !this.technology
        return isEmpty || !this.isBuilding;
    }

    get isBuilding() {
        return this.buildCounter < this.technology.buildTime;
    }
}


module.exports = Building;
