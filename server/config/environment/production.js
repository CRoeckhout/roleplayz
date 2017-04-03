var crypto = require('crypto');

module.exports = {
  secrets: {
    session: crypto.randomBytes(16)
  }
}
