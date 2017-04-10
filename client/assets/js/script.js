var canvas = document.getElementById("cnv").getContext("2d");
/*var playerTemplate = {}
playerTemplate.image = new Image();
playerTemplate.image.src = 'public/img/coin.png'

function sprite (options) {
  var self = {
  	canvas: options.canvas,
    width: options.width,
    height: options.height,
  	image : options.image
	};
				
	self.loop = options.loop

	var frameIndex = 0;
  var tickCount  = 0;
  var ticksPerFrame, numberOfFrames;

  options.ticksPerFrame ? ticksPerFrame = options.ticksPerFrame : ticksPerFrame = 0;
  options.numberOfFrames ? numberOfFrames = options.numberOfFrames : numberOfFrames = 1;

  self.render = function () {
  	self.canvas.drawImage( 
  		self.image,
	  	frameIndex * self.width / numberOfFrames,
	  	0,
	  	self.width /numberOfFrames,
	  	self.height,
	  	0,
	  	0,
	  	self.width /numberOfFrames,
	  	self.height
  	);
  };

  self.update = function(){
  	tickCount++;
  	if(tickCount > ticksPerFrame) {
			tickCount = 0;
	    if (frameIndex < numberOfFrames - 1) {
	      frameIndex += 1;
	    }	else if(self.loop) {
	    	frameIndex = 0;
	    }
  	}

  }

  return self;
}


var player = sprite({
		canvas: canvas,
    width: 440,
    height: 440,
    image: playerTemplate.image,
    ticksPerFrame : 1,
    numberOfFrames: 10,
    loop : true
});*/

canvas.font = "30px Arial";

// var socket = io({transports: ['websocket'], upgrade: false});

/*function tryToJoin(){
	console.log('trying to join')
	socket.emit('newPlayerJoinning')
}

socket.on('newPlayerJoinned', function(){
	console.log('welcome')
	// var player = sprite({
	// 		canvas: canvas,
	//     width: 440,
	//     height: 440,
	//     image: playerTemplate.image,
	//     ticksPerFrame : 1,
	//     numberOfFrames: 10,
	//     loop : true
	// })
})*/

socket.on('newPositions',function(data){
	canvas.clearRect(0,0,1000,600)

	for(var i = 0; i < data.length; i++)
			canvas.fillText(data[i].id.slice(0,6), data[i].x, data[i].y);
			/*player.update();
		  player.render();*/
})

document.onkeydown = function(event){
 if(event.keyCode === 37) socket.emit('keyPress', {inputId : 37, state : true})
 if(event.keyCode === 39) socket.emit('keyPress', {inputId : 39, state : true})
 if(event.keyCode === 38) socket.emit('keyPress', {inputId : 38, state : true})
 if(event.keyCode === 40) socket.emit('keyPress', {inputId : 40, state : true})
}

document.onkeyup = function(event){
 if(event.keyCode === 37) socket.emit('keyPress', {inputId : 37, state : false})
 if(event.keyCode === 39) socket.emit('keyPress', {inputId : 39, state : false})
 if(event.keyCode === 38) socket.emit('keyPress', {inputId : 38, state : false})
 if(event.keyCode === 40) socket.emit('keyPress', {inputId : 40, state : false})
}