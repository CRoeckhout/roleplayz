'use strict';
var Player = require('../../config/database.js').Player

function respondWithResult(res, statusCode){
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
  };
}

function index(req, res) {
  return Player.findAll()
  .then(respondWithResult(res))
}

function show(req, res) {
  return Player.find({where : {_id : req.params.id}}).then(function(players){
      res.json(players)
    })
}

function create(req, res) {
  return Player.create({name : req.params.name})
  .then(respondWithResult(res))
}

module.exports = {
  index : index,
  show : show,
  create : create
}

/*
module.exports = {
  index : function(req, res) {
    return Player.findAll()
      .then(function(players){
        res.json(players)
      })
  },

  show : function(req, res) {
    console.log(req.params.id)
    return Player.find({where : {_id : req.params.id}})
      .then(function(players){
        res.json(players)
      })
  }
}*/