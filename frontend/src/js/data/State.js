'use strict';

const Map = require('./Map');
const _ = require('lodash');
const Troop = require('../models/Troop');

class State {
    constructor() {
        this.gameState = 'lobby';
        this.map = new Map();
        this.socket = null;
        this.techTree = [];
        this.troops = {};
    }

    createBuilding(x, y, technologyId) {
        this.socket.emit('build', { x, y, technologyId });
    }

    parsePlayer(id) {
        console.log('Playing as Player', id);
    }

    parseMutation(mutation) {
        _.each(mutation.building, b => {
            this.map.updateBuildingAtPosition(b.position, b);
        })
        _.each(mutation.troop, t => {
            this.updateTroop(t.id, t);
        });
    }

    // Create or update troop
    updateTroop(id, troopData) {
        let troop = this.troops[id];

        if (!troop) {
            troop = new Troop(troopData);
            this.troops[id] = troop;
            return;
        }

        troop.updateFromTick(troopData);
    }

    start() {
        console.log('Game started');
        this.gameState = 'started';
    }

    stop() {
        console.log('Game stopped');
        this.gameState = 'stopped';
    }
}

module.exports = State;
