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
    console.log('connection')
    client.id = uuid.v4();
    var player = {}

    client.on('sendUserInformation', function (data) {
      client.User = data
      clientsList[client.id] = client;
      var clientList = []
      for(var i in clientsList){
        clientList.push(clientsList[i].User)
      }
      for(var i in clientsList){
        clientsList[i].emit('newClientJoinned', clientList);
      }
    });

    client.on('newPlayerJoinning', function (data) {
      player = Player(client.id)
      playersList[client.id] = player;
      client.emit('newPlayerJoinned', player);
    });

    client.on('PlayerLeaving', function (data) {
        delete playersList[client.id];
        client.emit('playerLeft', data.id);
    });

    client.on('keyPress', function(data){
      if(playersList[client.id]){
        if(data.action === 'left') playersList[client.id].actions.left = data.state;
        if(data.action === 'right') playersList[client.id].actions.right = data.state;
        if(data.action === 'up') playersList[client.id].actions.up = data.state;
        if(data.action === 'down') playersList[client.id].actions.down = data.state;
      }
    })

    client.on('chatInputFocused', function(data){
      if(playersList[client.id]){
        playersList[client.id].actions.left = false;
        playersList[client.id].actions.right = false;
        playersList[client.id].actions.up = false;
        playersList[client.id].actions.down = false;
      }
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