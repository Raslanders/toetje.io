const Entity = require("./Entity");
const PIXI = require('pixi.js');
const Laser = require('./Laser');

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

        //whether this unit is dead
        this.death = false;
        //current deathAnimation tick
        this.deathAnimationTick = 0;
        //death animation time
        this.deathAnimationTicks = 60;

        this.laser;

        //target coordinates of the attack
        this.targetPosition;

        this.newX = position.x;
        this.newY = position.y;

        this.add(position);
    }

    attack(targetX, targetY) {
        this.targetPosition = {x: targetX, y: targetY};
    }

    stopAttack()
    {
        this.targetPosition = null;
    }

    moveTo(newX, newY) {
        this.newX = newX;
        this.newY = newY;
    }

    animate() {
        if (this.isRendered == false) {
            //can't animate a non rendered troop
            return;
        }
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

        graphics.lineStyle(2, 0x66CCFF);
        graphics.drawCircle(0.5 * this.gridSize, 0.5 * this.gridSize, this.gridSize / 3);
        graphics.lineStyle(.5, 0xFFF);
        graphics.drawCircle(0.5 * this.gridSize, 0.5 * this.gridSize, this.gridSize / 3 + 1);
        graphics.drawCircle(0.5 * this.gridSize, 0.5 * this.gridSize, this.gridSize / 3 - 1);
        graphics.endFill();
        graphics.antiAlias = true;

        this._sprite = graphics;
        return this._sprite;
    }


    beginLaser(targetX, targetY) {
        if (!this.laser) {
            this.laser = new Laser(this.stage, this.renderer, this.x + 0.5 * this.gridSize, this.y + 0.5 * this.gridSize, targetX + 0.5 * this.gridSize, targetY + 0.5 * this.gridSize);
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
