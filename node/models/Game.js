/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const Base = require('./Base')


class Game {
    constructor() {
        this._players = [];
        this._bases = [];
    }

    generateBases() {
        let base = new Base(-1, {x: 0, y: 0});
        this._bases.push(base);
    }

    addPlayer(player) {
        this._players.push(player);
    }
}


module.exports = Game;