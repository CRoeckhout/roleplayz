'use strict';

var path = require('path');
var uuid = require('uuid');
var _ = require('lodash');
var clientsList = {};
var playersList = {};

function Player(id){
  var self = {
    id : id,
    x : 250,
    y : 250,
    speed : 10
  }

  self.actions = {
    left : false,
    right : false,
    up : false,
    down : false
  }

  self.updatePosition = function () {
    if(self.actions.left) this.x -= self.speed;
    if(self.actions.right) this.x += self.speed;
    if(self.actions.up) this.y -= self.speed;
    if(self.actions.down) this.y += self.speed;
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
    console.log(player.actions.left, player.actions.right, player.actions.up, player.actions.down)
    if(data.action === 'left') player.actions.left = data.state;
    if(data.action === 'right') player.actions.right = data.state;
    if(data.action === 'up') player.actions.up = data.state;
    if(data.action === 'down') player.actions.down = data.state;
  })

  client.on('chatInputFocused', function(data){
    player.actions.left = false;
    player.actions.right = false;
    player.actions.up = false;
    player.actions.down = false;
  })

  client.on('sendMessage',function(message){
    for(var i in clientsList){
      clientsList[i].emit('newMessage', client.id.slice(0,6) + ' : ' + message)
    }
  })

  client.on('evalValue',function(message){
    try {
      client.emit('evalReturn', eval(message))
    } catch (e) {
      client.emit('evalReturn', 'Error no such item : '+ message)
    }
  })

  client.on('disconnect',function(){
    console.log('deco')
    delete clientsList[client.id];
    delete playersList[client.id];
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