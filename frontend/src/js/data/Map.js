const Tile = require('../models/Tile');
const Globals = require('./Globals');
const _ = require('lodash');

class Map {
    constructor(gameRenderer) {
        this.gameRenderer = gameRenderer
        //Initalize tiles empty
        this.tiles = [];
        for(let x = Globals.gridWidth; x > 0; x--) {
            let row = [];
            for(let y = Globals.gridHeight; y > 0; y--) {
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

    updateBuildingAtPosition(position, buildingData, techTree) {
        const tile = this.getTile(position.x, position.y);

        if (!tile.building) {
            tile.createBuilding(this.gameRenderer, buildingData, techTree);
            return;
        }
        tile.type = 'building';
        tile.building.updateFromTick(buildingData);
    }

    getTile(x, y) {
        return this.tiles[x][y];
    }
}

module.exports = Map;
