/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const Game = require('../models/Game');

class Lobby {
    constructor() {
        this.state = 'lobby';
        this.game = null;
        this.playerIndex = 1;
        this.players = [];
    }

    enter(player) {
        console.log(`Player ${this.playerIndex} has joined`);
        player.id = this.playerIndex;
        this.playerIndex++;

        this.players.push(player);
        if (this.players.length === 2) {
            this.start();
        }
    }

    leave(player) {
        // Remove the player from the lobby
        this.players = this.players.filter(p => p.id !== player.id);
        console.log(`Player ${player.id} has left`);
        this.stop();

        // Rename players based on their index in this.players
        // We do this because the lobby persists and the map is harcoded with player ids
        // We want the active players to have id 1 and 2
        for (let i = 0; i < this.players.length; i++) {
            const newId = +i + 1;
            this.players[i].id = newId;
        }

        // Update index
        this.playerIndex = this.players.length + 1;
    }

    start() {
        this.state = 'ingame';
        this.game = new Game(this.players);
        this.game.start();
    }

    stop() {
        if (this.game) {
            this.state = 'lobby';
            this.game.stop();
            this.game = null;
        }
    }
}


module.exports = Lobby;
