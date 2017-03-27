'use strict';

var path = require('path');

module.exports.default = function(io) {
  io.on('connection', function (client) {

    console.log('co')
    client.on('newPlayerJoinning', function (data) {
      setTimeout(function(){
        client.emit('newPlayerJoinned', { hello: 'world' });
      },3000)
    });



    client.on('disconnect',function(client){
      console.log('deco')
    })

  });
}
