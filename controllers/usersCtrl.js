var User    = require('../models/users.js');
var s3      = require('s3');
// var jwt		= require("jsonwebtoken");

// var secret	= "PoptartIII";


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




	uploader.on('progress', function() {
		console.log("progress", uploader.progressAmount, uploader.progressTotal);
	});


	uploader.on('end', function() {

		var url = s3.getPublicUrlHttp('legacyphotoalbum', file.name);
		console.log('URL', url);
		req.body.data.userPic = url;
		User.create(req.body.data, function(err, user) {
		console.log("user: ", user);
		// res.json(user)
		res.send(user);
	});

	});


}

function signIn (req, res) {
	User.findOne({userName : req.body.userName}, function(err, user) {
		if(err) {
			res.json(err);
		}
		if(user) {
			// if(user.comparePassword(req.body.password)){
			// 	var token= jwt.sign({userName: user.userName, id: user._id}, secret, {expiresIn: "7d"});
				res.json({sucsess: true, message: "you're logged in!", user: user});
			}
			// else {
			// 	res.json({message: "password doesn't match"});
			// }

		else {
			res.json({message: "user doesn't exist"});
		}
	})
}


function getUsers (req, res){
	console.log('params', req.params);
	if(req.params.userID){
		User.findOne({_id : req.params.userID})
			.exec(function(req, res){
    			// res.sendFile('/html/user.html', {root: './public'});
			});
	}



	// Get MANY
	else{
		User.find({}, function(err, docs){
			res.send(docs);
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
