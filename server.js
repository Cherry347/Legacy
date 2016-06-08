var express         = require('express');
var bodyParser      = require('body-parser');
var logger          = require('morgan');
var mongoose        = require('mongoose');
var multiparty      = require('connect-multiparty');
var usersCtrl       = require('./controllers/usersCtrl.js');
var User            = require('./models/users.js');
var fs              = require("fs");
var https           = require("https");
var passport        = require('passport');
var bcrypt          = require('bcryptjs');
var LocalStrategy   = require('passport-local').Strategy;
var InstagramStrategy= require('passport-instagram').Strategy;


var app = express();

mongoose.connect('mongodb://localhost/legacy');

// Application Configuration \\
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(__dirname + '/public'));

/** Express Session Setup **/
var session = require('express-session');
app.sessionMiddleware = session({
  secret: process.env.PASSSECRET,
  resave: false,
  saveUninitialized: true,
});
app.use(app.sessionMiddleware);


/** End Express Session Setup **/



/** Passport Config **/

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// passport.use(new LocalStrategy(
//     function(username, password, done) {
//         User.findOne({ username: username }, function (err, user) {
//             if (err) { return done(err); }
//             if (!user) {
//                 return done(null, false);
//             }

//             bcrypt.compare(password, user.password, function(error, matched){
//                 if (matched === true){
//                     return done(null,user);
//                 }
//                 else {
//                     return done(null, false);
//                 }
//             });
//         });
//     }
// ));



// /** End Passport Config **/


passport.use(new InstagramStrategy({
    clientID: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    callbackURL: "https://loristill.io/auth/instagram/callback"
  },
  function(accessToken, refreshToken, profile, done) {

      console.log("accessToken: ", accessToken)
      console.log("refreshToken: ", refreshToken)
      console.log("profile: ", profile)

    User.findOne({ instagramId: profile.id },function (err, user) {
        if(!user) {
            console.log("no user found")
            User.create({inst_id: profile.id, accessToken: accessToken }, function(err, newuser){
                done(null, newuser)
            })
        }
        else {
            done(null, user)
        }
        })





    // User.findOrCreate({ instagramId: profile.id },function (err, user) {
    //   console.log("user instagram ", user)
    //   return done(err, user);
    // });
  }
));


//Instagram Auth\\

app.get('/auth/instagram',
  passport.authenticate('instagram'));

// app.get('/users/approved', function (req, res, next) {
//     console.log("made it users/approved")
//   passport.authenticate('instagram', function(err, user){

//       console.log("user *** ",user);

//       if (err) {
//           console.log('Err RE');
//           return res.redirect('/api/users');
//       }
//       if (!user) {
//           console.log('NOUSER RE');
//           return res.redirect('/api/users');
//       }
//       console.log('LOGIN');
//       req.login(user, function (err) {
//          return res.redirect('/api/users/:userID');
//       });

//   })(req, res, next);
// });


app.get('/auth/instagram/callback', passport.authenticate('instagram', {failureRedirect: '/', sucessRedirect: '/authLoggedIn'}));

app.get('/authLoggedIn', function(req, res){
    res.redirect('/#/users/' + req.user._id)
})










/** Middleware **/
app.isAuthenticated = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    console.log('get outta here!');
    res.redirect('/');
};


app.isAuthenticatedAjax = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.send({error:'not logged in'});
};



// /** END Middleware **/


// Routes \\

//SignIn\\
app.post('/api/signIn', usersCtrl.signIn);

// // GET
app.get('/api/users', usersCtrl.getUsers);
app.get('/api/users/:userID', usersCtrl.getUsers);


//POST

//Sign Up
app.post('/api/users', multiparty(), usersCtrl.createUser);
app.post('/api/users/:userID', usersCtrl.updateUser);


app.get('/api/users', app.isAuthenticated, function(req, res){
	console.log("hello");
    res.sendFile('/users/:id', {root: './public'});
});

app.get('/api/me', app.isAuthenticatedAjax, function(req, res){
    res.send({user:req.user});
});

// // Stupid simple err catcher
// app.use(function(req, res){
//     res.send({err : 'Something bad happened'});
// });





// Creating Server and Listening for Connections \\
var port = process.env.PORT || 80;
app.listen(port, function(){
  console.log('Server running on port ' + port);



});


// HTTPS Setup //
try {

    var credentials = {
      key: fs.readFileSync('/etc/letsencrypt/live/loristill.io/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/loristill.io/cert.pem')
    };

    https.createServer(credentials, app).listen(443);
}
catch(error){
    console.log('HTTPS setup failed.');
    console.log('=-=-=-=-=-=-=-=-=-=-=');
    console.log(error);
}