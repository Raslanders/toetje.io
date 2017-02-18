const Building = require('./Building');
const Troop = require('./Troop');
const Entity = require('./Entity');
const Globals = require('../data/Globals');

class Tile extends Entity {
    constructor(position, type) {
        super();
        this.position = position;
        this.type = type;
        this.owner = null;
        this.building = null;
        this.troop = null;
        this.timeout = 0;
    }

    render(stage, renderer) {
        super.render(stage, renderer);
        this.add({
            x: this.position.x * Globals.cellWidth,
            y: this.position.y * Globals.cellHeight,
        });
    }

    animate() {
        // this.timeout++;
        // if (this.timeout > 5) {
        //     let random = Math.random() <= 0.5 ? 0.005 : -0.005;
        //     this.displayObject.alpha += random;
        //     if (this.displayObject.alpha < 0.8) {
        //         this.displayObject.alpha = 0.8;
        //     } else if (this.displayObject.alpha > 1) {
        //         this.displayObject.alpha = 1;
        //     }
        //     this.timeout = 0;
        // }
        return true;
    }

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
        let tileGraphics = new PIXI.Graphics();
        tileGraphics.lineStyle(1, 0xCCCCCC, 0.1);
        if(this.type != "lane" && this.type != "building" && this.type != "base") {
            tileGraphics.lineStyle(1, 0xCCCCCC, 0.2);
            tileGraphics.beginFill(0x333333, 0.8);
            const cw = Globals.cellWidth;
            const ch = Globals.cellHeight;
            const leftBottom = new PIXI.Point(0, 0);
            const rightBottom = new PIXI.Point(cw, ch / 2);
            const rightUp = new PIXI.Point(cw - ch, (cw + ch) / 2);
            const leftUp = new PIXI.Point(-ch, ch / 2);
            tileGraphics.drawPolygon(leftBottom, rightBottom, rightUp, leftUp, leftBottom);
            tileGraphics.endFill();

            const texture = this.renderer.generateTexture(tileGraphics);
            this._sprite = new PIXI.Sprite(texture);
        }
        else {
            const sprite = PIXI.Sprite.fromImage("static/tile-template.png");
            this._sprite = sprite;
        }
        //  else if(this.type == "building" && this.owner == 1) {
        //     tileGraphics.beginFill(0x66c2a5, 0.8);
        // } else if(this.type == "building" && this.owner == 2) {
        //     tileGraphics.beginFill(0xfc8d62, 0.8);
        // } else if(this.type == "base" && this.owner == 1) {
        //     tileGraphics.lineStyle(1, 0x66c2a5, 0.8);
        //     tileGraphics.beginFill(0x333333, 0.8);
        // } else if(this.type == "base" && this.owner == 2) {
        //     tileGraphics.lineStyle(1, 0xfc8d62, 0.8);
        //     tileGraphics.beginFill(0x333333, 0.8);
        // }



        // Sprite magic
        // const sprite = PIXI.Sprite.fromImage("static/tile-template.png");


        return this._sprite;
    }

    set displayObject(displayObject) {
        this._sprite = displayObject;
    }
}

module.exports = Tile;
