var state = play;
var renderer;
var stage;
var rectangle;

setup();

function setup() {
    renderer = PIXI.autoDetectRenderer();
    renderer.view.style.position = "absolute";
    renderer.view.style.display = "block";
    renderer.autoResize = true;
    renderer.resize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.view);

    stage = new PIXI.Container();

    rectangle = new PIXI.Graphics();
    rectangle.lineStyle(4, 0xFF3300, 1);
    rectangle.beginFill(0x66CCFF);
    rectangle.drawRect(0, 0, 64, 64);
    rectangle.endFill();
    rectangle.x = 170;
    rectangle.y = 170;
    stage.addChild(rectangle);

    gameLoop();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);

    state();

    renderer.render(stage);
}

function play() {
    rectangle.x = (rectangle.x + 10)
}
