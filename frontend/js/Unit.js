class Unit extends Entity {

    //Coordinates are grid coordinates
    constructor(stage, coordinates) {
        super(stage, coordinates);

        this.gridSize = 50;
        //allows 1 movement in the x direction in 1 movement in the y direction per tick
        this.movePerTick = 1/60;

        this.newX = 0+coordinates.x;
        this.newY = 0+coordinates.y;
        this.drawSprite(coordinates);

    }

    //newX,newY is the new (grid) x and y position this unit should move to
    move(newX, newY) {
        this.newX = 0 + newX;
        this.newY = 0 + newY;
    }

    //animates the movement of the unit
    animate() {
        let xDiff = this.newX - this.x;
        let yDiff = this.newY - this.y;

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
        this.drawSprite({x:this.x, y:this.y});
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
        this.sprite.drawCircle((coordinates.x + 0.5) * gridSize, (coordinates.y + 0.5) * gridSize, gridSize / 3)
        this.sprite.endFill();
        this.stage.addChild(this.sprite);
    }


}
