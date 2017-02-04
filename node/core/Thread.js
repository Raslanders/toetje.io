/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class Thread {
    constructor(game) {
        this.game = game;
    }

    run() {
        this.updateCombat();
        this.updateBuildings();
        this.updateUnits();
        this.spawnUnits();
        console.log('game tick', this);
        this.emitResult();

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

    }
}


module.exports = Thread;
