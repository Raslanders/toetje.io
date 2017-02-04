/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class Tech {
    constructor(name, description, unit) {
        this._name = name;
        this._description = description;
        this._unit = unit;
    }

    // Getters
    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get unit() {
        return this._unit;
    }

    get spawn() {

    }
}


module.exports = Tech;