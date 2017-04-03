var _ = require('lodash');
var crypto = require('crypto');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var all = {
  userRoles: ['admin', 'user'],	
}

module.exports = _.merge(all, require('./' + env +'.js'));