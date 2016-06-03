var User    = require('../models/users.js');
var s3      = require('s3');


var s3Client = s3.createClient({
	s3Options :{
		accessKeyId : process.env.AWSKEY,
		secretAccessKey : process.env.AWSSECRET
	}
});


function createUser (req, res){
	console.log('BODY', req.body);
	console.log('===');
	console.log('FILES', req);

	var body = req.body.data;

	User.create(req.body, function(err, user) {
		console.log("user ", user);
		console.log("this is the err ", err);
		res.send({message:"new user", user: user});
	});

	var file = req.files.files;


	// Initiate the upload
	var uploader = s3Client.uploadFile({
			localFile : file.path,
			s3Params :{
				Bucket : 'CherryNet',
				Key : '/Legacy/' + photoAlbum,
				ACL : 'public-read'
			}
		});




		uploader.on('progress', function(){
			console.log("progress", uploader.progressAmount, uploader.progressTotal);
		});


		uploader.on('end', function(){

			var url = s3.getPublicUrlHttp('CherryNet', photoAlbum.name);
			console.log('URL', url);
				user.save(function(err, savedUser){
					res.send(savedUser);
				});

			});

		}

function getUsers (req, res){
	console.log('params', req.params);
	if(req.params.userID){
		User.findOne({_id : req.params.userID})
			.exec(function(err, doc){
				res.send(doc);
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
	updateUser : updateUser
};
