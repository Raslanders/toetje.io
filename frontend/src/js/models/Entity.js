class Entity {
    constructor(stage, coordinates) {
        this.x = 0+coordinates.x;
        this.y = 0+coordinates.y;
        this.stage = stage;
    }

    animate(){
        throw new TypeError("Method animate should have been overridden");
    }
}

module.exports = Entity;