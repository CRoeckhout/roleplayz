
var Player = require('../api/player/player.model');
var Room = require('../api/room/room.model');
var User = require('../api/user/user.model');
var Sequelize  = require('sequelize');
var sequelize;

var db = {
  Sequelize,
  sequelize : new Sequelize('mysql://root:kadro@localhost/roleplayz', {
  	logging: false,
  	timezone: '+02:00'
  })
};

db.Player = Player(db.Sequelize,db.sequelize)
db.Room = Room(db.Sequelize,db.sequelize)
db.User = User(db.Sequelize,db.sequelize)
module.exports = db;