/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class Base {
    constructor(owner, position, buildings) {
        this._owner = owner;
        this._position = position;
        this._buildings = buildings || [];
    }

    // Getters & Setters
    set owner(owner) {
        if (owner) {
            this._owner = owner;
        }
    }

    get owner() {
        return this._owner;
    }

    get position() {
        return this._position;
    }

    get buildings() {
        return this._buildings;
    }
}


module.exports = Base;