const Entity = require("./Entity");
const PIXI = require('pixi.js');

class Troop extends Entity {

    //Coordinates are grid coordinates
    render(stage, renderer, position) {
        super.render(stage, renderer);

        this.gridSize = 50;
        //allows 1 movement in the x direction in 1 movement in the y direction per tick
        this.movePerTick = 5;
        //total amount of ticks for the attack animation
        this.attackAnimationTicks = 60;
        //current tick in the attack animation
        this.attackAnimationTick = 0;

        //target coordinates of the attack
        this.targetPosition;
        //the positions this unit was on before the attack animation
        this.originalPosition;

        this.newX = position.x;
        this.newY = position.y;

        this.add(position);
    }

    attack(targetX, targetY) {
        this.targetPosition = {x: targetX, y: targetY};
        this.originalPosition = {x: this.x, y: this.y};
    }

    moveTo(newX, newY) {
        this.newX = newX;
        this.newY = newY;
    }

    animate() {
        if (this.animateMovement()) {
            return;
            //the unit has not moved
        }
        // attack movement
        // if (this.targetPosition) {
        //     this.animateAttack(this.targetPosition.x, this.targetPosition.y)
        // }
    }


    //TargetCoordinates contains the coordinates of the target unit
    animateAttack(targetX, targetY) {
        this.attackAnimationTick++;
        if (this.attackAnimationTick > this.attackAnimationTicks) {
            this.attackAnimationTick -= this.attackAnimationTicks;
            //reset the animation, reset x,y to handle rounding errors
            this.x = this.originalPosition.x;
            this.y = this.originalPosition.y;
            return;
        }

        let xDiff, yDiff;
        if (this.attackAnimationTick < this.attackAnimationTicks / 3) {
            //go towards the targetX
            xDiff = targetX - this.x;
            yDiff = targetY - this.y;
        } else if (this.attackAnimationTick < 2 * this.attackAnimationTicks / 3) {
            //go back to the original positions
            //newX and newY contain the original positions of x and y
            xDiff = this.x - targetX;
            yDiff = this.y - targetY;
        } else {
            //stay still for a moment
            return;
        }

        if (xDiff == 0 && yDiff == 0) {
            //no movement required
            return false;
        }
        //xDiff and yDiff contain the total distance to the target.

        //speed is defined such that in attackAnimationTicks/2 we reach the target
        let xSpeed = xDiff / (this.attackAnimationTicks / 2);
        let ySpeed = yDiff / (this.attackAnimationTicks / 2);
        this.x = this.x + xSpeed;
        this.y = this.y + ySpeed;
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
        //figure out the new coordinates with a manhattat distance of at most 2
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
        const graphics = new PIXI.Graphics();

        graphics.beginFill(0x66CCFF);
        graphics.drawCircle(0.5 * this.gridSize, 0.5 * this.gridSize, this.gridSize / 3);
        graphics.endFill();
        graphics.antiAlias = true;

        this._sprite = graphics;
        return this._sprite;
    }

}

module.exports = Troop;
