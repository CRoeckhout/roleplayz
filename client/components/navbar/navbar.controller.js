'use strict';

angular.module('rpgApp')
  .controller('NavbarController', function ($state, $scope, Auth) {
  	var vm = $scope;
  	vm.state = $state;
  	vm.Auth = Auth;
  });
