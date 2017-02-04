var state = play;
var renderer;
var stage;
var grid;

var player;

var gridSize = 50;
var numberOfCells = 15;

var stats;

var clickTime;
var self = this;

var dragging = false;
var previousMousePosition;
var totalOffset = {};
var newOffset = {};

var highlightingTile;
var highlightGraphics;
var selectedGraphics;
var selectedTile = {};

var s;

setup();

function setup() {

    newOffset.x = 0;
    newOffset.y = 0;

    totalOffset.x = 0;
    totalOffset.y = 0;
    renderer = PIXI.autoDetectRenderer(0,0,{antialias: true,"resolution":1});
    renderer.view.style.position = "absolute";
    renderer.view.style.display = "block";
    renderer.autoResize = true;
    renderer.resize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.view);

    var interactive = true;
    stage = new PIXI.Container(0x66FF99, interactive);

    //initialize the grid with line segments
    grid = new PIXI.Graphics();
    grid.lineStyle(2, 0xCCCCCC, 0.3);

    for(let i = 0; i < numberOfCells + 1; i++) {
        grid.moveTo(0, i*gridSize);
        grid.lineTo(numberOfCells*gridSize,i*gridSize);
    }

    for(let j = 0; j < numberOfCells + 1; j++) {
        grid.moveTo(j*gridSize, 0);
        grid.lineTo(j*gridSize, numberOfCells*gridSize);
    }

    grid.endFill();
    //grid of linesegments is completed, add it to the stage

    stage.addChild(grid);


    previousMousePosition = {};

    //add a statistics panel
    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    //add mousedown function for dragging and clicking
    renderer.plugins.interaction.on('mousedown', function(mousedata){
        self.clickTime = +new Date();
        self.dragging = true;
        self.previousMousePosition.x = +mousedata.data.global.x;
        self.previousMousePosition.y = +mousedata.data.global.y;

        let coordinates = getGridCoordinates(mousedata.data.global);
        createUnit(coordinates);

        // console.log(self.previousMousePosition)
    });
    //add mouseup function for dragging and clicking
    renderer.plugins.interaction.on('mouseup', function(mousedata) {
        selectedTile = {};
        let currentTime = +new Date();
        //console.log(currentTime - self.clickTime);
        if(currentTime - self.clickTime <= 200) {
            //if it was a short click we are not dragging but instead we wanted to select
            if(highlightingTile) {
                selectedTile.x = +highlightingTile.x;
                selectedTile.y = +highlightingTile.y;
            }
            // console.log(getGridCoordinates(mousedata.data.global));
            //self.createBuilding(getMouseWithoutOffset(mousedata.data.global));
        } else {

        }
        self.dragging = false;
    });

    renderer.plugins.interaction.on('mousemove', function(mousedata) {
        if(self.dragging) {
            //move the current view
            self.newOffset.x = mousedata.data.global.x - self.previousMousePosition.x;
            self.newOffset.y = mousedata.data.global.y - self.previousMousePosition.y;
            //console.log(mousedata.data.global.x);
            //console.log(self.previousMousePosition.x);
            //console.log(newOffset);
            self.previousMousePosition.x = +mousedata.data.global.x;
            self.previousMousePosition.y = +mousedata.data.global.y;
        }
        //determine coordinates based on scaling
        let coordinates = getGridCoordinates(mousedata.data.global);
        if(coordinates.x >= 0 && coordinates.y >= 0 && coordinates.x < numberOfCells && coordinates.y < numberOfCells) {
            highlightingTile = coordinates;
        } else {
            highlightingTile = {};
        }
    });

    s = new State();

    gameLoop();
}

//main game loop
function gameLoop() {
    stats.begin();

    state();

    renderer.render(stage);

    stats.end();
    requestAnimationFrame(gameLoop);
}

function play() {
    //console.log(self.newOffset);
    //move the stage it it was dragged
    stage.pivot.x -= self.newOffset.x;
    stage.pivot.y -= self.newOffset.y;
    totalOffset.x += self.newOffset.x;
    totalOffset.y += self.newOffset.y;
    self.newOffset.x = 0;
    self.newOffset.y = 0;

    if(highlightGraphics) {
        highlightGraphics.destroy();
        stage.removeChild(highlightGraphics);
    }
    if(highlightingTile) {
        highlightGraphics = new PIXI.Graphics();
        highlightGraphics.lineStyle(4, 0xFF3300, 1);
        highlightGraphics.drawRect(highlightingTile.x*gridSize, highlightingTile.y*gridSize, gridSize, gridSize);
        highlightGraphics.endFill();
        stage.addChild(highlightGraphics);
    }

    if(selectedGraphics) {
        selectedGraphics.destroy();
        stage.removeChild(selectedGraphics);
    }

    if(selectedTile) {
        selectedGraphics = new PIXI.Graphics();
        selectedGraphics.lineStyle(4, 0x33FF00, 1);
        selectedGraphics.drawRect(selectedTile.x*gridSize, selectedTile.y*gridSize, gridSize, gridSize);
        selectedGraphics.endFill();
        stage.addChild(selectedGraphics);
    }
}

function getMouseWithoutOffset(mousecoordinates) {
    let coordinates = {};
    coordinates.x = mousecoordinates.x - totalOffset.x;
    coordinates.y = mousecoordinates.y - totalOffset.y;
    return coordinates;
}

function getGridCoordinates(mousecoordinates) {
    let noOffsetCoordinates = getMouseWithoutOffset(mousecoordinates);
    let coordinates = {};
    coordinates.x = Math.floor(noOffsetCoordinates.x / gridSize);
    coordinates.y = Math.floor(noOffsetCoordinates.y / gridSize);
    return coordinates;

}

function createUnit(coordinates) {

    let testUnit = new Unit(stage,coordinates);
    testUnit.test();
}
