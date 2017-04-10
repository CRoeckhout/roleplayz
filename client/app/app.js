'use strict';

var rpgApp = angular.module("rpgApp", ['ui.bootstrap' ,'ui.router', 'btford.socket-io', 'ngCookies', 'ngResource', 'ngAnimate', 'ngFileUpload'])

rpgApp.config(function($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider) {
  $stateProvider
  .state('main', {
      url: '/',
      templateUrl: '/app/main/main.html',
      controller: 'MainController',
      controllerAs: 'vm'
  })
  .state('login', {
      url: '/login',
      templateUrl: '/app/account/login/login.html',
      controller: 'LoginController',
      controllerAs: 'vm',
  })
  .state('logout', {
    url: '/logout?referrer',
    referrer: 'login',
    template: '',
    controller: function($state, Auth) {
      var referrer = $state.params.referrer || $state.current.referrer || 'login';
      Auth.logout();
      $state.go(referrer);
    }
  })
  .state('signup', {
    url: '/signup',
    templateUrl: '/app/account/signup/signup.html',
    controller: 'SignupController',
    controllerAs: 'vm'
  })
  .state('profile', {
    url: '/profile',
    templateUrl: '/app/account/settings/settings.html',
    controller: 'SettingsController',
    controllerAs: 'vm',
    authenticate : true
  })
  .state('room', {
    url: '/room/:roomId',
    templateUrl: '/app/room/room.html',
    params: {
        roomId: null
    },
    controller: 'RoomController',
    controllerAs: 'vm',
    authenticate : true
  })
  .state('rooms', {
    url: '/rooms',
    templateUrl: '/app/rooms/rooms.html',
    controller: 'RoomsController',
    controllerAs: 'vm',
    authenticate : true
  });
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('authInterceptor');
})

.factory('mySocket', function (socketFactory) {
  return socketFactory();
})

/*.factory('Socket', function (socketFactory) {
  return socketFactory;
})*/

.factory('Controls',function(){
  self = {
    active : false,
    left : [37,81],
    right : [39,68],
    up : [38,90],
    down : [40,83]
  }

  self.get = function(keyCode) {
    if(self.left.includes(keyCode)) return 'left'
    if(self.right.includes(keyCode)) return 'right'
    if(self.up.includes(keyCode)) return 'up'
    if(self.down.includes(keyCode)) return 'down'
  };


  return self
})

.factory('User', function($resource) {
  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    }
  });
})

.factory('authInterceptor', function($rootScope, $q, $cookies, $injector) {
  var state;
  return {
    request(config) {
      config.headers = config.headers || {};
      if ($cookies.get('token')) {
        config.headers.Authorization = 'Bearer ' + $cookies.get('token');
      }
      return config;
    },

    responseError(response) {
      if (response.status === 401) {
        (state || (state = $injector.get('$state')))
        .go('login');
        $cookies.remove('token');
      }
      return $q.reject(response);
    }
  };
})


.factory('Auth',function($http, $cookies, $location, $q, User){
  var currentUser = {};
  var userRoles = ["user","admin"];

  if ($cookies.get('token') && $location.path() !== '/logout') {
    currentUser = User.get();
  }

  var Auth = {
    login({
      email,
      password
    }, callback) {
      return $http.post('/auth/local', {
          email: email,
          password: password
        })
        .then(res => {
          $cookies.put('token', res.data.token);
          currentUser = User.get();
          return currentUser.$promise;
        })
        .catch(err => {
          if(err.status == 404)
          Auth.logout();
          return $q.reject(err.data);
        });
    },

    logout() {
      $cookies.remove('token');
      currentUser = {};
    },

    createUser(user, callback) {
      return User.save(user, function(data) {
        $cookies.put('token', data.token);
        currentUser = User.get();
      }, function(err) {
        Auth.logout();
      })
      .$promise;
    },


    getCurrentUser(callback) {
      if (arguments.length === 0) {
        return currentUser;
      }

      var value = currentUser.hasOwnProperty('$promise') ? currentUser.$promise : currentUser;
      return $q.when(value)
      .then(user => {
        return user;
      }, () => {
        return {};
      });
    },

    setCurrentUser(newUser) {
      currentUser = newUser
      return currentUser;
    },

    hasRole(role, callback) {
      var hasRole = function(r, h) {
        return userRoles.indexOf(r) >= userRoles.indexOf(h);
      };

      if (arguments.length < 2) {
        return hasRole(currentUser.role, role);
      }

      return Auth.getCurrentUser(null)
      .then(user => {
        var has = user.hasOwnProperty('role') ? hasRole(user.role, role) : false;
        return has;
      });
    },

    isLoggedIn(callback) {
      if (arguments.length === 0) {
        return currentUser.hasOwnProperty('role');
      }

      return Auth.getCurrentUser(null)
        .then(user => {
          var is = user.hasOwnProperty('role');
          return is;
        });
    },
  }

  return Auth
})

.run(function ($rootScope, $state, Auth, mySocket) {
  $rootScope.config = {
    baseUrl : "http://localhost:9002"
  }

  $rootScope.$on('$stateChangeStart', function(event, next) {
    if(next.name != 'room'){
      mySocket.disconnect()
    }
    
    if(next.name === "login" || next.name === "signup"){
      return Auth.isLoggedIn(_.noop)
      .then(is => {
        if(is) $state.go('main');

        event.preventDefault();
      });
    }


    if (!next.authenticate) {
      return;
    }

    if (typeof next.authenticate === 'string') {
      Auth.hasRole(next.authenticate, _.noop)
        .then(has => {
          if (has) {
            return;
          }

          event.preventDefault();
          return Auth.isLoggedIn(_.noop)
            .then(is => {
              $state.go(is ? 'main' : 'login');
            });
        });
    } else {
      Auth.isLoggedIn(_.noop)
        .then(is => {
          if (is) {
            return;
          }

          event.preventDefault();
          $state.go('login');
        });
    }
  });
});