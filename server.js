var express     = require('express');
var bodyParser  = require('body-parser');
var logger      = require('morgan');
var mongoose    = require('mongoose');
var multiparty  = require('connect-multiparty');
var usersCtrl   = require('./controllers/usersCtrl.js');
var fs          = require("fs");
var https       = require("https");

var app = express();

mongoose.connect('mongodb://localhost/legacy');

// Application Configuration \\
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(__dirname + '/public'));

// Routes \\

//SignIn\\
app.post('/api/signIn', usersCtrl.signIn);

// GET
app.get('/api/users', usersCtrl.getUsers);
app.get('/api/users/:userID', usersCtrl.getUsers);


//POST

//Sign Up
app.post('/api/users', multiparty(), usersCtrl.createUser);
app.post('/api/users/:userID', usersCtrl.updateUser);



// Creating Server and Listening for Connections \\
var port = process.env.PORT || 80;
app.listen(port, function(){
  console.log('Server running on port ' + port);



})


// HTTPS Setup //
try {

    var credentials = {
      key: fs.readFileSync('/etc/letsencrypt/live/loristill.io/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/loristill.io/cert.pem')
    };

    https.createServer(credentials, app).listen(443);
}
catch(error){
    console.log('HTTPS setup failed.')
    console.log('=-=-=-=-=-=-=-=-=-=-=')
    console.log(error)
}