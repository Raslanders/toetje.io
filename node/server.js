var server = require('http').createServer();
var io = require('socket.io')(server);

var Lobby = require('./core/Lobby');
var Player = require('./models/Player');

var l = new Lobby();

io.on('connection', function(client){
    var p = new Player(client);
    l.enter(p);
    client.on('event', l.handleMessage);
    client.on('disconnect', () => {
        l.leave(p);
    });
});


server.listen(3000);
