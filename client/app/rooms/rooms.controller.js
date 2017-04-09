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
			if( vm.picFile && vm.edit.description && vm.edit.description != '' 
				&& vm.edit.priceTTC && vm.edit.priceTTC >= 1
				&& vm.edit.priceHT && vm.edit.priceHT >= 0.01
				&& vm.edit.poids && vm.edit.poids >= 0.01)
			{
				if(vm.picFile != vm.oldImg){
					vm.uploadPic(vm.picFile, vm.data)
				}
				$http.put($rootScope.config.baseUrl + '/api/produits/' + vm.edit._id ,vm.edit).then(function(){
					$('#modalEditSuccess').modal('show')
					$('#createButton').prop('disabled', true)
					setTimeout(function(){
						$('#modalEditSuccess').modal('hide')
						$('#createButton').prop('disabled', false)
					},3000)
				})
			} else {
				$('#modalEditWarning').modal('show')
			}
		}

})