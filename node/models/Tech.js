/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class Tech {
    constructor(name, description) {
        this._name = name;
        this._description = description;
    }

    // Getters
    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }
}


module.exports = Tech;