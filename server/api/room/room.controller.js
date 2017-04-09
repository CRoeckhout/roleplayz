'use strict';
var Room = require('../../config/database.js').Room

function respondWithResult(res, statusCode){
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
  };
}

function index(req, res) {
  return Room.findAll()
  .then(respondWithResult(res))
}

function show(req, res) {
  return Room.find({where : {_id : req.params.id}}).then(function(Rooms){
      res.json(Rooms)
    })
}

function create(req, res) {
  return Room.create(req.body)
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
    return Room.findAll()
      .then(function(Rooms){
        res.json(Rooms)
      })
  },

  show : function(req, res) {
    console.log(req.params.id)
    return Room.find({where : {_id : req.params.id}})
      .then(function(Rooms){
        res.json(Rooms)
      })
  }
}*/