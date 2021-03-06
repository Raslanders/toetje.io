const Building = require('./Building');
const Troop = require('./Troop');
const Entity = require('./Entity');
const Globals = require('../data/Globals');

class Tile extends Entity {
    constructor(gridPosition, type) {
        super();
        this.gridPosition = gridPosition;
        this.type = type;
        this.owner = null;
        this.building = null;
        this.troop = null;
        this.timeout = 0;
        this.entityType = "Tile";
    }

    render(stage, groups, renderer) {
        super.render(stage, groups, renderer);
        this.add({
            x: this.gridPosition.x * Globals.cellWidth,
            y: this.gridPosition.y * Globals.cellHeight
        });
    }

    animate() {}

    parse(data, gameRenderer) {
        this.type = data.type;
        this.owner = data.owner;
        gameRenderer.addToQueue(this, true);
    }

    createBuilding(gameRenderer, buildingData, techTree) {
        this.building = new Building(buildingData, techTree);
        this.building.tile = this;
        gameRenderer.addToQueue(this.building, false);
    }

    get displayObject() {
        if (this._sprite) {
            return this._sprite;
        }
        let sprite = {};
        if(this.type != "lane" && this.type != "building" && this.type != "base") {
            sprite = PIXI.Sprite.fromImage("static/tile_base.png");
        }
        else {
            sprite = PIXI.Sprite.fromImage("static/tile_lane.png");
        }
        sprite.scale.x = 0.25;
        sprite.scale.y = 0.25;
        this._sprite = sprite;

        return this._sprite;
    }

    set displayObject(displayObject) {
        this._sprite = displayObject;
    }
}

module.exports = Tile;
