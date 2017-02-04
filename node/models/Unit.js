/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class Unit {
    constructor(tech, properties) {
        this._tech = tech;
        this._properties = properties;
    }

    // Getters
    get tech() {
        return this._tech;
    }

    get properties() {
        return this._properties;
    }
}


module.exports = Unit;