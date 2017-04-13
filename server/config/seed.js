var _ = require('lodash');
var crypto = require('crypto');
var Promise = require('bluebird');
var db = require('./database.js');
var Player = db.Player;
var Room = db.Room;
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

  () => Room.sync({force:true})
  .then(() => Room.destroy({ where: {} }))
  .then(() => {
    return Room.bulkCreate([{
      _id: "123b1ccc-e3f7-4b29-8eb2-9380e8eb050b",
      name: "Room1",
      maxPlayers: 4,
    },{
      _id: "45604e09-9cf3-41ad-b405-6f049cfac3ec",
      name: "Room2",
      maxPlayers: 10,
    },{
      _id: "7895de04-d7fc-489c-a283-492ebca30c9b",
      name: "Room3",
      maxPlayers: 6,
    },{
      _id: "101d0018-a824-4571-b2aa-9351779759d7",
      name: "Room4",
      maxPlayers: 4,
    },{
      _id: "1028137b-a97b-45b0-a916-dd3919fc96d4",
      name: "Room5",
      maxPlayers: 6,
    },{
      _id: "103ea502-32f4-4943-98c2-f5a882590bcf",
      name: "Room6",
      maxPlayers: 8,
    }])
    .then(() => {
      console.log('finished populating rooms');
    });
  }),

	() => User.sync({force:true})
  .then(() => User.destroy({ where: {} }))
  .then(() => {
    return User.bulkCreate([{
      _id: "197b1ccc-e3f7-4b29-8eb2-9380e8eb050b",
      email: "admin@example.com",
      username: "Administrateur",
      password: 'admin',
      role: 'admin',
    },{
      _id: "097b1ccc-e3f7-4b29-8eb2-9380e8eb050b",
      email: "Thilun003@gmail.com",
      username: "Thilun",
      password: 'kad',
    },{
      _id: "092b1ccc-e3f7-4b29-8eb2-9380e8eb050b",
      email: "ychnoala003@hotmail.fr",
      username: "Ychno",
      password: 'kad',
    }])
    .then(() => {
      console.log('finished populating users');
    });
  }),
], _.attempt);
