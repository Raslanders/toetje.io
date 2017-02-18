/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const fs = require('fs');
const Cell = require('./Cell');
const Building = require('../models/Building');
const Turret = require('../models/Turret');
const Base = require('../models/Base');
var os = require('os');
class Map {
    constructor(filename) {
        this._cells = [];
        this.load(filename);
    }

    load(file) {
        let mapRows = fs.readFileSync(`data/maps/${file}`).toString().split(os.EOL);

        for (let y = 0; y < mapRows.length; y++) {
            let row = mapRows[y];

            for (let x = 0; x < row.length; x++) {
                if (y == 0) {
                    this._cells[x] = [];
                }
                this._cells[x][y] = new Cell(x, y, row[x]);
            }
        }
    }

    generateBases(players) {
        let buildings = {};

        // Loop over all cells
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[0].length; j++) {
                let cell = this.cells[i][j];
                // Check if this tile is for a player
                for (let k in players) {
                    let player = players[k];

                    // If the id is the same as this cell
                    if (player.id == cell.type) {
                        // Add this building to this player
                        if (!buildings[player.id]) {
                            buildings[player.id] = [];
                        }
                        // Create an empty building
                        let building = new Building(cell, undefined, player);
                        buildings[player.id].push(building);
                        cell.building = building;
                    }
                }
            }
        }

        let bases = {};

        // Create all bases for the players
        for (let k in players) {
            let player = players[k];
            // Create a new base with all the buildings
            bases[player.id] = new Base(player, buildings[player.id], []);
        }

        return bases;
    }


    /**
     * Generates a turret unit for the players. "a" belongs to player with id 1, "b" belong to player with id 2, etc...
     * @param players
     */
    generateTurrets(players, turretUnit) {
        let id = 1;
        //TODO adapt for more players using unicode characters
        let turrets = {};
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[0].length; j++) {
                let cell = this.cells[i][j];

                let turretCell = false;
                let playerId;
                let direction;
                if (cell.type == "a") {
                    playerId = 1;
                    direction = {x: 1, y: 0};
                    turretCell = true;
                } else if (cell.type == "b") {
                    playerId = 2;
                    direction = {x: -1, y: 0}
                    turretCell = true;
                }

                //1 and 2 are only the ids, not the indices somehow
                let owner;
                for (let k in players) {
                    let player = players[k];
                    if (player.id == playerId) {
                        owner = player;
                    }
                }

                if (turretCell) {
                    if (!turrets[playerId]) {
                        turrets[playerId] = [];
                    }
                    //TODO fix for multiple turrets. Currently spawning with id 0 as it is not reserved. Needs to be refactored
                    //Probably want to spawn a turretbuilding that is already finished and can instantly spawn
                    let turret = new Turret(playerId+"-"+0, turretUnit, owner, {x:i, y:j}, direction);
                    turrets[playerId].push(turret);
                }
            }
        }
        return turrets;
    }


// Getters & setters
    get
    cells() {
        return this._cells;
    }

    get
    view() {
        return this._cells.map(col => {
            return col.map(cell => {
                return cell.view
            });
        });
    }
}

module.exports = Map;
