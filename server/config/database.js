
var Player = require('../api/player/player.model');
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
module.exports = db;