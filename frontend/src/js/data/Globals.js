let instance = null;

class Globals {
    constructor() {
        if(!instance) {
            instance = this;
        }
        this.cellWidth = 50;
        this.cellHeight = 50;
        this.gridWidth = 15;
        this.gridHeight = 15;

        return instance;
    }
}

module.exports = new Globals();