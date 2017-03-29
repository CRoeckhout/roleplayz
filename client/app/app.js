'use strict';

var rpgApp = angular.module("rpgApp", ['ui.router', 'btford.socket-io'])

rpgApp.config(function($urlRouterProvider, $stateProvider, $locationProvider) {
  $stateProvider
  .state('login', {
      url: '/login',
      templateUrl: '/app/account/login/login.html',
      controller: 'LoginController',
      controllerAs: 'vm'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: '/app/account/signup/signup.html',
    controller: 'SignupController',
    controllerAs: 'vm'
  })
  .state('room', {
    url: '/room',
    templateUrl: '/app/room/room.html',
    controller: 'RoomController',
    controllerAs: 'vm',
    authenticate:true
  });
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
})

.factory('mySocket', function (socketFactory) {
  return socketFactory();
})
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
.factory('Auth',function($http){
  self = {
    active : true,

    login({
        email,
        password
      }, callback) {
        return $http.post('/api/users/me', {
            email: email,
            password: password
          })
          .then(res => {
            return res.data
            /*$cookies.put('token', res.data.token);
            currentUser = User.get();
            return currentUser.$promise;*/
          })
          /*.then(user => {
            safeCb(callback)(null, user);
            return user;
          })*/
          .catch(err => {
            if(err.status == 404)
            return err.data
            /*Auth.logout();
            safeCb(callback)(err.data);
            return $q.reject(err.data);*/
          });
      },

    isAuthenticated() {
      return true
    }
  }

  return self
})


.run(function ($rootScope, $state, Auth) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.authenticate && !Auth.isAuthenticated()){
      // User isn’t authenticated
      $state.transitionTo("login");
      event.preventDefault(); 
    }
  });
});