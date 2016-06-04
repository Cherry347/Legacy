var User    = require('../models/users.js');
var s3      = require('s3');


var s3Client = s3.createClient({
	s3Options :{
		accessKeyId : process.env.AWSKEY,
		secretAccessKey : process.env.AWSSECRET
	}
});


function createUser(req, res) {
	console.log('BODY', req.body);

	// User.create(req.body, function(err, user) {
	// 	console.log("user: ", user);
	// });

	// var body = req.body.data

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

	});


	console.log(req.body);
	res.send('woohoo');


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


//Get Credentials in Config\\
// s3.config.credentials = new s3.CognitoIdentityCredentials();
// s3.config.credentials.get(function(err) {
//   if (err) console.log(err);
//   else console.log(s3.config.credentials);
// });



module.exports = {
	createUser : createUser,
	getUsers : getUsers,
	updateUser : updateUser
};
