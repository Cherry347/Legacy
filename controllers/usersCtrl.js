var User    		= require('../models/users.js');
var s3      		= require('s3');
var bcrypt  		= require('bcryptjs');
var passport    	= require('passport');
var LocalStrategy	= require('passport-local').Strategy;
var express 		= require('express');
var app 			= express();


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

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false);
            }

            bcrypt.compare(password, user.password, function(error, matched){
                if (matched === true){
                    return done(null,user);
                }
                else {
                    return done(null, false);
                }
            });
        });
    }
));



/** End Passport Config **/




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



/** END Middleware **/












var s3Client = s3.createClient({
	s3Options :{
		accessKeyId : process.env.AWSKEY,
		secretAccessKey : process.env.AWSSECRET
	}
});


function createUser(req, res) {

	var file = req.files.files;



	// Initiate the upload
	var uploader = s3Client.uploadFile({
		localFile: file.path,
		s3Params: {
			Bucket: 'legacyphotoalbum',
			Key: '/legacyphotoalbum/' + file.name,
			ACL: 'public-read'
		}
	});

	    bcrypt.genSalt(11, function(error, salt){
        bcrypt.hash(req.body.password, salt, function(hashError, hash){
            var newUser = new User({
                username: req.body.username,
                password: hash,
            });
            newUser.save(function(saveErr, user){
                if ( saveErr ) { res.send({ err:saveErr }) }
                else {
                    req.login(user, function(loginErr){
                        if ( loginErr ) { res.send({ err:loginErr }) }
                        else { res.send({success: 'success'}) }
                    });
                }
            });
        });
    });











	uploader.on('progress', function() {
		console.log("progress", uploader.progressAmount, uploader.progressTotal);
	});


	uploader.on('end', function() {

		var url = s3.getPublicUrlHttp('legacyphotoalbum', file.name);
		console.log('URL', url);
		req.body.data.userPic = url;
		User.create(req.body.data, function(err, user) {
		console.log("user: ", user);
		res.send(user);
	});

	});


}

function signIn (req, res, next) {
    console.log("signIn: working"  )
	User.findOne({userName : req.body.userName}, function(err, user) {
		if(err) {
			res.json(err);
		}
		if(user) {
				res.json({sucsess: true, message: "you're logged in!", user: user});
			}
		else {
			res.json({message: "user doesn't exist"});
		}
	});
passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.send({error : 'something went wrong :('}); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.send({success:'success'});
        });
    })
    (req, res, next);
}


app.get('/api/users', app.isAuthenticated, function(req, res){
	console.log("hello");
    res.sendFile('/users/:id', {root: './public'});
});

app.get('/api/me', app.isAuthenticatedAjax, function(req, res){
    res.send({user:req.user});
});

// Stupid simple err catcher
app.use(function(req, res){
    res.send({err : 'Something bad happened'});
});





function getUsers (req, res){
	console.log('params', req.params);
	if(req.params.userID){
		User.findOne({_id : req.params.userID})
			.exec(function(req, res){
			});
	}

}




function updateUser (req, res){
		User.update({_id : req.params.userID}, req.body, function(err, updated){

			User.findOne({_id : req.params.userId}, function(err, user){
				res.send(user);
			});

		});
}


module.exports = {
	createUser : createUser,
	getUsers : getUsers,
	updateUser : updateUser,
	signIn: signIn
};