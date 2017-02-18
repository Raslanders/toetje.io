let instance = null;

class Globals {
    constructor() {
        if(!instance) {
            instance = this;
        }
        this.cellWidth = 30;
        this.cellHeight = 30;
        this.spriteSize = 256;
        this.gridWidth = 35;
        this.gridHeight = 15;

        return instance;
    }
}

module.exports = new Globals();
