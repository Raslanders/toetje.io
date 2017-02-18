const Entity = require("./Entity");
const PIXI = require('pixi.js');
const Laser = require('./Laser');
const Globals = require('../data/Globals');


class Troop extends Entity {
    constructor(data, gameRenderer) {
        super();
        this.gridPosition = {x:data.position.x,y:data.position.y};
        this.updateFromTick(data);
        this.gameRenderer = gameRenderer;
        this.dead = false;
        this.entityType = "Troop";
    }

    updateFromTick(data) {
        //unique id of the unit
        this.id = data.id;
        //name of the unit
        this.name = data.name;

        //gridPosition is in tile coordinates
        if (this.gridPosition) {
            //we already had a grid position, check if we moved
            if (this.x !== data.position.x || this.y !== data.position.y) {
                // we moved, set coordinates for animation
                this.moveTo({x: data.position.x * Globals.cellWidth, y: data.position.y * Globals.cellHeight});
            }
        }
        this.health = data.health;

        //update the tile position
        this.gridPosition = data.position;
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
    render(stage, groups, renderer) {
        super.render(stage, groups, renderer);

        // allows 1 movement in the x direction in 1 movement in the y direction per tick
        this.movePerTick = 1;

        // current deathAnimation tick
        this.deathAnimationTick = 0;
        // death animation time
        this.deathAnimationTicks = 60;

        // Place of the next movement in regular x,y coordinates
        const pos = {x: this.gridPosition.x * Globals.cellWidth, y: this.gridPosition.y * Globals.cellHeight};
        this.newPosition = this.screenToIso(pos);

        this.add(pos);
    }

    moveTo(position) {
        // positions are in screen coordinates
        this.newPosition = this.screenToIso(position);
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
        if (this.x !== this.newPosition.x || this.y !== this.newPosition.y) {
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
        if (this.x === this.newPosition.x && this.y === this.newPosition.y) {
            return false;
        }
        let xDiff = this.newPosition.x - this.x;
        let yDiff = this.newPosition.y - this.y;

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
                this.deathGraphic.beginFill(0xfc8d62, 0.4);
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
                this.deathGraphic.beginFill(0xfc8d62, 0.4);
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
