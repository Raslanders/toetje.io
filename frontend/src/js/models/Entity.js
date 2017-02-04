class Entity {
    constructor(stage, pivot) {
        this.pivot.x = +pivot.x;
        this.pivot.y = +pivot.y;
        this.stage = stage;
    }

    animate(){
        throw new TypeError("Method animate should have been overridden");
    }

    texture(){
        throw new TypeError("Method texture should have been overridden");
    }
}

module.exports = Entity;