'use strict';

const Map = require('./Map');

class State {
    constructor() {
        this.gameState = 'lobby';
        this.map = new Map();
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

    }

    start() {
        console.log('Game started');
        this.gameState = 'stared';
    }

    stop() {
        console.log('Game stopped');
        this.gameState = 'stopped';
    }
}

module.exports = State;
