/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const Thread = require('./Thread');

class Lobby {
    constructor() {
        this._state = 'lobby';
        this._thread = null;
        this._players = [];
    }

    enter(player) {
        this._players.push(player);
        if (this._players.length === 2) {
            this.start();
        }
    }

    leave(player) {
        console.log('player has left', player.id);
    }

    start() {
        this._state = 'ingame';
        // TODO create Game
        // Start Thread with Game
        console.log('game starting');
    }
}


module.exports = Lobby;
