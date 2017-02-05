const Building = require('./Building');
const Troop = require('./Troop');

class Tile {
    constructor(position, type) {
        this.position = position;
        this.type = type;
        this.owner = null;
        this.building = null;
        this.troop = null;
        this.model = null;
    }

    setType(type) {
        this.type = type;
    }

    setModel(model) {
        this.model = model;
    }

    parse(data) {
        this.type = data.type;
        this.owner = data.owner;
        if (data.type === 'building') {
            //TODO: werkt nog niet
            //this.building = new Building();
        }
    }
}

module.exports = Tile;
