class Tile {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;

        this.type = type;
    }

    setType(type) {
        this.type = type;
    }
}

module.exports = Tile;