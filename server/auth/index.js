'use strict';

var express = require('express');
var User = require('../config/database').User
var setup = require('./local/passport');

setup(User)

var router = express.Router();

router.use('/local', require('./local'));

module.exports = router