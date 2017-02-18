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

        this.hoverGraphic = null;
        this.selectedGraphic = null;

        this.dblClick = null;
    }

    handleMouseDown(mouseData) {
        this.clickTime = +new Date();
        this.dragging = true;
        this.previousMousePosition.x = mouseData.data.global.x;
        this.previousMousePosition.y = mouseData.data.global.y;
    }

    handleMouseUp(mouseData) {
        let currentTime = +new Date();
        if(currentTime - this.clickTime <= 200) {
            if(this.selectedTile && this.hoverTile.x == this.selectedTile.x && this.hoverTile.y == this.selectedTile.y) {
                this.dblClick = {};
                this.dblClick.x = this.selectedTile.x;
                this.dblClick.y = this.selectedTile.y;
            }
            else {
                this.dblClick = null;
            }
            //if it was a short click we are not dragging but instead we wanted to select
            if(this.hoverTile) {
                if(!this.selectedTile)
                    this.selectedTile = {};
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
        // Coordinates viewport
        let coordVp = this.getMouseWithoutOffset(mousecoordinates);

        // Reverse iso
        const origX = (coordVp.x / 2) + coordVp.y;
        const origY = coordVp.y - (coordVp.x / 2);

        // Rounded to nearest tile
        const coordinates = {};
        coordinates.x = Math.round(origX / Globals.cellWidth) - 1;
        coordinates.y = Math.round(origY / Globals.cellHeight);

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

    getDblClick() {
        let tempDblClick = null;
        if(this.dblClick) {
            tempDblClick = {};
            tempDblClick.x = this.dblClick.x;
            tempDblClick.y = this.dblClick.y;
        }
        this.dblClick = null;

        return tempDblClick;
    }
}

module.exports = CanvasState;
