const Entity = require('./Entity');

class Building extends Entity {
    constructor() {
        super();
        this.isEmpty = true;
    }

    updateFromTick(data) {
        this.isEmpty = false;
        this.name = data.name;
        this.owner = data.owner;
        this.technology = data.technology;
    }
}

module.exports = Building;
