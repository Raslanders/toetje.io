var express = require('express')
var app = express()

console.log('hoiii');

app.get('/', function (req, res) {
  res.send('Hello World')
})
