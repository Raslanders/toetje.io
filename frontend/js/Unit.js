class Unit extends Entity {

    //Coordinates are grid coordinates
    constructor(stage,coordinates)
    {
        super(stage,coordinates);

        this.gridSize = 50;

        let unit = new PIXI.Graphics();
        // unit.lineStyle(4, 0x000000, 1);
        unit.beginFill(0x66CCFF);
        unit.drawCircle((coordinates.x+0.5)*gridSize, (coordinates.y+0.5)*gridSize,gridSize/3)
        // unit.drawRect(coordinates.x*gridSize, coordinates.y*gridSize, gridSize, gridSize);
        unit.endFill();
        stage.addChild(unit);
    }

    test() {
        console.log("t");
        console.log(this.x);
    }


    move(newX,newY){

    }
}
