'use strict';
var User = require('../../config/database.js').User;
var config = require('../../config/environment');
var crypto = require('crypto');
var path = require('path');
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
  return User.find({ where: {_id: userId}, attributes: ['_id','email','username','role','profilePicture'] })
  .then(user => {
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

function uploadImage(req, res) {
  var userId = req.user._id;
  return User.find({ where: {_id: userId}, attributes: ['_id','email','role'] })
  .then(user => {
    var image;
    console.log(req.files)
    if (!req.files) {
      res.send('No files were uploaded.');
      return;
    }

    image = req.files.file;
    var fileName = user._id;
    image.mv(path.normalize(__dirname + '/../../../public/uploads/profilePictures/'+fileName+'.png'), function(err) {
      if (err) {
        res.status(500).send(err);
      }
      else {
      user.update({profilePicture:'/public/uploads/profilePictures/'+fileName+'.png'})
      .then(function(){
        res.json({url: '/uploads/'+fileName+'.png'});
      })
      }
    });
  })
  .catch(function(err){console.log(err)});
}

module.exports = {
  index : index,
  me : me,
  create : create,
  uploadImage : uploadImage
}