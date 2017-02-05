/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const Thread = require('../core/Thread');
const Map = require('../core/Map');
const DataLoader = require('../data/DataLoader');

class Game {
    constructor(players) {
        this.queue = [];
        this.players = players;
        this.thread = new Thread(this);
        this.map = new Map('RaslandianDesert');

        // Load technology and unit data
        let data = DataLoader();
        this.technologies = data.technologies;
        this.units = data.units;

        this.buildings = {};
        this.troops = {};
        for (let k in this.players) {
            let player = this.players[k];
            this.buildings[player.id] = [];
            this.troops[player.id] = [];
        }
    }

    start() {
        console.log('Generating bases for players');
        this.bases = this.map.generateBases(this.players);
        for (let k in this.bases) {
            let base = this.bases[k];
            this.buildings[base.owner.id].push(...base.buildings);
        }

        // Make sure you don't emit too early
        // Socket.io fucks something up
        setTimeout(() => {
            // Send bootstrap data to client
            this.bootstrap();
            this.thread.run();
        }, 1000);
    }

    stop() {
        this.emit('stop');
        this.thread.stop();
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

    get troops() {
        return this._troops;
    }

    set troops(troops) {
        if (troops) {
            this._troops = troops;
        }
    }

    get units() {
        return this._units;
    }

    set units(units) {
        if (units) {
            this._units = units;
        }
    }

    get technologies() {
        return this._technologies;
    }

    set technologies(technologies) {
        if (technologies) {
            this._technologies = technologies;
        }
    }

    get buildings() {
        return this._buildings;
    }

    set buildings(buildings) {
        if (buildings) {
            this._buildings = buildings;
        }
    }

    bootstrap() {
        this.players.forEach(p => {
            p.emit('start', {
                playerId: p.id,
                map: this.map.view,
            });
        });
    }

    emit(type, message) {
        this.players.forEach(p => p.emit(type, message));
    }
}

new Game([]);

module.exports = Game;
