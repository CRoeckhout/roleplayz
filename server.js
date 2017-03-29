'use strict';

var express  = require('express');
var db = require('./server/config/database.js');
var app = express();                               // create our app w/ express
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var morgan = require('morgan');             // log requests to the console (express4)

// configuration =====================================
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/assets', express.static(__dirname + '/client/assets'));
app.use('/js', express.static(  __dirname + '/client/js'));
app.use(express.static(__dirname + '/client'));

// Initialise router =================================

require('./server/routes').default(app);

// Syncing database && then start the server =========

process.env.seedDB ? require('./server/config/seed.js') : console.log('No seeding');

db.sequelize.sync()
.then(function(){
  var server = app.listen(process.env.PORT || 9002, function(){
    process.env.PORT ? console.log("App listening on port " + process.env.PORT) : console.log("App listening on port 9002");
    var io = require('socket.io').listen(server);
    require('./server/socket.js').default(io)
  });
})
.catch(function(error){
  console.log('error message :', error.message, '\nCheck if Ampps is started or the database informations')
})
