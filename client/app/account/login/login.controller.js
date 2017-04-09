'use strict';

angular.module('rpgApp').controller('LoginController', function ($scope, $state, Auth) {
	var vm = $scope

	vm.login = function() {
		console.log(vm.user.email, vm.user.password)
		Auth.login({email :vm.user.email, password:vm.user.password})
		.then(function(resp){
			if(!resp.error) $state.go('rooms');
			else vm.error = resp
		})
  }
})