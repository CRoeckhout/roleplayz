'use strict';

var express = require('express');
var controller = require('./user.controller');
var auth = require('../../auth/auth.service.js');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/me', auth.isAuthenticated(), controller.me);
router.post('/', controller.create);
router.post('/uploadImage', auth.isAuthenticated(), controller.uploadImage);
router.put('/', auth.isAuthenticated(), controller.updateUser);
/*router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);*/

module.exports = router;
