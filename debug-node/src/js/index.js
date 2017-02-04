console.log('index.js');
var socket = require('socket.io-client')('localhost:3000');

const button = document.getElementsByClassName('_building-create')[0];
const techInput = document.getElementsByClassName('_tech')[0];
const xInput = document.getElementsByClassName('_x')[0];
const yInput = document.getElementsByClassName('_y')[0];

button.onclick = e => {
    const message = {
        x: xInput.value,
        y: yInput.value,
        technologyId: techInput.value,
    }
    console.log('creating building', message);
    socket.emit('build', message)
}

socket.on('connect', function(){
    console.log('connect');
});
// socket.on('event', function(data){
//     console.log('event', data);
// });
socket.on('disconnect', function(){
    console.log('disconnect');
});
