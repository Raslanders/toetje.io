/**
 * Created by ruudandriessen on 04/02/2017.
 */

'use strict';

class Player {
    constructor(client, name) {
        this.client = client;
        this.name = name;
        this.ready = false;
        this.resource = 0;
    }

    emit(type, message) {
        this.client.emit(type, message);
    }

    get view() {
        return {
            id: this.id,
            resource: this.resource,
        };
    }
}


module.exports = Player;
