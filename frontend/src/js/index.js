//var socket = require('socket.io-client')('localhost:3000');
var socket = require('socket.io-client')('localhost:3000');
var Renderer = require('./graphics/Renderer');

var game = new Renderer();

socket.on('start', (data) => {
    // Parse mapdata
    game.state.parseMap(data.map);
    // Parse playerID to somehow set active base
    game.state.parsePlayer(data.playerId);
    game.state.start();
});

socket.on('tick', (data) => {
    console.log('todo render tick', data);
})

socket.on('stop', () => {
    game.state.stop();
});
