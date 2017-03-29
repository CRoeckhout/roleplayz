'use strict';


angular.module('rpgApp').controller('RoomController', function ($scope, mySocket, Controls) {
	console.log('room')
	var vm = $scope
	vm.isConnected = false;
	vm.player = {}
	vm.isFocused = true;

	var canvasElem = document.getElementById("cnv");
	var canvas = document.getElementById("cnv").getContext("2d");
	var chatBox = document.getElementById("chatBox");
	var chatInput = document.getElementById("chatInput");

	canvasElem.width = 945;
	canvasElem.height = 630;

	canvas.font = "30px Arial";

	vm.joinRoom = function (){
		console.log('Trying to join');
		mySocket.emit('newPlayerJoinning');
	}

	vm.leaveRoom = function (){
		console.log('Trying to leave');
		mySocket.emit('PlayerLeaving', vm.player);
	}

	vm.sendMessage = function (){
		if(chatInput.value.startsWith('/')){
			mySocket.emit('evalValue', chatInput.value.slice(1));
		}
		else {
			mySocket.emit('sendMessage', chatInput.value);
		}
		chatInput.value = '';
	}

	mySocket.on('newMessage', function(data){
		chatBox.innerHTML += '<div>' + data +'</div>';
	})

	mySocket.on('evalReturn', function(data){
		console.log(data)
	})

	mySocket.on('newPlayerJoinned', function(data){
		vm.isConnected = true;
		vm.player = data
		console.log('Welcome', data)
	})

	mySocket.on('playerLeft', function(data){
		vm.isConnected = false;
		console.log('Bye', data)
	})


/*var gradient=canvas.createLinearGradient(0,0,canvasElem.width,0);
	gradient.addColorStop("0","magenta");
	gradient.addColorStop("0.5","blue");
	gradient.addColorStop("1.0","red");
	canvas.fillStyle=gradient;*/

	canvas.fillStyle = "#e82e1e";

	mySocket.on('newPositions',function(data){
		canvas.clearRect(0,0,945,630)
		for(var i = 0; i < data.length; i++) {
			canvas.fillText(data[i].id.slice(0,6), data[i].x - 30, data[i].y - 10);
			canvas.fillRect(data[i].x, data[i].y, 40, 40);
/*			player.update();
	  	player.render();*/
	  }
	})

	window.onbeforeunload = function () {
	    mySocket.emit('trytoDc', mySocket)
	    mySocket.emit('disconnect', mySocket)
	};

	document.onkeydown = function(event){
		if(vm.isFocused){
	 		if(Controls.get(event.keyCode) === 'left') mySocket.emit('keyPress', {action : 'left', state : true}) // Left
	 		if(Controls.get(event.keyCode) === 'right') mySocket.emit('keyPress', {action : 'right', state : true}) // Right
	 		if(Controls.get(event.keyCode) === 'up') mySocket.emit('keyPress', {action : 'up', state : true}) // Up
	 		if(Controls.get(event.keyCode) === 'down') mySocket.emit('keyPress', {action : 'down', state : true}) // Down
	 	}
	}

	document.onkeyup = function(event){
		if(vm.isFocused){
			if(Controls.get(event.keyCode) === 'left') mySocket.emit('keyPress', {action : 'left', state : false}) // Left
			if(Controls.get(event.keyCode) === 'right') mySocket.emit('keyPress', {action : 'right', state : false}) // Right
			if(Controls.get(event.keyCode) === 'up') mySocket.emit('keyPress', {action : 'up', state : false}) // Up
			if(Controls.get(event.keyCode) === 'down') mySocket.emit('keyPress', {action : 'down', state : false}) // Down
		}
	}

	var arrow_keys_handler = function(e) {
	    switch(e.keyCode){
	        case 37:
	        case 39: 
	        case 38:  
	        case 40: // Arrow keys
	        case 32: e.preventDefault(); break; // Space
	        default: break; // do not block other keys
	    }
	};

	window.addEventListener("keydown", arrow_keys_handler, false);

	chatInput.addEventListener('blur', function(){
		window.addEventListener("keydown", arrow_keys_handler, false);
		vm.isFocused = true
	})

	chatInput.addEventListener('focus', function(){
		mySocket.emit('chatInputFocused')
		window.removeEventListener("keydown", arrow_keys_handler, false);
		vm.isFocused = false
	})

})