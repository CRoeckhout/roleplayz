'use strict';

angular.module('rpgApp').controller('SettingsController', function ($rootScope, $scope, $state, Auth, Upload) {
	var vm = $scope

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
	}
})