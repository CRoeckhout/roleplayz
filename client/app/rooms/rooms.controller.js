'use strict';


angular.module('rpgApp').controller('RoomsController', function ($rootScope, $scope, $http, $state, $uibModal) {
	var vm = $scope
	vm.filter = {}
	vm.orderBy = 'createdAt';
	vm.reverseSort = false;
	vm.rooms = []
	vm.data = {
		maxPlayers:2
	}

	$http.get($rootScope.config.baseUrl + '/api/rooms').then(function(response){
		vm.rooms = response.data
		console.log(vm.rooms)
 	})

	vm.displayRooms = function() {
		return _.filter(vm.rooms,function(dossier){
			var condition = (!vm.filter.name  || dossier.name.startsWith(vm.filter.name))
			return condition;
		})
	}

	vm.joinRoom = function(room) {
		$state.go('room', {roomId:room._id})
	}

	vm.createRoom = function(size, parentSelector) 
	{
		$('#modalCreateRoom').modal('show')
	}

	vm.validate = function(){
		if(vm.data.name && vm.data.name != ''
			&& vm.data.info && vm.data.info != ''
			&& vm.data.maxPlayers && vm.data.maxPlayers >= 1 && vm.data.maxPlayers <= 100)
		{
			$http.post($rootScope.config.baseUrl + '/api/rooms',vm.data).then(function(){
				$('#modalCreateSuccess').modal('show')
				$('#createButton').prop('disabled', true)
				setTimeout(function(){
					$('#modalCreateSuccess').modal('hide')
					$('#createButton').prop('disabled', false)
				},3000)
			})
		} else {
			$('#modalCreateWarning').modal('show')
		}
	}
})