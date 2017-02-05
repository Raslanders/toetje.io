const Entity = require("./Entity");

class Unit extends Entity {

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

        this.deathTick = 0;
        this.deathTicks = 60;
        this.death = false;

        //target coordinates of the attack
        this.targetPosition;
        //the positions this unit was on before the attack animation
        this.originalPosition;

        this.laser;
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
    }

    //animates the movement of the unit
    animate() {
        if (this.death == true) {
            this.deathAnimation();
            return;
        }

        // if (this.animateMovement()) {
        //     return;
        //     //the unit has not moved
        // }
        //attack movement
        if (this.targetPosition) {
            this.animateAttack(this.targetPosition.x, this.targetPosition.y)
        }
    }


    //TargetCoordinates contains the coordinates of the target unit
    animateAttack(targetX, targetY) {

        if (this.attackAnimationTick == this.attackAnimationTicks) {
            this.attackAnimationTick -= this.attackAnimationTicks;
        }


        if (this.attackAnimationTick == 0) {
            this.beginLaser(targetX, targetY);
            console.log("Begin laser");
        } else if (this.attackAnimationTick == this.attackAnimationTicks / 3) {
            this.endLaser();
            console.log("end laser");
        }
        this.attackAnimationTick++;
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
    drawSprite(coordinates, alpha = 1) {
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0x66CCFF,alpha);
        this.sprite.drawCircle((coordinates.x + 0.5) * this.gridSize, (coordinates.y + 0.5) * this.gridSize, this.gridSize / 3);
        this.sprite.endFill();
        this.stage.addChild(this.sprite);
    }


    beginLaser(targetX, targetY) {
        let coordinates = {x: 5, y: 5};
        this.laser = new PIXI.Graphics();
        this.laser.lineStyle(5, 0xFF0000, 1);

        this.laser.moveTo((this.x + 0.5) * this.gridSize, (this.y + 0.5) * this.gridSize);
        this.laser.lineTo((targetX + 0.5) * this.gridSize, (targetY + 0.5) * this.gridSize);
        this.stage.addChild(this.laser);

    }

    endLaser() {
        if (this.laser) {
            this.laser.destroy();
            this.stage.removeChild(this.laser);
        }
    }

    destroyUnit() {
        this.death = true;
    }

    deathAnimation() {
        if (this.deathTick > this.deathTicks) {
            //TODO: call remove function
            return;
        }
        this.removeSprite();
        let alpha = 1 - this.deathTick / this.deathTicks;
        console.log(alpha);
        this.drawSprite({x: this.x, y: this.y}, alpha)
        this.deathTick++;
    }
}

module.exports = Unit;