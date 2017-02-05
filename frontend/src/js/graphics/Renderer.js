'use strict';

const PIXI = require('pixi.js');
const Stats = require('stats.js');
const State = require('../data/State');
const Troop = require('../models/Troop');
const CanvasState = require('./CanvasState');
const Globals = require('../data/Globals');

class Renderer {
    constructor() {
        this.state = new State();
        this.canvasState = new CanvasState();

        this.mapInitialized = false;

        this.renderer = PIXI.autoDetectRenderer(0,0, { antialias: true } );
        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.display = "block";
        this.renderer.autoResize = true;
        this.renderer.resize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.view);

        //Create new PIXI container in interactive mode
        this.stage = new PIXI.Container(0x66FF99, true);

        //initialize the grid with line segments
        this.grid = new PIXI.Graphics();
        this.grid.lineStyle(2, 0xCCCCCC, 0.3);

        for(let i = 0; i < Globals.gridWidth + 1; i++) {
            this.grid.moveTo(i * Globals.cellWidth, 0);
            this.grid.lineTo(i * Globals.cellWidth, Globals.cellHeight * Globals.gridHeight);
        }

        for(let j = 0; j < Globals.gridHeight + 1; j++) {
            this.grid.moveTo(0, j * Globals.cellHeight);
            this.grid.lineTo(Globals.cellWidth * Globals.gridWidth, j * Globals.cellHeight);
        }
        this.grid.endFill();

        //grid of linesegments is completed, add it to the stage
        this.stage.addChild(this.grid);

        //add a statistics panel
        this.statsPanel = new Stats();
        this.statsPanel.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.statsPanel.dom );

        //add mousedown function for dragging and clicking
        this.renderer.plugins.interaction.on('mousedown', mousedata => {
            this.canvasState.handleMouseDown(mousedata);
        });
        //add mouseup function for dragging and clicking
        this.renderer.plugins.interaction.on('mouseup', mousedata => {
            this.canvasState.handleMouseUp(mousedata);
        });

        this.renderer.plugins.interaction.on('mousemove', mousedata => {
            this.canvasState.handleMouseMove(mousedata);
        });

        this.gameLoop();
    }

    gameLoop() {
        this.statsPanel.begin();

        this.drawState();

        this.renderer.render(this.stage);

        this.statsPanel.end();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    drawState() {
        this.canvasState.handleCamera(this.stage);
        if(!this.mapInitialized && this.state.gameState == "started") {
            console.log('render tiles');
            this.mapInitialized = true;
            for(let i = 0; i < this.state.map.tiles.length; i++) {
                for(let j = 0; j < this.state.map.tiles[i].length; j++) {
                    let tile = this.state.map.tiles[i][j];
                    tile.setModel(this.drawTile(tile));
                }
            }
        }









        let hoverTile = this.canvasState.getHoverTile();
        let selectedTile = this.canvasState.getSelectedTile();

        let hoverGraphic = this.canvasState.getHoverGraphic();
        let selectedGraphic = this.canvasState.getSelectedGraphic();

        if(hoverGraphic) {
            hoverGraphic.destroy();
            this.stage.removeChild(hoverGraphic);
        }
        if(hoverTile) {
            this.canvasState.hoverGraphic = new PIXI.Graphics();
            hoverGraphic = this.canvasState.getHoverGraphic();
            hoverGraphic.lineStyle(4, 0xFF3300, 1);
            hoverGraphic.drawRect(hoverTile.x * Globals.cellWidth, hoverTile.y * Globals.cellHeight, Globals.cellWidth, Globals.cellHeight);
            hoverGraphic.endFill();
            this.stage.addChild(hoverGraphic);
        }

        if(selectedGraphic) {
            selectedGraphic.destroy();
            this.stage.removeChild(selectedGraphic);
        }

        if(selectedTile) {
            this.canvasState.selectedGraphic = new PIXI.Graphics();
            selectedGraphic = this.canvasState.getSelectedGraphic();
            selectedGraphic.lineStyle(4, 0x33FF00, 1);
            selectedGraphic.drawRect(selectedTile.x * Globals.cellWidth, selectedTile.y * Globals.cellHeight, Globals.cellWidth, Globals.cellHeight);
            selectedGraphic.endFill();
            this.stage.addChild(selectedGraphic);
        }
    }

    drawTile(tile) {
        let tileGraphics = new PIXI.Graphics();
        if(tile.type == "lane") {
            tileGraphics.beginFill(0xFF851B, 0.50);
        } else if(tile.type == "base" && tile.owner == 1) {
            tileGraphics.beginFill(0xFF4136, 0.50);
        } else if(tile.type == "base" && tile.owner == 2) {
            tileGraphics.beginFill(0x0074D9, 0.50);
        } else {
            tileGraphics.destroy();
            let text = new PIXI.Text('?', { fill: "#ffffff" });
            return text;
        }
        tileGraphics.drawRect(tile.position.x * Globals.cellWidth, tile.position.y * Globals.cellHeight, Globals.cellWidth, Globals.cellHeight)
        tileGraphics.endFill();
        this.stage.addChild(tileGraphics);
        return tileGraphics;
    }
}

module.exports = Renderer;
