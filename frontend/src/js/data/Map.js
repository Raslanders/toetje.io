const Tile = require('../models/Tile');
const Globals = require('./Globals');
const _ = require('lodash');

class Map {
    constructor() {
        //Initalize tiles empty
        this.tiles = [];
        for(let x = 0; x < Globals.gridWidth; x++) {
            let row = [];
            for(let y = 0; y < Globals.gridHeight; y++) {
                row.push(new Tile({x, y}, null));
            }
            this.tiles.push(row);
        }
    }

    // Parse socket data to frontend data
    parse(data) {
        _.each(this.tiles, (row, x) => {
            _.each(row, (tile, y) => {
                console.log('tile loaded');
                tile.parse(data[x][y]);
            });
        })
    }

    getTile(x, y) {
        return this.tiles[x][y];
    }
}

module.exports = Map;
