const Entity = require("./Entity");
const PIXI = require('pixi.js');
const Laser = require('./Laser');
const Globals = require('../data/Globals');


class Troop extends Entity {
    constructor(data, gameRenderer) {
        super();
        this.position = {x:data.position.x,y:data.position.y};
        this.updateFromTick(data);
        this.gameRenderer = gameRenderer;
        this.dead = false;

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
            if (this.x !== data.position.x || this.y !== data.position.y) {
                //we moved, set coordinates for animation
                this.moveTo(data.position.x * Globals.cellWidth, data.position.y * Globals.cellHeight);
            }
        }
        this.health = data.health;

        //update the tile position
        this.position = data.position;
        //owner id of the unit
        this.owner = data.owner;
        //direction this unit is moving in
        this.direction = data.direction;

        if (this.targetPosition != data.target) {
            this.endLaser();
            this.targetPosition = data.target ? data.target : null;
        }
    }

    //Coordinates are grid coordinates
    render(stage, renderer) {
        super.render(stage, renderer);

        //allows 1 movement in the x direction in 1 movement in the y direction per tick
        this.movePerTick = 1;

        //current deathAnimation tick
        this.deathAnimationTick = 0;
        //death animation time
        this.deathAnimationTicks = 60;

        //Place of the next movement in screen coordinates
        this.newX = this.position.x * Globals.cellWidth;
        this.newY = this.position.y * Globals.cellHeight;

        this.add({x: this.newX, y: this.newY});
    }

    moveTo(newX, newY) {
        //positions are in screen coordinates
        this.newX = newX;
        this.newY = newY;
    }

    animate() {
        if (this.health <= 0 && !this.dead) {
            //We have to start the dead animation and have to stop firing
            this.endLaser();
            this.deathAnimation();
            return true;
        }
        if (this.health <= 0) {
            // Return false, we no longer want to keep animating
            return false;
        }

        this.animateAttack(this.targetPosition);

        // move
        if (this.x !== this.newX || this.y !== this.newY) {
            //show animation movement
            this.animateMovement();
        }
        return true;
    }


    //TargetCoordinates contains the coordinates of the target unit
    animateAttack(position) {
        if (!this.laser && position) {
            this.beginLaser(position.x * Globals.cellWidth, position.y * Globals.cellHeight);
        } else if (this.laser && !position) {
            this.endLaser();
        }
    }

    //return true if this unit has moved
    animateMovement() {
        if (this.x === this.newX && this.y === this.newY) {
            return false;
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

    destroy() {
        super.destroy();
    }


    get displayObject() {
        if (this._sprite) {
            return this._sprite;
        }
        // Graphics
        const graphics = new PIXI.Graphics();
        if (this.owner == 1) {
            graphics.lineStyle(2, 0xFF4136);
        }
        if (this.owner == 2) {
            graphics.lineStyle(2, 0x66CCFF);
        }
        if (this.owner == 4) {
            graphics.lineStyle(2, 0xFFDC00);
        }
        if (this.owner == 3) {
            graphics.lineStyle(2, 0x2ECC40);
        }

        graphics.drawEllipse(0.5 * Globals.cellWidth, 0.5 * Globals.cellHeight, Globals.cellWidth / 3, Globals.cellHeight / 3);
        graphics.lineStyle(0.5, 0xFFF);
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
            this.laser = new Laser(
                this.x + 0.5 * Globals.cellWidth,
                this.y + 0.5 * Globals.cellHeight,
                targetX+0.5*Globals.cellWidth,
                targetY+0.5*Globals.cellHeight,
                this.owner
            );
            this.gameRenderer.addToQueue(this.laser, true);
        }
    }

    endLaser() {
        if (this.laser) {
            this.laser.destroy();
            this.laser = null;
        }
    }

    deathAnimation() {
        if(this.deathAnimationTick > this.deathAnimationTicks) {
            this.destroy();
            this.gameRenderer.stage.removeChild(this.deathGraphic);
            this.dead = true;
            return;
        }
        if(this.deathAnimationTick == 0) {
            this.deathGraphic = new PIXI.Graphics();
            for (let i = 0; i < 10; i++) {
                let randomHex = 100*(Math.random()-0.5) * 16 * 16 + 100*(Math.random()-0.5) * 16 + 100*(Math.random()-0.5);
                let c = 0xfc8d62 - randomHex;
                this.deathGraphic.beginFill(c, 0.4);
                let width = Globals.cellWidth * Math.random();
                let height = Globals.cellHeight * Math.random();
                this.deathGraphic.drawRect(this.x - (Math.random() - 0.5) * Globals.cellWidth, this.y - (Math.random() - 0.5) * Globals.cellHeight, width, height);
                this.deathGraphic.endFill();
            }
            this.stage.addChild(this.deathGraphic);
        }
        if(this.deathAnimationTick > 0) {
            this.deathGraphic.clear();
            for (let i = 0; i < 10; i++) {
                let randomHex = 100*(Math.random()-0.5) * 16 * 16 + 100*(Math.random()-0.5) * 16 + 100*(Math.random()-0.5);
                let c = 0xfc8d62 - randomHex;
                this.deathGraphic.beginFill(c, 0.4);
                let width = Globals.cellWidth * Math.random();
                let height = Globals.cellHeight * Math.random();
                this.deathGraphic.drawRect(this.x - (Math.random() - 0.5) * Globals.cellWidth, this.y - (Math.random() - 0.5) * Globals.cellHeight, width, height);
                this.deathGraphic.endFill();
            }
        }


        /*
        if(this.deathAnimationTick == 0) {
            this.deathAnimationTick++;
            this.explosion = new PIXI.extras.AnimatedSprite(this.gameRenderer.explosionTextures);
            this.explosion.x = this.x;
            this.explosion.y = this.y;
            this.explosion.anchor.set(0.5);

            this.explosion.rotation = Math.random() * Math.PI;
            this.explosion.scale.set(0.75 + Math.random() * 0.5);
            this.explosion.gotoAndPlay(Math.random() * 27);
            this.gameRenderer.stage.addChild(this.explosion);
        }
           */
        this.deathAnimationTick++;
    }

}

module.exports = Troop;
