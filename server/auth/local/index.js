'use strict';

var express = require('express');
var crypto = require('crypto');

var router = express.Router();

router.post('/', function(req, res, next) {
  res.end('connecté')
});

module.exports = router
