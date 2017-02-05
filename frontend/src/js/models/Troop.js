const Entity = require("./Entity");
const PIXI = require('pixi.js');
const Laser = require('./Laser');
const Globals = require('../data/Globals');


class Troop extends Entity {
    constructor(data) {
        super()
        this.position = {x: data.position.x, y: data.position.y};

        this.updateFromTick(data);

        this.x = this.position.x * Globals.cellWidth;
        this.y = this.position.y * Globals.cellHeight;
    }

    updateFromTick(data) {
        //unique id of the unit
        this.id = data.id;
        //name of the unit
        this.name = data.name;

        //position is in tile coordinates
        if (this.position) {
            //we already had a position, check if we moved
            if (this.position.x != data.position.x || this.position.y != data.position.y) {
                //we moved, set coordinates for animation
                this.moveTo(data.position.x * Globals.cellWidth, data.position.y * Globals.cellHeight);
            }
        }
        //update the tile position
        this.position = data.position;
        //owner id of the unit
        this.owner = 0 + data.owner;
        //direction this unit is moving in
        this.direction = data.direction;
    }

    //Coordinates are grid coordinates
    render(stage, renderer) {
        super.render(stage, renderer);

        this.gridSize = 50;
        //allows 1 movement in the x direction in 1 movement in the y direction per tick
        this.movePerTick = 5;
        //total amount of ticks for the attack animation
        this.attackAnimationTicks = 60;
        //current tick in the attack animation
        this.attackAnimationTick = 0;

        //whether this unit is dead
        this.death = false;
        //current deathAnimation tick
        this.deathAnimationTick = 0;
        //death animation time
        this.deathAnimationTicks = 60;
        //the laser entity when we are attacking
        this.laser;

        //target coordinates of the attack in screen coordinates
        this.targetPosition;

        //Place of the next movement in screen coordinates
        this.newX = this.position.x * Globals.cellWidth;
        this.newY = this.position.y * Globals.cellHeight;

        this.add({x: this.newX, y: this.newY});
    }

    attack(targetX, targetY) {
        this.targetPosition = {x: targetX, y: targetY};
    }

    stopAttack() {
        this.targetPosition = null;
    }

    moveTo(newX, newY) {
        //positions are in screen coordinates
        this.newX = newX;
        this.newY = newY;
    }

    animate() {
        if (this.death == true) {
            //end laser rendering if it was still busy
            this.endLaser();
            //show deathAnimation
            this.deathAnimation();
            return;
        }

        //unit is not dead
        if (this.x != this.newX || this.y != this.newY) {
            //end laser rendering if it was still busy
            this.endLaser();
            //show animation movement
            this.animateMovement();
            return;
        }
        //unit has not moved
        if (this.targetPosition) {
            //show attack animation
            this.animateAttack(this.targetPosition.x, this.targetPosition.y)
        }
    }


    //TargetCoordinates contains the coordinates of the target unit
    animateAttack(targetX, targetY) {

        if (this.attackAnimationTick >= this.attackAnimationTicks) {
            this.attackAnimationTick -= this.attackAnimationTicks;
        }

        if (this.attackAnimationTick == 0) {
            this.beginLaser(targetX, targetY);
        } else if (this.attackAnimationTick == Math.floor(this.attackAnimationTicks / 3)) {
            this.endLaser();
        }

        this.attackAnimationTick++;
    }

    //return true if this unit has moved
    animateMovement() {
        if (this.x === this.newX && this.y === this.newY) {
            return false;
            //no movement;
        }
        let xDiff = this.newX - this.x;
        let yDiff = this.newY - this.y;

        if (xDiff == 0 && yDiff == 0) {
            return false;
        }
        //figure out the new coordinates with a manhattan distance of at most movePerTick
        if (xDiff > 0) {
            this.x = this.x + Math.min(xDiff, this.movePerTick);
        } else {
            this.x = this.x - Math.min(-xDiff, this.movePerTick);
        }
        if (yDiff > 0) {
            this.y = this.y + Math.min(yDiff, this.movePerTick);
        } else {
            this.y = this.y - Math.min(-yDiff, this.movePerTick);
        }

        return true;
    }

    get displayObject() {
        if (this._sprite) {
            return this._sprite;
        }
        // Graphics
        const graphics = new PIXI.Graphics();
        if (this.owner == 2) {
            graphics.lineStyle(2, 0xFF4136);
            console.log("red");
        }
        if (this.owner == 1) {
            graphics.lineStyle(2, 0x66CCFF);
            console.log("Blue");
        }
        if (this.owner == 4) {
            graphics.lineStyle(2, 0xFFDC00);
        }
        if (this.owner == 3) {
            graphics.lineStyle(2, 0x2ECC40);
        }


        graphics.drawEllipse(0.5 * Globals.cellWidth, 0.5 * Globals.cellHeight, Globals.cellWidth / 3, Globals.cellHeight / 3);
        graphics.lineStyle(.5, 0xFFF);
        graphics.drawEllipse(0.5 * Globals.cellWidth, 0.5 * Globals.cellHeight, Globals.cellWidth / 3 + 1, Globals.cellHeight / 3 + 1);
        graphics.drawEllipse(0.5 * Globals.cellWidth, 0.5 * Globals.cellHeight, Globals.cellWidth / 3 - 1, Globals.cellHeight / 3 - 1);
        graphics.endFill();
        graphics.antiAlias = true;

        this._sprite = graphics;
        return this._sprite;
    }

    set displayObject(displayObject) {
        this._sprite = displayObject;
    }

    beginLaser(targetX, targetY) {
        if (!this.laser) {
            this.laser = new Laser(this.stage, this.renderer, this.x + 0.5 * Globals.cellWidth, this.y + 0.5 * Globals.cellHeight, targetX + 0.5 * Globals.cellWidth, targetY + 0.5 * Globals.cellHeight);
        }
    }

    endLaser() {
        if (this.laser) {
            this.laser.destroy();
            this.laser = null;
        }
    }

    destroyUnit() {
        //mark this unit for destruction
        this.death = true;
    }

    deathAnimation() {
        //animate this units death
        if (this.deathAnimationTick > this.deathAnimationTicks) {
            //TODO: call remove function
            return;
        }
        //slowly fade the sprite
        let alpha = 1 - this.deathAnimationTick / this.deathAnimationTicks;
        this.displayObject.alpha = alpha;

        this.deathAnimationTick++;
    }

}

module.exports = Troop;
