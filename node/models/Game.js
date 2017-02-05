/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const Thread = require('../core/Thread');
const Map = require('../core/Map');
const tech = require('../data/tech');
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
        this.bases = this.map.generateBases(this.players);
        for (let k in this.bases) {
            let base = this.bases[k];
            this.buildings[base.owner.id].push(...base.buildings);
        }

        console.log('Game start');
        // Send bootstrap data to client
        this.bootstrap();
        this.thread.run();
    }

    stop() {
        this.thread.stop();
    }

    bootstrap() {
        this.players.forEach(p => {
            p.emit('start', {
                playerId: p.id,
                map: this.map.view,
                techTree: tech,
            });
        });
    }

    emit(type, message) {
        this.players.forEach(p => p.emit(type, message));
    }
}

new Game([]);

module.exports = Game;
