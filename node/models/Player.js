/**
 * Created by ruudandriessen on 04/02/2017.
 */

'use strict';


class Player {
    constructor(id, name, color) {
        this._id = id;
        this._name = name;
        this._color = color;
    }

    // Getters
    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get color() {
        return this._color;
    }
}


module.exports = Player;
