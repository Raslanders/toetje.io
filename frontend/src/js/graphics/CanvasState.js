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

        this.hoverTile = {};
        this.hoverGraphic = null;
        this.selectedTile = {};
        this.selectedGraphic = null;
    }

    handleMouseDown(mouseData) {
        this.clickTime = +new Date();
        this.dragging = true;
        this.previousMousePosition.x = mouseData.data.global.x;
        this.previousMousePosition.y = mouseData.data.global.y;
    }

    handleMouseUp(mouseData) {
        this.selectedTile = {};
        let currentTime = +new Date();
        if(currentTime - this.clickTime <= 200) {
            //if it was a short click we are not dragging but instead we wanted to select
            if(this.hoverTile) {
                this.selectedTile.x = +this.hoverTile.x;
                this.selectedTile.y = +this.hoverTile.y;
            }
        }
        this.dragging = false;
    }

    handleMouseMove(mouseData) {
        if(this.dragging) {
            //move the current view
            this.newOffset.x = mouseData.data.global.x - this.previousMousePosition.x;
            this.newOffset.y = mouseData.data.global.y - this.previousMousePosition.y;

            this.previousMousePosition.x = +mouseData.data.global.x;
            this.previousMousePosition.y = +mouseData.data.global.y;
        }
        //determine coordinates based on scaling
        let coordinates = this.getGridCoordinates(mouseData.data.global);
        if(coordinates.x >= 0 && coordinates.y >= 0 && coordinates.x < Globals.gridWidth && coordinates.y < Globals.gridHeight) {
            this.hoverTile = coordinates;
        } else {
            this.hoverTile = {};
        }
    }

    handleCamera(stage) {
        if(this.newOffset.x) {
            stage.pivot.x -= this.newOffset.x;
            this.totalOffset.x += this.newOffset.x;
            this.newOffset.x = 0;
        }
        if(this.newOffset.y) {
            stage.pivot.y -= this.newOffset.y;
            this.totalOffset.y += this.newOffset.y;
            this.newOffset.y = 0;
        }
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
        coordinates.x = Math.floor(noOffsetCoordinates.x / Globals.cellWidth);
        coordinates.y = Math.floor(noOffsetCoordinates.y / Globals.cellHeight   );
        return coordinates;
    }

    getHoverTile() {
        return this.hoverTile;
    }

    getSelectedTile() {
        return this.selectedTile;
    }

    getSelectedGraphic() {
        return this.selectedGraphic;
    }

    getHoverGraphic() {
        return this.hoverGraphic;
    }
}

module.exports = CanvasState;