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

//SignIn\\
app.post('/api/signIn', usersCtrl.signIn);

// GET
app.get('/api/users', usersCtrl.getUsers);
// app.get('/api/users/:userID', usersCtrl.getUsers);


//POST
app.post('/api/users', multiparty(), usersCtrl.createUser);
app.post('/api/users/:userID', usersCtrl.updateUser);


//Auth User
app.use(authorize);

function authorize(req, res, next){
    var token= req.body.token || req.params.token || req.headers["x-access-token"];
    if(token){
        if(err) {
            return res.status(403).send({sucsess: false, message: "can't auth taken"});
        }
        else {
            req.decode= decoded;
            next();
        }
    }
    else {
        return res.status(403).send({sucsess: false, message: "no token provided"});
    }
}
// Creating Server and Listening for Connections \\
var port = process.env.PORT || 80;
app.listen(port, function(){
  console.log('Server running on port ' + port);

})