/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const _ = require('lodash');
const Game = require('../models/Game');

class Lobby {
    constructor() {
        this.state = 'lobby';
        this.game = null;
        this.playerIndex = 1;
        this.players = [];
    }

    enter(player) {
        player.id = this.playerIndex;
        this.playerIndex++;

        this.players.push(player);
        this.emit('join', `Player ${player.id} has joined`);

        if (this.players.length === 2) {
            this.ready();
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

    // Lobby filled,
    // Wait till every clients is listening to the socket
    // then start the game
    ready() {
        console.log('Lobby ready, waiting for player ack');
        this.state = 'ready';
        this.game = new Game(this.players);

        this.emit('ready');
    }

    // If all players are ready start the game
    maybeStart() {
        if (this.players.every(p => p.ready)) {
            this.start();
        }
    }

    start() {
        this.state = 'ingame';
        this.game.start();
    }

    stop() {
        if (this.game) {
            this.state = 'lobby';
            this.game.stop();
            // Unready every player
            _.each(this.players, p => p.ready = false);
            this.emit('stop');
            this.game = null;
        }
    }

    emit(type, message) {
        this.players.forEach(p => p.emit(type, message));
    }

    handleMessage(player, message) {
        message.playerId = player.id;
        console.log('Client action: ', message);
        this.game.queue.push(message);
    }
}


module.exports = Lobby;
