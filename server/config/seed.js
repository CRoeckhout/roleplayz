var _ = require('lodash');
var crypto = require('crypto');
var Promise = require('bluebird');
var db = require('./database.js');
var Player = db.Player;
var User = db.User;

Promise.each([
  () => Player.sync({force:true})
  .then(() => Player.destroy({ where: {} }))
  .then(() => {
    return Player.bulkCreate([{
      _id: "097b1ccc-e3f7-4b29-8eb2-9380e8eb050b",
      name: "Thilun",
    },{
      _id: "0c804e09-9cf3-41ad-b405-6f049cfac3ec",
      name: "Aellysha",
    },{
      _id: "4e25de04-d7fc-489c-a283-492ebca30c9b",
      name: "Sangriia",
    },{
      _id: "7ced0018-a824-4571-b2aa-9351779759d7",
      name: "Joten",
    },{
      _id: "8228137b-a97b-45b0-a916-dd3919fc96d4",
      name: "Malou",
    },{
      _id: "ab5ea502-32f4-4943-98c2-f5a882590bcf",
      name: "Franbly",
    }])
    .then(() => {
      console.log('finished populating players');
    });
  }),

	() => User.sync({force:true})
  .then(() => User.destroy({ where: {} }))
  .then(() => {
    return User.bulkCreate([{
      _id: "097b1ccc-e3f7-4b29-8eb2-9380e8eb050b",
      email: "Thilun003@gmail.com",
      username: "Thilun",
      password: crypto.createHash('sha1').update(crypto.createHash('md5').update("kad").digest("hex")).digest("hex"),
    }])
    .then(() => {
      console.log('finished populating users');
    });
  }),
], _.attempt);
