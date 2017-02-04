/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const Game = require('../models/Game');

class Lobby {
    constructor() {
        this._state = 'lobby';
        this._game = null;
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
        console.log('Lobby.start');
        this._state = 'ingame';
        // TODO create Game
        this._game = new Game(this._players);
        this._game.start();
    }
}


module.exports = Lobby;
