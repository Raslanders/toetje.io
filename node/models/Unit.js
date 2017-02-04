/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class Unit {
    constructor(stats) {
        this.name = stats.name;
        this.stats = stats;
    }

    // Getters
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
}


module.exports = Unit;