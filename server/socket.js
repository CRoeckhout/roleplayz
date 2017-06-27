'use strict';

var path = require('path');
var uuid = require('uuid');
var _ = require('lodash');

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
  var clientsList = {};
  var playersList = {};
  var rooms = [];

  io.sockets.on('connection', function (client) {
    console.log('=============================== connection ===============================')
    console.log('connection')
    console.log('=============================== connection ===============================')

    var player = {}
    clientsList[client.id] = client;
    client.on('joinRoom', function(roomId, user){
      client.room = roomId
/*      if(getRoom(roomId).length == 0){
        rooms.push({id:roomId})
      }
      var room = rooms[IndexByKey(rooms, "id", roomId)]
      if(!room.Clients){
        room.Clients = []
        room.Users = []
      }
      // client.user = user
      room.Clients.push(client)
      room.Users.push(user)
      _.forEach(room.Clients, function(roomClient){
        roomClient.emit('joinnedRoom',room.Users)
      })*/
    })

    client.on('sendUserInformation', function (data) {
      client.User = data.user
      clientsList[client.id] = client;
      client.room = data.roomId
      client.join(data.roomId, function(){
        console.log(client.rooms);
        client.in(data.roomId).emit('newClientInformationss', { some: 'data' });
      });

     var clientList = []
      _.map(clientsList, function(newClient){
        var thisClient = {
          User : newClient.User,
          room : newClient.room
        }
        clientList.push(thisClient)
      })
      for(var i in clientsList){
        clientsList[i].in(data.roomId).emit('newClientInformations', clientList);
      }
    });

    client.on('newPlayerJoinning', function (data) {
      player = Player(client.id)
      player.User = client.User
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
        clientsList[i].emit('newMessage','<b>' + client.User.username + '</b> : ' + message)
      }
    })

    client.on('evalValue',function(message){
      try {
        client.emit('evalReturn', eval(message))
      } catch (e) {
        client.emit('evalReturn', 'Error no such item : '+ message)
      }
    })

    client.on('leftRoom',function(){
      console.log(client.room)
      var room = rooms[IndexByKey(rooms, "id", client.room)]
      if(room) {
        room.Clients = room.Clients.slice(room.Clients[IndexByKey(room.Clients, "id", client.id)], 1)
        _.forEach(room.Clients, function(roomClient){
          roomClient.emit('leftRoom',room.Users)
        })
      }
    })

    client.on('disconnect',function(){
      console.log('=============================== DECONNECTION ===============================')
      console.log('DECONNECTION', client.id)
      console.log('=============================== DECONNECTION ===============================')
    })

  });

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

  function getRoom(roomId){
    return _.filter(rooms, function(room){
      if(room.id == roomId) return room
    })
  }

  function IndexByKey(arraytosearch, key, valuetosearch) {
   
    for (var i = 0; i < arraytosearch.length; i++) {
      if (arraytosearch[i][key] == valuetosearch) {
        return i;
      }
    }
    return null;
  }

}