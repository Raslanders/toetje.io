/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const fs = require('fs');
const Cell = require('./Cell');
const Building = require('./Building');

class Map {
    constructor(filename) {
        this._cells = [];
        this.load(filename);
    }

    load(file) {
        let mapRows = fs.readFileSync(`data/maps/${file}`).toString().split("\n");

        for (let i in mapRows) {
            let row = mapRows[i];
            let cellRow = [];
            for (let j = 0; j < row.length; j++) {
                cellRow.push(new Cell(i, j, row[j]));
            }
            this._cells.push(cellRow);
        }
        console.log(this._cells);
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
                       if (!buildings[id]) {
                           buildings[id] = [];
                       }
                       // Create an empty building
                       buildings[id].push(new Building(cell, undefined, 0));
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

    // Getters & setters
    get cells() {
        return this._cells;
    }
}

new Map("RaslandianDesert");

module.exports = Map;