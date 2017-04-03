'use strict';
var User = require('../../config/database.js').User;
var config = require('../../config/environment');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

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

function me(req, res, next) {
  var userId = req.user._id;
  return User.find({ where: {_id: userId}, attributes: ['_id','email','role'] })
  .then(user => { // don't ever give out the password or salt
    if (!user) {
      return res.status(401).end();
    }
    res.json(user);
  })
  .catch(err => next(err));
}

function create(req, res) {
  var newUser = User.build(req.body);
  newUser.setDataValue('role', 'user');
  return newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

module.exports = {
  index : index,
  me : me,
  create : create
}