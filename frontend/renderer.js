var state = play;
var renderer;
var stage;
var rectangle;
var grid;

var player;

var gridSize = 50;

var stats;

var clickTime;
var self = this;

var dragging = false;
var previousMousePosition;
var newOffset = {};

setup();

function setup() {
    newOffset.x = 0;
    newOffset.y = 0;
    renderer = PIXI.autoDetectRenderer();
    renderer.view.style.position = "absolute";
    renderer.view.style.display = "block";
    renderer.autoResize = true;
    renderer.resize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.view);

    var interactive = true;
    stage = new PIXI.Container(0x66FF99, interactive);

    grid = new PIXI.Graphics();
    grid.lineStyle(1, 0xCCCCCC, 1);
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 30; j++) {
            grid.drawRect(i*gridSize, j*gridSize, gridSize, gridSize);
        }
    }
    grid.endFill();
    stage.addChild(grid);
    previousMousePosition = {};
    rectangle = new PIXI.Graphics();
    rectangle.lineStyle(4, 0xFF3300, 1);
    rectangle.beginFill(0x66CCFF);
    rectangle.drawRect(0, 0, 64, 64);
    rectangle.endFill();
    rectangle.x = 170;
    rectangle.y = 170;
    stage.addChild(rectangle);

    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    renderer.plugins.interaction.on('mousedown', function(mousedata){
        self.clickTime = +new Date();
        self.dragging = true;
        self.previousMousePosition.x = +mousedata.data.global.x;
        self.previousMousePosition.y = +mousedata.data.global.y;
        console.log(self.previousMousePosition)
    });
    renderer.plugins.interaction.on('mouseup', function(mousedata) {
        let currentTime = +new Date();
        //console.log(currentTime - self.clickTime);
        if(currentTime - self.clickTime <= 500) {
            self.createBuilding(mousedata.data.global);
        } else {

        }
        self.dragging = false;
    });
    renderer.plugins.interaction.on('mousemove', function(mousedata) {
        if(self.dragging) {
            self.newOffset.x = mousedata.data.global.x - self.previousMousePosition.x;
            self.newOffset.y = mousedata.data.global.y - self.previousMousePosition.y;
            //console.log(mousedata.data.global.x);
            //console.log(self.previousMousePosition.x);
            //console.log(newOffset);
            self.previousMousePosition.x = +mousedata.data.global.x;
            self.previousMousePosition.y = +mousedata.data.global.y;
        }
    });
    gameLoop();
}

function gameLoop() {
    stats.begin();

    state();

    renderer.render(stage);

    stats.end();
    requestAnimationFrame(gameLoop);
}

function play() {
    //console.log(self.newOffset);
    stage.pivot.x -= self.newOffset.x;
    stage.pivot.y -= self.newOffset.y;
    self.newOffset.x = 0;
    self.newOffset.y = 0;
    rectangle.x = (rectangle.x + 10)
}

function createBuilding(coordinates) {
    let building = new PIXI.Graphics();
    building.lineStyle(4, 0xFF3300, 1);
    building.beginFill(0x66CCFF);
    building.drawRect(0, 0, 64, 64);
    building.endFill();
    building.x = coordinates.x;
    building.y = coordinates.y;
    stage.addChild(building);
    let bb = new Building(coordinates.x, coordinates.y);
    bb.test();
}
