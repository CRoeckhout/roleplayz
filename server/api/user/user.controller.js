'use strict';
var User = require('../../config/database.js').User
var crypto = require('crypto')

function respondWithResult(res, statusCode){
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
  };
}

function index(req, res) {
  return User.findAll()
  .then(respondWithResult(res))
}

function show(req, res) {
  var md5 = crypto.createHash('md5').update(req.body.password).digest("hex");
  var sha1 = crypto.createHash('sha1').update(md5).digest("hex");

  return User.find({ where: {email: req.body.email, password: sha1}, attributes: ['_id', 'email','username'] }).then(function(user){
    if(user == null) {
        res.status(404).json({error: true, message: 'Vérifiez vos identifiants.'});
    }
    else {
      user['password'] = undefined;
      res.json(user);
    }
  });
}

function create(req, res) {
  var md5 = crypto.createHash('md5').update(req.body.password).digest("hex");
  var sha1 = crypto.createHash('sha1').update(md5).digest("hex");
  req.body.password = sha1
  return User.find({where : {$or : {email : req.body.email, username : req.body.username}}}).then(function(user){
    if(user != null) res.json({error: true, message :'Cette adresse mail ou ce nom d\'utilisateur est déja prit.'})
    else 
    {
      return User.create(req.body)
      .then(function(entity){
        entity.password = undefined
        return entity;
        }) 
    }
  })
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