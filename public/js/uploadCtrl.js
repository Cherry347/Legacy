//User's Photo Upload\\

angular.module('Legacy')
	.controller('uploadController', ['$scope', '$http', 'Upload', uploadController]);


function uploadController ($scope, $http, Upload) {
    $scope.picUpload = function() {
        upload.upload({
    		url : '/users/:id',
    		data : {
    			files : $scope.newPic.pic,
    			data : $scope.newPic
    		}
        });
    };

    $scope.resizePic = function() {
        //make this true or false
    };
}