'use strict';
var jwt = require('jsonwebtoken');
var config = require('../config/environment');
var compose = require('composable-middleware');
var expressJwt = require('express-jwt');
var User = require('../config/database').User

var validateJwt = expressJwt({
  secret: config.secrets.session
});

function isAuthenticated() {
  return compose()
    .use(function(req, res, next) {
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    .use(function(req, res, next) {
      User.find({
        where: {
          _id: req.user._id
        }
      })
        .then(user => {
          if (!user) {
            return res.status(401).end();
          }
          req.user = user;
          next();
        })
        .catch(err => next(err));
    });
}

function hasRole(roleRequired) {
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >=
          config.userRoles.indexOf(roleRequired)) {
        next();
      } else {
        res.status(403).send('Forbidden');
      }
    });
}

function signToken(id, role) {
  return jwt.sign({ _id: id, role: role }, config.secrets.session, {
    expiresIn: 60 * 60 * 24 * 365 * 10
  });
}

module.exports = {
  isAuthenticated : isAuthenticated,
	hasRole : hasRole,
	signToken : signToken
}