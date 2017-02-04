/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class Unit {
    constructor(technology, name, stats) {
        this.technology = technology;
        this.name = name;
        this.stats = stats;
    }

    // Getters
    get technology() {
        return this._technology;
    }

    set technology(technology) {
        if (technology) {
            this._technology = technology;
        }
    }

    get name() {
        return this._name;
    }

    set name(name) {
        if (name) {
            this._name = name;
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

    get spawnTime() {
        return this.stats.spawnTime || 10;
    }
}


module.exports = Unit;