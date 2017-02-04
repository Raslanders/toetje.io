/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

class Cell {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this._type = type;
        this._building = null;
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

    // For map bootstrap to frontend
    get view() {
        return {
            owner: this.owner,
            type: this.readableType,
            x: this.x,
            y: this.y,
        }
    }

    get readableType() {
        if (this.building) {
            return 'base';
        }
        if (this.type === 'o') {
            return 'lane';
        }
        return 'empty';
    }

    get building() {
        return this._building
    }

    set building(building) {
        if (building) {
            this._building = building;
        }
    }

    get owner() {
        if (this._building) {
            return this._building.owner.id;
        }
        return null;
    }
}


module.exports = Cell;
