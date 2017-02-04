/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const fs = require('fs');
const Cell = require('./Cell');

class Map {
    constructor(filename) {
        this.cells = [];
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
            this.cells.push(cellRow);
        }
    }
}

module.exports = Map;