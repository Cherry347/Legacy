angular.module('Legacy')
	.controller('homeController', ['$scope', '$http', 'userFactory', 'Upload','$state', homeController]);

function homeController($scope, $http, userFactory, Upload, $state) {


//Sign Up

	$scope.createUser = function() {
		Upload.upload({
			url: '/api/users',
			data: {
				files: $scope.newUser.userPic,
				data: $scope.newUser

			}
		})

		.then(function(response){
			console.log(response);
			var id = response.data._id;
			// $state.go('user', {id: id});
		});
	};

	$http.get('/api/users')
		.then(function(returnData) {
			console.log('GET : ', returnData);
			$scope.users = returnData.data;
		});


//Log In

	$scope.userLogIn= function() {
		$scope.thisUser = {userName: $scope.logIn.userName,
      	password: $scope.logIn.userPassword};

      $http.post('/api/signIn',$scope.thisUser)


      .then(function(returnData){
      	console.log("returnData ", returnData)
		var id = returnData.data.user._id;
		if(id) {
			$state.go('user', {id: id});
		}
      });
    };
}