'use strict';

class State {
    constructor() {
        this.gameState = 'lobby';
        this.map = [];
        this.troop = [];
        this.building = [];
    }

    parseMap(map) {
        console.log('Parsing map', map);
        this.map = map;
    }

    parsePlayer(id) {
        console.log('TODO set active player to', id);
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
