/**
 * Created by ruudandriessen on 04/02/2017.
 */

'use strict';


class Player {
    constructor(client, name) {
        this._client = client;
        this._name = name;
    }

    // Getters
    get name() {
        return this._name;
    }

    get client() {
        return this._client;
    }

    emit(type = 'tick', message = {}) {
        this.client.emit(type, message);
    }
}


module.exports = Player;
