/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class TicketManager {
    constructor(game) {
        this.game = game;
    }

    run() {
        this.updateCombat();
        this.updateBuildings();
        this.updateUnits();
        this.spawnUnits();

        setTimeout(1000, this.run);
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


module.exports = TicketManager;