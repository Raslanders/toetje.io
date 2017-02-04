var server = require('http').createServer();
var io = require('socket.io')(server);

var Lobby = require('./core/Lobby');
var Player = require('./models/Player');

var l = new Lobby();
var playerIndex = 0;

io.on('connection', function(client){
    var p = new Player(client, playerIndex, `henk${playerIndex}`);
    playerIndex++;
    l.enter(p);
    client.on('event', function(){});
    client.on('disconnect', () => {
        l.leave(p);
    });
});

// function handleClient() {

// }

// function

server.listen(3000);
