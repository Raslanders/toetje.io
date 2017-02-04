class Tile {
    constructor(position, type) {
        this.position = position;
        this.type = type;
    }

    setType(type) {
        this.type = type;
    }

    parse(data) {
        if (data.type === 'empty') return;
    }
}

module.exports = Tile;
