angular.module('Legacy')
	.controller('homeController', ['$scope', '$http', 'userFactory', 'Upload', homeController]);

function homeController ($scope, $http, userFactory, Upload){


	$scope.createUser = function(){
		Upload.upload({
			url : '/api/users',
			data : {
				files : $scope.newUser.userPic,
				data : $scope.newUser
			}
		});
	};

	$scope.users = userFactory.User.query(function(data){
			console.log('data: ', data);
	});

	$http.get('/api/users')
		.then(function(returnData){
			console.log('GET : ', returnData);
			$scope.users = returnData.data;
		});
}