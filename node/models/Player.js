/**
 * Created by ruudandriessen on 04/02/2017.
 */

'use strict';


class Player {
    constructor(client, id, name) {
        this._client = client;
        this._id = id;
        this._name = name;
    }

    // Getters
    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get client() {
        return this._client;
    }
}


module.exports = Player;
