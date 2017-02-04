/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const Thread = require('../core/Thread');
const Map = require('../core/Map');

class Game {
    constructor(players) {
        this.players = players;
        this.thread = new Thread(this);
        this.map = new Map("RaslandianDesert");
    }

    start() {
        console.log('Generating bases for players');
        this.bases = this.map.generateBases(this.players);
        console.log("Starting game");
        this.thread.run();
    }

    // Getters & setters
    get players() {
        return this._players;
    }

    set players(players) {
        if (players) {
            this._players = players;
        }
    }

    get map() {
        return this._map;
    }

    set map(map) {
        if (map) {
            this._map = map;
        }
    }

    get thread() {
        return this._thread;
    }

    set thread(thread) {
        if (thread) {
            this._thread = thread;
        }
    }

    get bases() {
        return this._bases;
    }

    set bases(bases) {
        if (bases) {
            this._bases = bases;
        }
    }

    emitResult() {
        this._players.forEach(p => p.emit());
    }

    get troops() {
        return this._troops;
    }

    set troops(troops) {
        if (troops) {
            this._troops = troops;
        }
    }
}


module.exports = Game;
