//var socket = require('socket.io-client')('localhost:3000');
const socket = require('socket.io-client')('localhost:3000');
const Renderer = require('./graphics/Renderer');

let game = new Renderer();

socket.on('start', (data) => {
    game.state.socket = socket;
    // Parse mapdata
    game.state.map.parse(data.map);
    // Parse playerID to somehow set active base
    game.state.parsePlayer(data.playerId);
    game.state.start();
});

socket.on('tick', (data) => {
    game.state.parseMutation(data);
});

socket.on('join', msg => {
    console.log(msg);
});

socket.on('stop', () => {
    game.state.stop();
});
