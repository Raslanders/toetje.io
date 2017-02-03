/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const Base = require('./Base')


class Game {
    constructor() {
        this.players = [];
        this.bases = [];
    }

    generateBases() {
        let base = new Base(-1, {x: 0, y: 0});
        this.bases.push(base);
    }

    addPlayer(player) {
        this.players.push(player);
    }
}


module.exports = Game;