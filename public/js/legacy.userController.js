angular.module('Legacy')
	.controller('userController', ['$scope', '$http', '$routeParams', userController]);

function userController ($scope, $http, $routeParams){

	console.log('routeParams: ', $routeParams);
	var userID = $routeParams.id;

	$http.get('/api/users/' + userID)
		.then(function(serverResponse){
			console.log("this is the sereverResponse ", serverResponse);
			$scope.user = serverResponse.data;
		});

}