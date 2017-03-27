'use strict';


angular.module('rpgApp').controller('RoomController', function ($scope, mySocket) {
	console.log('room')
	console.log(mySocket)
	var vm = $scope
	// var socket = io({transports: ['websocket'], upgrade: false});


	vm.joinRoom = function (){
		console.log('Trying to join')
		mySocket.emit('newPlayerJoinning')
	}

	mySocket.on('newPlayerJoinned', function(data){
		console.log('welcome', data)
	})
})