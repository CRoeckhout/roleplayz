'use strict';

var crypto = require('crypto');

var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function (Sequelize, sequelize) {
  return sequelize.define('user', {
    _id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: {
        msg: 'The specified email address is already in use.'
      },
      validate: {
        isEmail: true
      }
    },
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    active: Sequelize.BOOLEAN,
    role: {
      type: Sequelize.STRING,
      defaultValue: 'user'
    },
    password: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true
      }
    },
    salt: Sequelize.STRING,
  }, {
    getterMethods: {
      profile: function() {
        return {
          'name': this.name,
          'role': this.role
        };
      },

      token: function() {
        return {
          '_id': this._id,
          'role': this.role
        };
      }
    },
    hooks: {
      beforeBulkCreate: function(users, fields, fn) {
        var totalUpdated = 0;
        users.forEach(function(user) {
          user.updatePassword(function(err) {
            if (err) {
              return fn(err);
            }
            totalUpdated += 1;
            if (totalUpdated === users.length) {
              return fn();
            }
          });
        });
      },
      beforeCreate: function(user, fields, fn) {
        user.updatePassword(fn);
      },
      beforeUpdate: function(user, fields, fn) {
        if (user.changed('password')) {
          return user.updatePassword(fn);
        }
        fn();
      }
    },
    instanceMethods : {
      makeSalt : function(byteSize, callback) {
        var defaultByteSize = 16;

        if (typeof arguments[0] === 'function') {
          callback = arguments[0];
          byteSize = defaultByteSize;
        }
        else if (typeof arguments[1] === 'function') {
          callback = arguments[1];
        }

        if (!byteSize) {
          byteSize = defaultByteSize;
        }

        if (!callback) {
          return crypto.randomBytes(byteSize).toString('base64');
        }

        return crypto.randomBytes(byteSize, function(err, salt) {
          if (err) {
            callback(err);
          }
          return callback(null, salt.toString('base64'));
        });
      },

      encryptPassword : function(password, callback) {
        if (!password || !this.salt) {
          if (!callback) {
            return null;
          }
          return callback(null);
        }

        var defaultIterations = 10000;
        var defaultKeyLength = 64;
        var salt = new Buffer(this.salt, 'base64');

        if (!callback) {
          return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
                       .toString('base64');
        }

        return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength,
          function(err, key) {
            if (err) {
              callback(err);
            }
            return callback(null, key.toString('base64'));
          });
      },

      updatePassword: function(fn) {
        // Handle new/update passwords
        if (this.password) {
          if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
            fn(new Error('Invalid password'));
          }

          // Make salt with a callback
          var _this = this;
          this.makeSalt(function(saltErr, salt) {
            if (saltErr) {
              fn(saltErr);
            }
            _this.salt = salt;
            _this.encryptPassword(_this.password, function(encryptErr, hashedPassword) {
              if (encryptErr) {
                fn(encryptErr);
              }
              _this.password = hashedPassword;
              fn(null);
            });
          });
        } else {
          fn(null);
        }
      }
    }
  });
}

