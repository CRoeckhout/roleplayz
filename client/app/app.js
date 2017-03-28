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
  // $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
})

.factory('mySocket', function (socketFactory) {
  return socketFactory();
});

/*rpgApp.run(function($rootScope) {
  $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
    if (next.name === 'logout' && current && current.name && !current.authenticate) {
      next.referrer = current.name;
    }
  });
});*/