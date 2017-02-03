/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const Cell = require('./Cell');


class Map {
    constructor(xSize, ySize) {
        this.cells = [];
        for (let i = 0; i < xSize; i++) {
            let cellRow = [];
            for (let j = 0; j < ySize; j++) {
                cellRow.push(new Cell(i, j));
            }
            this.cells.push(cellRow);
        }
    }
}


module.exports = Map;