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
    controllerAs: 'vm'
  });
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
})

.factory('mySocket', function (socketFactory) {
  return socketFactory();
})

.factory('Actions',function(){
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

/*rpgApp.run(function($rootScope) {
  $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
    if (next.name === 'logout' && current && current.name && !current.authenticate) {
      next.referrer = current.name;
    }
  });
});*/