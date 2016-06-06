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
		}).then(function(response){
			console.log(response)
			var id = response.data._id
			$state.go('user', {id: id})
		})
		//
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

      $http.post('/api/users',{
      	userName: $scope.userName,
      	password: $scope.userPassword


      })

      .then(function(returnData){
      	console.log(" data" , returnData)
      	if(returnData.data.success) {
      		window.location.href= "/users/:id";
      	}
      	else {
      		console.log(returnData);
      	}
           //var token = response.data.token;
           //if(token){
           //  $window.localStorage.setItem('token',token)
           //  $state.go('user')
           //}else{
           //  console.log("no token found");
           //}
      });
    };
}