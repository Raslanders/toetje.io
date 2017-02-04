const Globals = require('../data/Globals');


class CanvasState {
    constructor() {
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
    }
}