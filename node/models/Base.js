/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class Base {
    constructor(owner, position, buildings) {
        this.owner = owner;
        this.position = position;
        this.buildings = buildings || [];
    }
}


module.exports = Base;