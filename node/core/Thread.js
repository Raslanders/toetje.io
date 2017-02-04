/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


const Troop = require('../models/Troop');

class Thread {
    constructor(game) {
        this.game = game;
        this.token = 0;
    }

    /**
     * Starts the game update thread
     */
    run() {
        // Update
        this.updateCombat();
        this.updateBuildings();
        this.updateTroops();
        this.spawnTroops();

        // Emit result and update the token
        this.emitResult();
        this.updateToken();

        setTimeout(this.run.bind(this), 1000);
    }

    emitResult() {
        this.game.emitResult();
    }

    updateCombat() {

    }

    /**
     * Increases building counters for all buildings which are not yet done building
     */
    updateBuildings() {
        // todo: start upgrade progress for new buildings

        // Attempt to increase building counters
        for (let i = this.token; i < this.players.length; i++) {
            let player = this.players[i];
            for (let k in this.buildings[player.id]) {
                let building = this.buildings[player.id][k];
                if (!building.isBuild) {
                    building.buildCounter++;
                }
            }
        }
    }

    /**
     * Attempts to move troops for every player, starting at the player with the token
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
     * Spawns troops for each player, starting at the player with the token
     */
    spawnTroops() {
        for (let i = this.token; i < this.players.length; i++) {
            let player = this.players[i];
            for (let k in this.buildings[player.id]) {
                let building = this.buildings[player.id][k];
                let troop = building.attemptSpawn(this.troopId(player), building.base.direction);
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

    /**
     * Generates the next troop id for a certain player
     * @param player the player to generate the next id for
     * @returns {string}
     */
    troopId(player) {
        return player.id + "-" + this.troops[player.id].length;
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
