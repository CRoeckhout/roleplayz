'use strict';

var path = require('path');
var express = require('express');
// var fileUpload = require('express-fileupload');

module.exports.default = function(app) {

  // app.use(fileUpload());
  app.use('/api/players', require('./api/player'));

  app.use('/auth', require('./auth'));

  // app.use('/auth', require('./auth').default);

  app.use('/public', express.static('public'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets|public)/*')
   .get((req,res) =>{
      res.send('error')
   });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.normalize(__dirname + '/../client/index.html'), null, function(err) {
        if (err) res.status(500).send(err);
        else res.status(200).end();
      });
    });
}
