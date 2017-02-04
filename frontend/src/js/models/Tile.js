const Building = require('./Building');
const Troop = require('./Troop');

class Tile {
    constructor(position, type) {
        this.position = position;
        this.type = type;
        this.building = null;
        this.troop = null;
    }

    setType(type) {
        this.type = type;
    }

    parse(data) {
        if (data.type === 'empty') return;
        if (data.type === 'lane') {
            this.type = 'lane';
            return;
        }
        if (data.type === 'building') {
            this.type = 'building';
            this.building = new Building();
        }
    }
}

module.exports = Tile;
