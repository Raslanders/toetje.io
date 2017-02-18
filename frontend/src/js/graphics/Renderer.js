'use strict';

const PIXI = require('pixi.js'); 
require('pixi-display');
const Stats = require('stats.js');
const State = require('../data/State');
const Troop = require('../models/Troop');
const Building = require('../models/Building');
const CanvasState = require('./CanvasState');
const Globals = require('../data/Globals');

class Renderer {
    constructor(container) {
        this.queue = [];
        this.animated = [];

        this.app = new PIXI.Application(0,0, { autoResize: true, antialias: true } );
        this.renderer = this.app.renderer;
        this.app.view.style.position = "absolute";
        this.app.view.style.display = "block";
        this.renderer.autoResize = true;
        this.renderer.resize(container.offsetWidth, container.offsetHeight);
        container.appendChild(this.app.view);

        window.onresize = event => {
            this.renderer.resize(container.offsetWidth, container.offsetHeight);
        };

        this.state = new State(this);
        this.canvasState = new CanvasState();

        this.stage = this.app.stage;
        this.stage.displayList = new PIXI.DisplayList();

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


        this.createGroups();
        this.gameLoop();
    }

    createGroups() {
        this.groups = {};

        // Create tile group
        this.groups.Tile = new PIXI.DisplayGroup(0, function (sprite) {
            // tiles go first
            sprite.zOrder = sprite.x - sprite.y * Globals.gridWidth;
        });

        // Create building group
        this.groups.Building = new PIXI.DisplayGroup(1, function (sprite) {
            // front goes first
            sprite.zOrder = sprite.x - sprite.y * Globals.gridWidth;
        });

        // Create troop group
        this.groups.Troop = new PIXI.DisplayGroup(2, function (sprite) {
            // front goes first
            sprite.zOrder = sprite.x - sprite.y * Globals.gridWidth;
        });

        this.groups.UI = new PIXI.DisplayGroup(5);
    }

    gameLoop() {
        this.drawState();
        this.drawQueue();
        this.updateAnimations();

        this.handleInput();
        this.renderer.render(this.stage);
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * Adds an entity to the stage queue
     * @param entity The entity to render and add to the stage
     * @param animate Whether to animate this entity every frame
     */
    addToQueue(entity, animate) {
        this.queue.push(entity);
        if (animate) {
            this.addAnimateEntity(entity);
        }
    }

    /**
     * Adds an entity to animation buffer
     * @param entity The entity to add to the animation buffer
     */
    addAnimateEntity(entity) {
        this.animated.push(entity);
    }

    /**
     * Calls the animation function of each entity which requested to be animated
     */
    updateAnimations() {
        for (let i = 0; i < this.animated.length; i++) {
            let ok = this.animated[i].animate();
            if (!ok) {
                this.animated.splice( i, 1 );
            }
        }
    }

    /**
     * Draws new objects to the scene
     */
    drawQueue() {
        while (this.queue.length > 0) {
            let entity = this.queue.pop();
            entity.render(this.stage, this.groups, this.renderer);
        }
    }

    translate(position) {
        position.x += Globals.cellWidth / 2;
        position.y += Globals.cellHeight / 2;
        let x = position.x - position.y;
        let y = (position.x + position.y) / 2;
        return {x: x, y: y}
    }

    drawState() {
        this.canvasState.handleCamera(this.stage);

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
            hoverGraphic.lineStyle(2, 0xFF3300, 1);

            let pos = this.translate({x: (hoverTile.x + 1) * Globals.cellWidth, y: hoverTile.y * Globals.cellHeight});
            hoverGraphic.moveTo(pos.x, pos.y);

            pos = this.translate({x: (hoverTile.x + 2) * Globals.cellWidth, y: hoverTile.y * Globals.cellHeight});
            hoverGraphic.lineTo(pos.x, pos.y);

            pos = this.translate({x: (hoverTile.x + 2) * Globals.cellWidth, y: (hoverTile.y + 1) * Globals.cellHeight});
            hoverGraphic.lineTo(pos.x, pos.y);

            pos = this.translate({x: (hoverTile.x + 1) * Globals.cellWidth, y: (hoverTile.y + 1) * Globals.cellHeight});
            hoverGraphic.lineTo(pos.x, pos.y);

            pos = this.translate({x: (hoverTile.x + 1) * Globals.cellWidth, y: hoverTile.y * Globals.cellHeight});
            hoverGraphic.lineTo(pos.x, pos.y);

            hoverGraphic.endFill();
            hoverGraphic.y -= 6;
            hoverGraphic.x += 3;
            hoverGraphic.displayGroup = this.groups.UI;
            this.stage.addChild(hoverGraphic);
        }

        if(selectedGraphic) {
            selectedGraphic.destroy();
            this.stage.removeChild(selectedGraphic);
        }

        if(selectedTile) {
            this.canvasState.selectedGraphic = new PIXI.Graphics();
            selectedGraphic = this.canvasState.getSelectedGraphic();
            selectedGraphic.lineStyle(2, 0x33FF00, 1);
            
            let pos = this.translate({x: (selectedTile.x + 1)* Globals.cellWidth, y: selectedTile.y * Globals.cellHeight});
            selectedGraphic.moveTo(pos.x, pos.y);

            pos = this.translate({x: (selectedTile.x + 2) * Globals.cellWidth, y: selectedTile.y * Globals.cellHeight});
            selectedGraphic.lineTo(pos.x, pos.y);

            pos = this.translate({x: (selectedTile.x + 2) * Globals.cellWidth, y: (selectedTile.y + 1) * Globals.cellHeight});
            selectedGraphic.lineTo(pos.x, pos.y);

            pos = this.translate({x: (selectedTile.x + 1) * Globals.cellWidth, y: (selectedTile.y + 1) * Globals.cellHeight});
            selectedGraphic.lineTo(pos.x, pos.y);

            pos = this.translate({x: (selectedTile.x + 1) * Globals.cellWidth, y: selectedTile.y * Globals.cellHeight});
            selectedGraphic.lineTo(pos.x, pos.y);

            selectedGraphic.endFill();
            selectedGraphic.y -= 6;
            selectedGraphic.x += 3;
            selectedGraphic.displayGroup = this.groups.UI;
            this.stage.addChild(selectedGraphic);
        }
    }

    handleInput() {
        let canvasDblClick = this.canvasState.getDblClick();
        if(canvasDblClick) {
            this.state.createBuilding(canvasDblClick.x, canvasDblClick.y);
        }
    }
}

module.exports = Renderer;
