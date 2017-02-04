/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class Unit {
    constructor(tech, properties) {
        this.tech = tech;
        this.properties = properties;
    }

    // Getters
    get tech() {
        return this._tech;
    }

    set tech(tech) {
        if (tech) {
            this._tech = tech;
        }
    }

    get properties() {
        return this._properties;
    }

    set properties(properties) {
        if (properties) {
            this._properties = properties;
        }
    }

    get spawnTime() {
        return this.properties.spawnTime;
    }
}


module.exports = Unit;