angular.module('Legacy')
  .config(routerConfig);


function routerConfig($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/html/homeBody.html',
      controller: 'homeController',
    })
    .state('user', {
      url: '/users/:id',
      templateUrl: '/html/user.html',
      controller: 'userController',
    });

  $urlRouterProvider.otherwise('/');

}