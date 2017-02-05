const Tile = require('../models/Tile');
const Globals = require('./Globals');
const _ = require('lodash');

class Map {
    constructor(renderer) {
        this.renderer = renderer;
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
                tile.parse(data[x][y], this.renderer);
            });
        })
    }

    updateBuildingAtPosition(position, building) {
        const tile = this.getTile(position.x, position.y);
        tile.building.updateFromTick(building);
    }
    updateTroopAtPosition(position, troop) {
        console.log('TODO UPDATE TROOPS');
    }

    getTile(x, y) {
        return this.tiles[x][y];
    }
}

module.exports = Map;
