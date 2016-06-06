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
			$state.go('user', {id: id});
		});
	};

	$scope.users = userFactory.User.query(function(data) {
		console.log('data: ', data);
	});

	$http.get('/api/users')
		.then(function(returnData) {
			console.log('GET : ', returnData);
			$scope.users = returnData.data;
		});


//Log In

	$scope.userLogIn= function() {
		$scope.thisUser = {userName: $scope.userName,
      	password: $scope.userPassword}
		console.log("this user= ", $scope.thisUser)

      $http.post('/api/signIn',{
      	// userName: $scope.userName,
      	// password: $scope.userPassword


      })

      .then(function(returnData){
      	console.log("retrun data", returnData);
		var id = returnData.data._id;
		if(id) {
			$state.go('user', {id: id});
		}
      });



           //var token = response.data.token;
           //if(token){
           //  $window.localStorage.setItem('token',token)
           //  $state.go('user')
           //}else{
           //  console.log("no token found");
           //}
    };
}