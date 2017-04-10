'use strict';

angular.module('rpgApp').controller('SettingsController', function ($rootScope, $scope, $state, $http, Auth, Upload, User) {
	var vm = $scope
	vm.picFile = ''

	vm.user = Auth.getCurrentUser()

	setTimeout(function(){
		$http({
		    url: $rootScope.config.baseUrl + vm.user.profilePicture,
		    method: "GET",
		    responseType: "blob"

		}).then(function(res){
			vm.picFile = res.data
		})

	},100)

	vm.uploadPic = function(file, categorie) {
		file.upload = Upload.upload({
		  url: $rootScope.config.baseUrl + '/api/users/uploadImage',
		  data: {file: file},
		});

		file.upload.then(function (response) {
		    file.result = response.data;
		}, function (response) {
		  if (response.status > 0) {
		    vm.errorMsg = response.status + ': ' + response.data;
		  }
		}, function (evt) {
		  file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		});
	}

	vm.validateEdit = function(){
		vm.uploadPic(vm.picFile, vm.data)
		$http.put($rootScope.config.baseUrl + '/api/users',{}).then(function(){
			Auth.setCurrentUser(User.get())
		}).catch(function(err){
			console.log(err)
		})
	}
})