/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

class Cell {
    constructor(x, y, type) {
        this._x = x;
        this._y = y;
        this._type = type;
    }

    // Getters
    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get type() {
        return this._type;
    }
}


module.exports = Cell;