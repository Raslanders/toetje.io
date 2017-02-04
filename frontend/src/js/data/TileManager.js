const Tile = require('../models/Tile');
const Globals = require('./Globals');

class TileManager {
    constructor() {
        //Initalize tiles empty
        this.tiles = [];
        for(let i = 0; i < Globals.gridWidth; i++) {
            let row = [];
            for(let j = 0; j < Globals.gridHeight; j++) {
                row.push(new Tile(x, y, null));
            }
            this.tiles.push(row);
        }
    }

    getTile(x, y) {
        return this.tiles[x][y];
    }
}

module.exports = TileManager;