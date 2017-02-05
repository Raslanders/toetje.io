/**
 * Created by ruudandriessen on 04/02/2017.
 */

'use strict';

class Player {
    constructor(client, name) {
        this.client = client;
        this.name = name;
        this.ready = false;
    }

    emit(type, message) {
        this.client.emit(type, message);
    }
}


module.exports = Player;
