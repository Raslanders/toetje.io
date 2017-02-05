'use strict';

const Map = require('./Map');
const _ = require('lodash');
const TechTree = require('../view/TechTree');
const Troop = require('../models/Troop');
const Resource = require('../view/Resource');

class State {
    constructor(renderer) {
        this.renderer = renderer;
        this.gameState = 'lobby';
        this.map = new Map(renderer);
        this.socket = null;
        this.techTree = [];
        this.playerId = 0;
        this.troops = {};
        this.techtree = new TechTree(document.getElementsByClassName('_tech-tree')[0]);
        this.resources = new Resource(document.getElementsByClassName('_resources')[0]);
    }

    createBuilding(x, y) {
        const technologyId = this.techtree.activeTech;
        this.socket.emit('build', { x, y, technologyId });
    }

    parseMutation(mutation) {
        _.each(mutation.building, b => {
            this.map.updateBuildingAtPosition(b.position, b, this.techtree);
        })
        _.each(mutation.troop, t => {
            this.updateTroop(t.id, t);
        });

        _.each(mutation.resources, r => {
            if(r.id == this.playerId)
                this.updateResource(r.resource)
        })
    }

    // Create or update troop
    updateTroop(id, troopData) {
        let troop = this.troops[id];
        if (!troop) {
            troop = new Troop(troopData, this.renderer);
            this.troops[id] = troop;
            this.renderer.addToQueue(troop, true);
            return;
        }

        troop.updateFromTick(troopData);
    }

    updateTechTree(data) {
        this.techtree.render(data);
    }

    updateResource(resource) {
        this.resources.render(resource);
    }

    start() {
        console.log('Game started');
        this.gameState = 'started';
    }

    stop() {
        console.log('Game stopped');
        this.gameState = 'stopped';
    }
}

module.exports = State;
