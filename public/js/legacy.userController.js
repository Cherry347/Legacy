angular.module('Legacy')
	.controller('userController', ['$scope', '$http', '$stateParams', userController]);

function userController($scope, $http, $stateParams) {
	var userID = $stateParams.id;

	if (userID) {
	$http.get('/api/users/' + userID)
		.then(function(serverResponse) {
			console.log("this is the sereverResponse ", serverResponse);
			$scope.user = serverResponse.data;
		});
	timeline = new TL.Timeline('timeline-embed', '/sample_json.json');
	}
}