angular.module('Legacy')
  .config(['$routeProvider', function($routeProvider){

    $routeProvider
      .when('/', {
        templateUrl : '../html/homeBody.html',
        controller  : 'homeController'
      })
      .when('/users/:id', {
        templateUrl : '/html/user.html',
        controller  : 'userController'
      })

  }]);