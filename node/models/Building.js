/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class Building {
    constructor(tech, level) {
        this._tech = tech;
        this._level = level;
    }

    increaseLevel() {
        this.level(this._level + 1);
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
}


module.exports = Building;