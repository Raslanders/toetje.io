/**
 * Created by msondag on 18-2-2017.
 */

'use strict';

const Troop = require('./Troop');

class Turret extends Troop {
    constructor(id, unit, owner, position, direction) {
        super(id, unit, owner, position, direction);
    }

    move() {
        //turrets can't move
    }

    collides(troops) {
        //turrets can't move
        return true;
    }
    
    positionInRange(position, sameOwner) {
        //turrets can't move
        return false;
    }
}


module.exports = Turret;
