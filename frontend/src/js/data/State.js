'use strict';

const Map = require('./Map');
const _ = require('lodash');

class State {
    constructor() {
        this.gameState = 'lobby';
        this.map = new Map();
        this.socket = null;
    }

    createBuilding(x, y, technologyId) {
        this.socket.emit('build', { x, y, technologyId });
    }

    // parseMap(map) {
    //     this.map.
    //     console.log('Parsing map', map);
    //     this.tiles = map;
    // }

    parsePlayer(id) {
        console.log('TODO set active player to', id);
    }

    parseMutation(mutation) {
        _.each(mutation.building, b => {
            this.map.updateBuildingAtPosition(b.position, b);
        })
        _.each(mutation.troop, t => {
            this.map.updateTroopAtPosition(t.position, t);
        });
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
