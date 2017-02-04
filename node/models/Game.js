/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const Base = require('./Base')
const Thread = require('../core/Thread');

class Game {
    constructor(players, map) {
        this._players = players;
        this._thread = new Thread(this);
        this._bases = [];
    }

    start() {
        console.log('game starting');
        this._thread.run();
    }

    generateBases() {
        let base = new Base(-1, {x: 0, y: 0});
        this._bases.push(base);
    }

    emitResult() {
        this._players.forEach(p => p.emit());
    }
}


module.exports = Game;
