/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class Building {
    constructor(cell, tech, level) {
        this.cell = cell;
        this.tech = tech;
        this.level = level;
        this.counter = 0;
    }

    increaseLevel() {
        this.level++;
    }

    attemptSpawn() {
        if (this.canSpawn) {
            // create troop
        } else {
            return false;
        }
    }

    // Getters & Setters
    set tech(tech) {
        if (tech) {
            this._tech = tech;
        }
    }

    get tech() {
        return this._tech;
    }

    set level(level) {
        if (level) {
            this._level = level;
        }
    }

    get level() {
        return this._level;
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