var server = require('http').createServer();
var io = require('socket.io')(server);
var Lobby = require('./core/Lobby');
var l = new Lobby();

io.on('connection', function(client){
    console.log('new client, add to lobby');
    client.on('event', function(){});
    client.on('disconnect', function(){});
});

// function handleClient() {

// }

// function

server.listen(3000);
