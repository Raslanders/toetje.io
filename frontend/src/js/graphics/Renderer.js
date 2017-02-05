'use strict';

const PIXI = require('pixi.js');
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

        this.renderer = PIXI.autoDetectRenderer(0,0, { autoResize: true, antialias: true } );
        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.display = "block";
        this.renderer.autoResize = true;
        this.renderer.resize(container.offsetWidth, container.offsetHeight);
        container.appendChild(this.renderer.view);

        window.onresize = event => {
            this.renderer.resize(container.offsetWidth, container.offsetHeight);
        };

        this.state = new State(this);
        this.canvasState = new CanvasState();

        //Create new PIXI container in interactive mode
        this.stage = new PIXI.Container(0x66FF99, true);

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
        this.drawQueue();
        this.updateAnimations();

        this.handleInput();
        this.renderer.render(this.stage);

        this.statsPanel.end();
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
            this.animated[i].animate();
        }
    }

    /**
     * Draws new objects to the scene
     */
    drawQueue() {
        while (this.queue.length > 0) {
            let entity = this.queue.pop();
            entity.render(this.stage, this.renderer);
        }
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
            selectedGraphic.lineStyle(2, 0x33FF00, 1);
            selectedGraphic.drawRect(selectedTile.x * Globals.cellWidth, selectedTile.y * Globals.cellHeight, Globals.cellWidth, Globals.cellHeight);
            selectedGraphic.endFill();
            // this.unit.moveTo(selectedTile.x * Globals.cellWidth, selectedTile.y * Globals.cellHeight);
            this.stage.addChild(selectedGraphic);
        }
    }

    handleInput() {
        let canvasDblClick = this.canvasState.getDblClick();
        if(canvasDblClick) {
            this.state.createBuilding(canvasDblClick.x, canvasDblClick.y, 1);
        }
    }
}

module.exports = Renderer;
