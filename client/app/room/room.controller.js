'use strict';


angular.module('rpgApp').controller('RoomController', function ($scope, mySocket) {
	console.log('room')
	var vm = $scope
	vm.isConnected = false;
	vm.player = {}
	// var socket = io({transports: ['websocket'], upgrade: false});

	var canvas = document.getElementById("cnv").getContext("2d");

	canvas.font = "30px Arial";

	vm.joinRoom = function (){
		console.log('Trying to join')
		mySocket.emit('newPlayerJoinning')
	}

	vm.leaveRoom = function (){
		console.log('Trying to leave')
		mySocket.emit('PlayerLeaving', vm.player)
	}

	mySocket.on('newPlayerJoinned', function(data){
		vm.isConnected = true;
		vm.player = data
		console.log('Welcome', data)
	})

	mySocket.on('playerLeft', function(data){
		vm.isConnected = false;
		console.log('Bye', data)
	})

	mySocket.on('newPositions',function(data){
		console.log('fill')
		canvas.clearRect(0,0,1000,600)
		for(var i = 0; i < data.length; i++) {
			canvas.fillText(data[i].id.slice(0,6), data[i].x, data[i].y);
/*			player.update();
	  	player.render();*/
	  }
	})


	window.onbeforeunload = function () {
	    mySocket.emit('trytoDc', mySocket)
	    mySocket.emit('disconnect', mySocket)
	};

	document.onkeydown = function(event){
	 if(event.keyCode === 37) mySocket.emit('keyPress', {inputId : 37, state : true})
	 if(event.keyCode === 39) mySocket.emit('keyPress', {inputId : 39, state : true})
	 if(event.keyCode === 38) mySocket.emit('keyPress', {inputId : 38, state : true})
	 if(event.keyCode === 40) mySocket.emit('keyPress', {inputId : 40, state : true})
	}

	document.onkeyup = function(event){
	 if(event.keyCode === 37) mySocket.emit('keyPress', {inputId : 37, state : false})
	 if(event.keyCode === 39) mySocket.emit('keyPress', {inputId : 39, state : false})
	 if(event.keyCode === 38) mySocket.emit('keyPress', {inputId : 38, state : false})
	 if(event.keyCode === 40) mySocket.emit('keyPress', {inputId : 40, state : false})
	}

var arrow_keys_handler = function(e) {
    switch(e.keyCode){
        case 37: case 39: case 38:  case 40: // Arrow keys
        case 32: e.preventDefault(); break; // Space
        default: break; // do not block other keys
    }
};
window.addEventListener("keydown", arrow_keys_handler, false);

})