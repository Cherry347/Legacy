angular.module('Legacy')
	.controller('userController', ['$scope', '$http', '$stateParams', userController]);

function userController($scope, $http, $stateParams) {
	// console.log('stateParams: ', $stateParams);
	var userID = $stateParams.id;

	if (userID) {
	$http.get('/api/users/' + userID)
		.then(function(serverResponse) {
			console.log("this is the sereverResponse ", serverResponse);
			$scope.user = serverResponse.data;
		});

}
}