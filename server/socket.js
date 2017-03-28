'use strict';

var path = require('path');
var uuid = require('uuid');
var clientsList = {};
var playersList = {};

function Player(id){
  var self = {
    id : id,
    x : 250,
    y : 250,
    pressingLeft : false,
    pressingRight : false,
    pressingUp : false,
    pressingDown : false,
    speed : 10
  }

  self.updatePosition = function () {
    if(self.pressingLeft) this.x -= self.speed;
    if(self.pressingRight) this.x += self.speed;
    if(self.pressingUp) this.y -= self.speed;
    if(self.pressingDown) this.y += self.speed;
  }

  return self
}

module.exports.default = function(io) {
  io.on('connection', function (client) {

  console.log('co')
  client.id = uuid.v4();
  clientsList[client.id] = client;
  var player = {}

  client.on('newPlayerJoinning', function (data) {
    console.log('player is joinning')
    player = Player(client.id)
    playersList[client.id] = player;
    client.emit('newPlayerJoinned', player);
  });

  client.on('PlayerLeaving', function (data) {
      delete playersList[client.id];
      client.emit('playerLeft', data.id);
  });

  client.on('keyPress', function(data){
    if(data.inputId === 37) player.pressingLeft = data.state;
    if(data.inputId === 39) player.pressingRight = data.state;
    if(data.inputId === 38) player.pressingUp = data.state;
    if(data.inputId === 40) player.pressingDown = data.state;
  })

  client.on('disconnect',function(){
    console.log('deco')
    console.log(client.id)
    delete clientsList[client.id];
    delete playersList[client.id];
  })

  client.on('trytoDc',function(client){
    console.log('trytoDc')
  })

  });
}

setInterval(function(){
  var pack = [];
  for(var i in playersList){
    var player = playersList[i]
    player.updatePosition()
    pack.push({id:player.id,x:player.x, y:player.y})
  }

  for(var i in clientsList){
    var client = clientsList[i];
    client.emit('newPositions', pack);
  }
},1000/25)