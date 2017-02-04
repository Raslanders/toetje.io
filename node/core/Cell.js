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

    get type() {
        return this._type;
    }

    // For map bootstrap to frontend
    get view() {
        return {
            owner: this.owner,
            type: this.readableType,
        }
    }

    get readableType() {
        if (this.building) {
            return 'building';
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
