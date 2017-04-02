var crypto = require('crypto')

var user = {
  authenticate: function(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    var _this = this;
    this.encryptPassword(password, function(err, pwdGen) {
      if (err) {
        callback(err);
      }

      if (_this.password === pwdGen) {
        callback(null, true);
      }
      else {
        callback(null, false);
      }
    });
  },

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
	}

}

user.makeSalt(function(err, salt){
	console.log(salt)
})