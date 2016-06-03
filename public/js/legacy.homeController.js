angular.module('Legacy')
	.controller('homeController', ['$scope', '$http', 'userFactory', homeController]);

function homeController ($scope, $http, userFactory){


	$scope.createUser = function(){
		$http.post('/api/users', $scope.newUser)
			.then(function(returnData){
				$scope.users = $scope.users || [];
				$scope.users.push(returnData.data);
				$scope.newUser = {};
			});
	};


	$scope.users = userFactory.User.query(function(data){
			console.log('data: ', data);
	});

	$http.get('/api/users')
		.then(function(returnData){
			console.log('GET : ', returnData)
			$scope.users = returnData.data
		})

	$scope.getUsers = function(){

	}
}