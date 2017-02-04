/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const Base = require('./Base')


class Game {
    constructor(players) {
        this._players = players;
        this._bases = [];
    }

    generateBases() {
        let base = new Base(-1, {x: 0, y: 0});
        this._bases.push(base);
    }
}


module.exports = Game;
