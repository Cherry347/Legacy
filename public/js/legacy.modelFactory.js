angular.module('Legacy')
  .factory('userFactory', ['$resource', function($resource) {

    var User = $resource('/api/users/:id', {
      id: '@_id'
    });

    return {
      User: User
    };

  }]);