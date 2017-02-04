/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


const Troop = require('../models/Troop');

class Thread {
    constructor(game) {
        this.game = game;
        this.token = 0;
        this.waveCounter = 0;
        this.stopped = false;
    }

    /**
     * Starts the game update thread
     */
    run() {
        // Update
        // this.updateCombat();
        // this.updateBuildings();
        // this.updateTroops();
        // this.spawnTroops();

        // Emit result and update the token
        // this.game.emitResult();
        // this.updateToken();

        if (!this.stopped) {
            setTimeout(this.run.bind(this), 1000);
        }
    }

    stop() {
        this.stopped = true;
    }

    updateCombat() {

    }

    /**
     * Increases building counters for all buildings which are not yet done building
     */
    updateBuildings() {
        while (!this.game.queue.isEmpty()) {
            let event = this.game.queue.pop();

            // Process event
            let x = event.x;
            let y = event.y;
            let technologyId = event.technologyId;
            let building = this.game.map.cells[x][y].building;

            if (building) {
                building.upgradeTo(this.technology[technologyId]);
            } else {
                console.error("Client requested to build a building on a non-building cell: ", x, y);
            }
        }

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
                if (!troop.collides(this.troops)) {
                    troop.move();
                }
            }
        }
    }

    /**
     * Spawns troops for each player, starting at the player with the token
     */
    spawnTroops() {
        this.waveCounter++;
        if (this.waveCounter >= 100) {
            // Spawn the wave
            for (let i = this.token; i < this.players.length; i++) {
                let player = this.players[i % this.players.length];
                for (let k in this.buildings[player.id]) {
                    let building = this.buildings[player.id][k];
                    let troop = building.attemptSpawn(this.troopId(player), building.base.direction);
                    if (troop) {
                        // add new troop to game (queue?) and send to players
                    }
                }
            }

            // Reset the counter
            this.waveCounter = 0;
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
        this._token = (token) % this.players.length;
    }

    get waveCounter() {
        return this._waveCounter;
    }

    set waveCounter(waveCounter) {
        this._waveCounter = waveCounter;
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

    get technology() {
        return this.game.technology;
    }
}


module.exports = Thread;
