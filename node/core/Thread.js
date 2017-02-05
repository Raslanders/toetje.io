/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const _ = require('lodash');
const Troop = require('../models/Troop');

class Thread {
    constructor(game) {
        this.game = game;
        this.token = 0;
        this.waveCounter = 0;
        this.stopped = false;
        this.mutation = {};
        this.ids = {};
    }

    /**
     * Starts the game update thread
     */
    run() {
        // Update
        this.prepareTick();
        this.updateCombat();
        this.updateBuildings();
        this.updateTroops();
        this.spawnTroops();

        this.game.emit('tick', this.mutation);
        this.updateToken();

        if (!this.stopped) {
            setTimeout(this.run.bind(this), 1000);
        }
    }

    stop() {
        this.stopped = true;
    }

    prepareTick() {
        this.mutation = {
            troop: [],
            building: [],
        };
    }

    prepareTroopForTick(troop) {
        const exists = _.includes(this.mutation.troop, t => t.id === troop.id);

        if (exists) return;
        this.mutation.troop.push(troop.view)
    }

    /**
     * Updates all combat taking place
     */
    updateCombat() {
        for (let i = this.token; i < this.players.length + this.token; i++) {
            let player = this.players[i % this.players.length];
            for (let k in this.troops[player.id]) {
                let troop = this.troops[player.id][k];
                let targets = troop.inRange(this.troops);

                troop.attack(targets[0]);
                if (targets[0] && targets[0].isDead) {
                    _.remove(this.troops[player.id], p => p.id === troop.id);
                }
                // Make the troop ready for emitting to clients
                this.prepareTroopForTick(troop);
            }
        }
    }

    /**
     * Increases building counters for all buildings which are not yet done building
     */
    updateBuildings() {
        while (this.game.queue.length > 0) {
            let event = this.game.queue.pop();

            // Process event
            let x = event.x;
            let y = event.y;
            let technologyId = event.technologyId;
            let playerId = event.playerId;

            let building = this.game.map.cells[x][y].building;

            if (building && playerId === building.owner.id) {
                building.upgradeTo(this.technologies[technologyId]);
            } else {
                console.error("Client requested to build a building on an invalid cell: ", x, y, playerId);
            }
        }

        // Attempt to increase building counters
        for (let i = this.token; i < this.players.length + this.token; i++) {
            let player = this.players[i % this.players.length];
            for (let k in this.buildings[player.id]) {
                let building = this.buildings[player.id][k];
                if (!building.isBuilt) {
                    building.buildCounter++;
                    // Make this building ready for emitting to clients
                    this.mutation.building.push(building.view);
                }
            }
        }
    }

    /**
     * Attempts to move troops for every player, starting at the player with the token
     */
    updateTroops() {
        for (let i = this.token; i < this.players.length + this.token; i++) {
            let player = this.players[i % this.players.length];
            for (let k in this.troops[player.id]) {
                let troop = this.troops[player.id][k];
                if (troop.isDead) {
                    continue;
                }
                if (!troop.collides(this.troops)) {
                    troop.move();
                    // Make the troop ready for emitting to clients
                    this.prepareTroopForTick(troop);
                }
            }
        }
    }

    /**
     * Spawns troops for each player, starting at the player with the token
     */
    spawnTroops() {
        this.waveCounter++;
        if (this.waveCounter >= 10) {
            // Spawn the wave
            for (let i = this.token; i < this.players.length + this.token; i++) {
                let player = this.players[i % this.players.length];
                for (let k in this.buildings[player.id]) {
                    let building = this.buildings[player.id][k];
                    let troop = building.attemptSpawn(this.troopId(player), building.base.direction);
                    if (troop) {
                        this.troops[player.id].push(troop);
                        this.ids[player.id]++;
                        // Make the troop ready for emitting to clients
                        this.prepareTroopForTick(troop);
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
        if (this.ids[player.id] === undefined) {
            this.ids[player.id] = 0;
        }
        return player.id + "-" + this.ids[player.id];
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

    get technologies() {
        return this.game.technologies;
    }
}


module.exports = Thread;
