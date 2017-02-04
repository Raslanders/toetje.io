console.log('index.js');
var socket = require('socket.io-client')('grievous:3000');

socket.on('connect', function(){
    console.log('connect');
});
socket.on('event', function(data){
    console.log('event');
});
socket.on('disconnect', function(){
    console.log('disconnect');
});
