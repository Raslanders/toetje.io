const PIXI = require('pixi.js');
const Stats = require('stats.js');
const State = require('../data/State');
const Unit = require('../models/Unit');
const CanvasState = require('./CanvasState');

class Renderer {
    constructor() {
        this.gridSize = 50;
        this.numberOfCells = 15;
        this.newOffset = {};
        this.newOffset.x = 0;
        this.newOffset.y = 0;

        this.totalOffset = {};
        this.totalOffset.x = 0;
        this.totalOffset.y = 0;

        this.previousMousePosition = {};

        this.clickTime = null;

        this.dragging = false;

        this.highlightingTile = {};
        this.highlightGraphics = null;
        this.selectedTile = {};
        this.selectedGraphics = null;

        this.entities = [];

        this.renderer = PIXI.autoDetectRenderer(0,0,{antialias: true});
        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.display = "block";
        this.renderer.autoResize = true;
        this.renderer.resize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.view);

        var interactive = true;
        this.stage = new PIXI.Container(0x66FF99, interactive);

        //initialize the grid with line segments
        this.grid = new PIXI.Graphics();
        this.grid.lineStyle(2, 0xCCCCCC, 0.3);

        for(let i = 0; i < this.numberOfCells + 1; i++) {
            this.grid.moveTo(0, i*this.gridSize);
            this.grid.lineTo(this.numberOfCells*this.gridSize,i*this.gridSize);
        }

        for(let j = 0; j < this.numberOfCells + 1; j++) {
            this.grid.moveTo(j*this.gridSize, 0);
            this.grid.lineTo(j*this.gridSize, this.numberOfCells * this.gridSize);
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
            this.clickTime = +new Date();
            this.dragging = true;
            this.previousMousePosition.x = +mousedata.data.global.x;
            this.previousMousePosition.y = +mousedata.data.global.y;

            let coordinates = this.getGridCoordinates(mousedata.data.global);
            this.createUnit(coordinates);
        });
        //add mouseup function for dragging and clicking
        this.renderer.plugins.interaction.on('mouseup', mousedata => {
            this.selectedTile = {};
            let currentTime = +new Date();
            if(currentTime - this.clickTime <= 200) {
                //if it was a short click we are not dragging but instead we wanted to select
                if(this.highlightingTile) {
                    this.selectedTile.x = +this.highlightingTile.x;
                    this.selectedTile.y = +this.highlightingTile.y;
                }
            }
            this.dragging = false;
        });

        this.renderer.plugins.interaction.on('mousemove', mousedata => {
            if(this.dragging) {
                //move the current view
                this.newOffset.x = mousedata.data.global.x - this.previousMousePosition.x;
                this.newOffset.y = mousedata.data.global.y - this.previousMousePosition.y;

                this.previousMousePosition.x = +mousedata.data.global.x;
                this.previousMousePosition.y = +mousedata.data.global.y;
            }
            //determine coordinates based on scaling
            let coordinates = this.getGridCoordinates(mousedata.data.global);
            if(coordinates.x >= 0 && coordinates.y >= 0 && coordinates.x < this.numberOfCells && coordinates.y < this.numberOfCells) {
                this.highlightingTile = coordinates;
            } else {
                this.highlightingTile = {};
            }
        });

        this.state = new State();

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
        if(this.newOffset.x) {
            this.stage.pivot.x -= this.newOffset.x;
            this.totalOffset.x += this.newOffset.x;
            this.newOffset.x = 0;
        }
        if(this.newOffset.y) {
            this.stage.pivot.y -= this.newOffset.y;
            this.totalOffset.y += this.newOffset.y;
            this.newOffset.y = 0;
        }



        if(this.highlightGraphics && !this.highlightingTile) {
            this.highlightGraphics.destroy();
            this.stage.removeChild(this.highlightGraphics);
        }
        if(this.highlightingTile) {
            this.highlightGraphics = new PIXI.Graphics();
            this.highlightGraphics.lineStyle(4, 0xFF3300, 1);
            this.highlightGraphics.drawRect(this.highlightingTile.x*this.gridSize, this.highlightingTile.y*this.gridSize, this.gridSize, this.gridSize);
            this.highlightGraphics.endFill();
            this.stage.addChild(this.highlightGraphics);
        }

        if(this.selectedGraphics && !this.selectedTile) {
            this.selectedGraphics.destroy();
            this.stage.removeChild(this.selectedGraphics);
        }

        if(this.selectedTile) {
            this.selectedGraphics = new PIXI.Graphics();
            this.selectedGraphics.lineStyle(4, 0x33FF00, 1);
            this.selectedGraphics.drawRect(this.selectedTile.x*this.gridSize, this.selectedTile.y*this.gridSize, this.gridSize, this.gridSize);
            this.selectedGraphics.endFill();
            this.selectedGraphics.selectedTile = {};
            this.selectedGraphics.selectedTile.x = this.selectedTile.x;
            this.selectedGraphics.selectedTile.y = this.selectedTile.y;
            this.stage.addChild(this.selectedGraphics);
        }

        //animate all entities
        this.entities.forEach(function(item,index,array){
            "use strict";
            item.animate();
        });
    }

    getMouseWithoutOffset(mousecoordinates) {
        let coordinates = {};
        coordinates.x = mousecoordinates.x - this.totalOffset.x;
        coordinates.y = mousecoordinates.y - this.totalOffset.y;
        return coordinates;
    }

    getGridCoordinates(mousecoordinates) {
        let noOffsetCoordinates = this.getMouseWithoutOffset(mousecoordinates);
        let coordinates = {};
        coordinates.x = Math.floor(noOffsetCoordinates.x / this.gridSize);
        coordinates.y = Math.floor(noOffsetCoordinates.y / this.gridSize);
        return coordinates;
    }

    createUnit(coordinates) {
        this.testUnit = new Unit(this.stage, coordinates);

        this.entities.push(this.testUnit);
        let newX = coordinates.x + 0.5;
        let newY = coordinates.y + 0.5;
        this.testUnit.attack(newX, newY);
    }
}

module.exports = Renderer;