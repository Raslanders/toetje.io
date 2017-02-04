/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


const Troop = require('./Troop');

class Thread {
    constructor(game) {
        this.game = game;
        this.token = 0;
    }

    /**
     * @description Starts the game update thread
     */
    run() {
        this.updateCombat();
        this.updateBuildings();
        this.updateTroops();
        this.spawnTroops();
        this.emitResult();

        this.updateToken();

        setTimeout(this.run.bind(this), 1000);
    }

    emitResult() {
        this.game.emitResult();
    }

    updateCombat() {

    }

    updateBuildings() {

    }

    /**
     * @description Attempts to move troops for every player, starting at the player with the token
     */
    updateTroops() {
        for (let i = this.token; i < this.players.length; i++) {
            let player = this.players[i];
            for (let k in this.troops[player.id]) {
                let troop = this.troops[player.id][k];
                // troop.move();
            }
        }
    }

    /**
     * @description Spawns troops for each player, starting at the player with the token
     */
    spawnTroops() {
        for (let i = this.token; i < this.players.length; i++) {
            let player = this.players[i];
            for (let k in this.buildings[player.id]) {
                let building = this.buildings[player.id][k];
                let troop = building.attemptSpawn();
                if (troop) {
                    // add new troop to game (queue?) and send to players
                }
            }
        }
    }

    /**
     * @description Updates the token
     */
    updateToken() {
        this.token++;
    }

    // Getters and setters
    get game() {
        return this._game
    }

    set game(game) {
        if (game) {
            this._game = game;
        }
    }

    get token() {
        return this._token;
    }

    set token(token) {
        if (token) {
            this._token = (token) % this.players.length;
        }
    }

    get players() {
        return this.game.players;
    }

    get buildings() {
        return this.game.buildings;
    }

    get troops() {
        return this.game.troops;
    }

}


module.exports = Thread;
