/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

class Cell {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this._type = type;
    }

    // Getters & setters
    get x() {
        return this._x;
    }

    set x(x) {
        if (x) {
            this._x = +x;
        }
    }

    set y(y) {
        if (y) {
            this._y = +y;
        }
    }

    get y() {
        return this._y;
    }

    get type() {
        return this._type;
    }
}


module.exports = Cell;