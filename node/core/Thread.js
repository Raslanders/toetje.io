/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class Thread {
    constructor(game) {
        this.game = game;
        this.players = this.game.players;
        this.token = 0;
    }

    run() {
        this.updateCombat();
        this.updateBuildings();
        this.updateUnits();
        this.spawnUnits();
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

    updateUnits() {

    }

    spawnUnits() {
        for (let k in this.game.buildings) {
            let building = this.game.buildings[k];
            building.attemptSpawn();
        }
    }

    updateToken() {
        this.token = (this.token + 1) % this.players.length;
    }
}


module.exports = Thread;
