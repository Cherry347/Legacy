var express     = require('express');
var bodyParser  = require('body-parser');
var logger      = require('morgan');
var mongoose    = require('mongoose');
var multiparty  = require('connect-multiparty');
var usersCtrl   = require('./controllers/usersCtrl.js');



var app = express();

mongoose.connect('mongodb://localhost/legacy');

// Application Configuration \\
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Routes \\
app.get('/', function(req, res){
  res.sendFile('master.html', {root : './public/html'});
});

// GET
app.get('/api/users', usersCtrl.getUsers);
app.get('/api/users/:userID', usersCtrl.getUsers);

//POST
app.post('/api/users', multiparty(), usersCtrl.createUser);
app.post('/api/users/:userID', usersCtrl.updateUser);


// Creating Server and Listening for Connections \\
var port = process.env.PORT || 80;
app.listen(port, function(){
  console.log('Server running on port ' + port);

})