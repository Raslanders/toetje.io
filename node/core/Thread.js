/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const _ = require('lodash');
const Troop = require('../models/Troop');
const Globals = require('./Globals')

class Thread {
    constructor(game) {
        this.game = game;
        this.token = 0;
        this.tickCount = 0;
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
        this.updateResources();
        this.updateCombat();
        this.updateBuildings();
        this.updateTroops();
        this.spawnTroops();

        this.game.emit('tick', this.mutation);
        this.updateToken();
        //this.cleanupTroops();
        if (!this.stopped) {
            setTimeout(this.run.bind(this), Globals.timePerTick);
        }
    }

    stop() {
        this.stopped = true;
    }

    prepareTick() {
        const ticksIntoWave = this.tickCount % Globals.ticksPerWave;
        const ticksUntilWave = Globals.ticksPerWave - ticksIntoWave - 1;
        this.mutation = {
            troop: [],
            building: [],
            resources: [],
            meta: {
                timeUntilWave: ticksUntilWave  * Globals.timePerTick / 1000, 
            },
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
        let deadTroops = [];
        for (let i = this.token; i < this.players.length + this.token; i++) {
            let player = this.players[i % this.players.length];
            for (let k in this.troops[player.id]) {
                let troop = this.troops[player.id][k];
                if(!troop.isDead) {
                    let targets = troop.inRange(this.troops);

                    troop.attack(targets[0]);
                    if (targets[0] && targets[0].isDead && !_.includes(deadTroops, targets[0])) {
                        deadTroops.push(targets[0]);
                        targets[0].targets = null;
                        troop.targets = null;
                    }
                    else if (targets[0] && targets[0].isDead) {
                        troop.targets = null;
                    }
                    // Make the troop ready for emitting to clients
                    this.prepareTroopForTick(troop);
                }
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

            if(building && building.technology && building.technology.id == technologyId) {
                console.log('Player ' + playerId + ' tried to build technology ' + technologyId);
                continue;
            }

            if (building && playerId === building.owner.id) {
                //console.log(this.technologies[technologyId].price);
                //console.log(this.game.players[playerId]);
                if(this.game.players[playerId-1].resource > this.technologies[technologyId].price) {
                    this.game.players[playerId-1].resource -= this.technologies[technologyId].price;
                    building.upgradeTo(this.technologies[technologyId]);
                } else {
                    console.error("Player " + playerId + " does not have enough resources");
                }
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
                if (!troop.collides(this.troops)) {
                    troop.move();
                    // Make the troop ready for emitting to clients
                    this.prepareTroopForTick(troop);
                }
            }
        }
    }

    /**
     * Increases the player resources;
     */
    updateResources() {
        for (let i = this.token; i < this.players.length + this.token; i++) {
            let player = this.players[i % this.players.length];
            player.resource += Math.pow(2, Math.floor(this.tickCount / Globals.ticksPerWave));
            player.resource = 1000;
            this.mutation.resources.push(player.view);
        }
    }

    /**
     * Spawns troops for each player, starting at the player with the token
     */
    spawnTroops() {
        this.tickCount++;
        if (this.tickCount >= Globals.ticksPerWave) {
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
            this.tickCount = 0;
        }
    }

    /**
     * Clean up dead troops
     */
    cleanupTroops() {
        // Remove all dead troops
        for( let i = this.token; i < this.players.length + this.token; i++) {
            let player = this.players[i % this.players.length];
            _.remove(this.troops[player.id], t => t.isDead);
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
            this.ids[player.id] = 1;
        }
        return player.id + "-" + this.ids[player.id];
    }

    get token() {
        return this._token;
    }

    set token(token) {
        this._token = (token) % this.players.length;
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
