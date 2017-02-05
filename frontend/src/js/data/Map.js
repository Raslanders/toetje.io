const Tile = require('../models/Tile');
const Globals = require('./Globals');
const _ = require('lodash');

class Map {
    constructor(gameRenderer) {
        this.gameRenderer = gameRenderer
        //Initalize tiles empty
        this.tiles = [];
        for(let x = 0; x < Globals.gridWidth; x++) {
            let row = [];
            for(let y = 0; y < Globals.gridHeight; y++) {
                let tile = new Tile({x, y}, null);
                row.push(tile);
                this.gameRenderer.addToQueue(tile, false)
            }
            this.tiles.push(row);
        }
    }

    // Parse socket data to frontend data
    parse(data) {
        _.each(this.tiles, (row, x) => {
            _.each(row, (tile, y) => {
                tile.parse(data[x][y], this.gameRenderer);
            });
        })
    }

    updateBuildingAtPosition(position, building) {
        const tile = this.getTile(position.x, position.y);

        // An unbuilt building is called a base
        if (tile.type === 'base') {
            tile.createBuilding(this.gameRenderer);
        }
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
