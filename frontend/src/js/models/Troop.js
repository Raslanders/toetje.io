const Entity = require('./Entity');

class Troop extends Entity {

    //Coordinates are grid coordinates
    constructor(stage, coordinates) {
        super(stage, coordinates);

        this.gridSize = 50;
        //allows 1 movement in the x direction in 1 movement in the y direction per tick
        this.movePerTick = 1 / 60;
        //total amount of ticks for the attack animation
        this.attackAnimationTicks = 60;
        //current tick in the attack animation
        this.attackAnimationTick = 0;

        //target coordinates of the attack
        this.targetPosition;
        //the positions this unit was on before the attack animation
        this.originalPosition;

        //coordinates for a movement
        this.newX = 0 + coordinates.x;
        this.newY = 0 + coordinates.y;
        this.drawSprite(coordinates);


    }

    //newX,newY is the new (grid) x and y position this unit should move to
    move(newX, newY) {
        this.originalPosition = {x: this.x, y: this.y};
        this.newX = 0 + newX;
        this.newY = 0 + newY;
    }

    attack(targetX, targetY) {
        this.targetPosition = {x: targetX, y: targetY};
        this.originalPosition = {x: this.x, y: this.y};

    }

    //animates the movement of the unit
    animate() {
        if (this.animateMovement()) {
            return;
            //the unit has not moved
        }
        //attack movement
        if (this.targetPosition) {
            this.animateAttack(this.targetPosition.x, this.targetPosition.y)
        }
    }


    //TargetCoordinates contains the coordinates of the target unit
    animateAttack(targetX, targetY) {
        this.attackAnimationTick++;
        if (this.attackAnimationTick > this.attackAnimationTicks) {
            this.attackAnimationTick -= this.attackAnimationTicks;
            //reset the animation, reset x,y to handle rounding errors
            this.x = this.originalPosition.x;
            this.y = this.originalPosition.y;

            this.removeSprite();
            this.drawSprite({x: this.newX, y: this.newY});
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


        this.removeSprite();
        this.drawSprite({x: this.x, y: this.y});
    }

    //return true if this unit has moved
    animateMovement() {
        if (this.originalPosition.x == this.newX && this.originalPosition.y == this.newY) {
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


        this.removeSprite();
        this.drawSprite({x: this.x, y: this.y});
        return true;
    }

    removeSprite() {
        if (this.sprite) {
            this.sprite.destroy();
            this.stage.removeChild(this.sprite);
        }
    }

    //draws the sprite of this unit on the given coordinates
    drawSprite(coordinates) {
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0x66CCFF);
        this.sprite.drawCircle((coordinates.x + 0.5) * this.gridSize, (coordinates.y + 0.5) * this.gridSize, this.gridSize / 3)
        this.sprite.endFill();
        this.stage.addChild(this.sprite);
    }


}

module.exports = Troop;
