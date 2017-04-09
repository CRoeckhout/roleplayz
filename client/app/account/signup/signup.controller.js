'use strict';

angular.module('rpgApp').controller('SignupController', function ($scope, $state, Auth) {
	var vm = $scope

	vm.createUser = function(form){
		if(form.$valid) {
			vm.Auth.createUser({
	      username: vm.user.username,
	      email: vm.user.email,
	      password: vm.user.password
	    })
	    .then(() => {
	      $state.go('profile');
	    })
	    .catch(err => {
	      err = err.data;
	      vm.errors = {};
	      if(err.fields)
	      {
	      	vm.errors.other = err.message
	      }
	      else {
	      	vm.errors.other = err.message.slice(err.message.indexOf(':') + 2)
	      }
	    });
    }
	}
})