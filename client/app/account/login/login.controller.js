'use strict';

angular.module('rpgApp').controller('LoginController', function (Auth) {
	var vm = this
	console.log(Auth)
	vm.login = function() {
		console.log('login')
		console.log(vm.user.email, vm.user.password)
		Auth.login({email :vm.user.email, password:vm.user.password})
/*    if (form.$valid) {
	      this.Auth.login({
	          email: this.user.email,
	          password: this.user.password
	        })
	        .then(() => {
	          // Logged in, redirect to home
	          this.$state.go('scan');
	        })
	        .catch(err => {
	          this.errors.other = err.message;
	        });
	      }*/
    }
})