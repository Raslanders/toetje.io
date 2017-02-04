/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict'

class Technology {
    constructor(id, name, description, price, prerequisites, unit) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.prerequisites = prerequisites;
        this.unit = unit;
    }

    // Getters and setters
    get id() {
        return this._id;
    }

    set id(id) {
        if (id) {
            this._id = id;
        }
    }

    get name() {
        return this._name;
    }

    set name(name) {
        if (name) {
            this._name = name;
        }
    }

    get description() {
        return this._description;
    }

    set description(description) {
        if (description) {
            this._description = description;
        }
    }

    get price() {
        return this._price;
    }

    set price(price) {
        if (price) {
            this._price = price;
        }
    }

    get prerequisites() {
        return this._prerequisites;
    }

    set prerequisites(prerequisites) {
        if (prerequisites) {
            this._prerequisites = prerequisites;
        }
    }

    get unit() {
        return this._unit;
    }

    set unit(unit) {
        if (unit) {
            this._unit = unit;
        }
    }

    get buildTime() {
        return this._buildTime ? this._buildTime : 10;
    }
}

module.exports = Technology;