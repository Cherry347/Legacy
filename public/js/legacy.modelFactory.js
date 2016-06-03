angular.module('Legacy')
  .factory('userFactory', ['$resource', function($resource){


    var User = $resource('/api/users/:id', {id : '@_id'});


    // GET -> /api/users      -> Find Many  -> User.query()
    // GET -> /api/users/:id  -> Find One   -> User.get()

    // POST -> /api/users     -> Create     -> UserOBJ.$save()
    // POST -> /api/users/:id -> Update     -> UserOBJ.$save()


    return {
      User : User
    };

  }]);