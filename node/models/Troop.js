/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';


class Troop {
    constructor(id, unit, owner, position, direction) {
        this.id = id;
        this.unit = unit;
        this.owner = owner;
        this.position = position;
        this.stats = unit.stats;
        this.direction = direction;
    }

    /**
     * Moves this troop based on it's direction
     */
    move() {
        this.position.x += this.direction.x;
        this.position.y += this.direction.y;
    }

    attack(target) {
        this.target = target;
    }

    inRange(troops) {
        let targets = [];
        for (let p in troops) {
            let playerTroops = troops[p];
            for (let k in playerTroops) {
                let troop = playerTroops[k];
                if (troop.owner.id !== this.owner.id) {
                    let position = troop.position;
                    if (this.targetInRange(position)) {
                        targets.push(troop);
                    }
                }
            }
        }
        return targets;
    }


    /**
     * Checks if an x and y position is in range to shoot
     * @param position
     * @returns {boolean}
     */
    targetInRange(position) {
        let nx = this.position.x;
        let ny = this.position.y;

        if (this.direction.x > 0) {
            // we are moving to the right
            if (position.x >= nx && position.x <= nx + this.unit.stats.range) {
                if (position.y === ny || ((position.y === ny + 1 || position.y === ny - 1))) {
                    return true;
                }
            }
        } else if (this.direction.x < 0) {
            // we are moving to the left
            if (position.x >= nx - this.unit.stats.range && position.x <= nx) {
                if (position.y === ny || ((position.y === ny + 1 || position.y === ny - 1))) {
                    return true;
                }
            }
        } else if (this.direction.y > 0) {
            // we are moving to the bottom
            if (position.y >= ny && position.y <= ny + this.unit.stats.range) {
                if (position.x === nx || ((position.x === nx + 1 || position.x === nx - 1))) {
                    return true;
                }
            }
        } else if (this.direction.y < 0) {
            // we are moving to the top
            if (position.y >= ny - this.unit.stats.range && position.y <= ny) {
                if (position.x === nx || ((position.x === nx + 1 || position.x === nx - 1))) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Checks if this unit will collide with the given troops if moving
     * @param troops The troops to check against
     * @returns {boolean} True if it will collide, false otherwise
     */
    collides(troops) {
        for (let p in troops) {
            let playerTroops = troops[p];
            for (let k in playerTroops) {
                let troop = playerTroops[k];
                if (troop.id !== this.id) {
                    // console.log("Check for collision: ", [this.id, troop.id]);
                    let position = troop.position;
                    if (this.positionInRange(position, troop.owner.id === this.owner.id)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Checks if an x and y position is in range if we were to move
     * @param position
     * @returns {boolean}
     */
    positionInRange(position, sameOwner) {
        let nx = this.position.x + this.direction.x;
        let ny = this.position.y + this.direction.y;
        if (this.direction.x > 0) {
            // we are moving to the right
            if (position.x >= nx && position.x <= nx) {
                if (position.y === ny || (!sameOwner && (position.y === ny + 1 || position.y === ny - 1))) {
                    return true;
                }
            }
        } else if (this.direction.x < 0) {
            // we are moving to the left
            if (position.x >= nx && position.x <= nx) {
                if (position.y === ny || (!sameOwner && (position.y === ny + 1 || position.y === ny - 1))) {
                    return true;
                }
            }
        } else if (this.direction.y > 0) {
            // we are moving to the bottom
            if (position.y >= ny && position.y <= ny) {
                if (position.x === nx || (!sameOwner && (position.x === nx + 1 || position.x === nx - 1))) {
                    return true;
                }
            }
        } else if (this.direction.y < 0) {
            // we are moving to the top
            if (position.y >= ny && position.y <= ny) {
                if (position.x === nx || (!sameOwner && (position.x === nx + 1 || position.x === nx - 1))) {
                    return true;
                }
            }
        }

        return false;
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

    get view() {
        return {
            id: this.id,
            position: this.position,
            owner: this.owner.id,
            unit: this.unit.id,
            name: this.unit.name,
            direction: this.direction,
            target: this.target ? this.target.position : null
        };
    }

    get unit() {
        return this._unit;
    }

    set unit(unit) {
        if (unit) {
            this._unit = unit;
        }
    }

    get owner() {
        return this._owner;
    }

    set owner(owner) {
        if (owner) {
            this._owner = owner;
        }
    }

    get position() {
        return this._position;
    }

    set position(position) {
        if (position) {
            this._position = position;
        }
    }

    get stats() {
        return this._stats;
    }

    set stats(stats) {
        if (stats) {
            this._stats = stats;
        }
    }

    get direction() {
        return this._direction;
    }

    set direction(direction) {
        if (direction) {
            this._direction = direction;
        }
    }
}


module.exports = Troop;
