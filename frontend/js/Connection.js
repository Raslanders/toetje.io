class Connection {
    constructor(State) {
        this.socket = require('socket.io-client')('localhost:3000');
        this.state = State;
        socket.on('connect', function(){
            state.connect('connect');
        });
        socket.on('event', function(data){
            state.update(event);
        });
        socket.on('disconnect', function(){
            state.disconnect('disconnect');
        });
    }
}