angular.module('Legacy', ['ui.router', 'ngResource', 'ngFileUpload'])

// .run(function($rootScope, $state, $window) {

//         $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
//                 if (toState.authenticate) {
//                         if (!$window.localStorage.getItem('token')) {
//                                 $state.transitionTo('home');
//                                 event.preventDefault();
//                         }
//                 }
//         });
// })