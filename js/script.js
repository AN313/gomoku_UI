var board = document.getElementById('chess');
var context = chess.getContext('2d');


var isGameOn = false

// TODO:  switch color button

$(document).ready(function(){


    $("button").click(function(){
        // alert("Width of div: " + $("#chess").width());
        if (!isGameOn){
        	isWhite = !isWhite
        } else {
        	alert("You can not switch side during a game");
        }
    });

    
});

$(document).ready(function(){
	if(isWhite){
		$("#sideYou").text('You: White');
	   	$("#sideComp").text('Computer: Black');
	}else{
    	$("#sideYou").text('You: Black');
    	$("#sideComp").text('Computer: White');
    }

});
var isWhite = false;

// init board value
var brd = []; 
for (var i = 0; i < 15; i++) {
	brd[i] = [];
	for (var j = 0; j < 15; j++) {
		brd[i][j] = 0;
	}
}

// constant
var size =  750// TODO: get size from responsive webpage 
// $("#chess").width()
var borderWidth = 25
var cellWidth = 50
var stoneR = 50/2 - 3

//add background and set strock color 
context.strokeStyle = '#666666';

// TODO change logo to background? 
var logo = new Image();
logo.src = "image/logo.png";
logo.onload = function() {
	context.drawImage(logo, 0, 0, size, size);
	drawBoard();
}

//Draw board 
var drawBoard = function() {
	for (var i = 0; i < borderWidth; i++) {
		context.moveTo(borderWidth + i * cellWidth, borderWidth);
		context.lineTo(borderWidth + i * cellWidth, size - borderWidth);
		context.stroke();
		context.moveTo(borderWidth, borderWidth + i * cellWidth);
		context.lineTo(size - borderWidth, borderWidth + i * cellWidth);
		context.stroke();
	}
}

var step = function(i, j, isWhite) {
	if (!isGameOn){
		isGameOn = true
	}


	context.beginPath();
	context.arc(borderWidth + i * cellWidth, borderWidth + j * cellWidth, stoneR, 0, 2 * Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(borderWidth + i * cellWidth + 2, 
												borderWidth + j * cellWidth - 2, 
												stoneR, 
												borderWidth + i * cellWidth + 2, 
												borderWidth + j * cellWidth - 2, 
												0);
	// TODO set color to constant 
	if (isWhite) {
		gradient.addColorStop(0, "#D1D1D1");
		gradient.addColorStop(1, "#F9F9F9");
	} else {
		gradient.addColorStop(0, "#0A0A0A");
		gradient.addColorStop(1, "#636766");
		
	}
	context.fillStyle = gradient;
	context.fill();
}

board.onclick = function(e) {
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / cellWidth);
	var j = Math.floor(y / cellWidth);
	if (brd[i][j] == 0) {
		step(i, j, isWhite);
		if (isWhite) {
			brd[i][j]=1;
		} else {
			brd[i][j]=2;
		}		
	}

	// Send JSON 
	isWhite = !isWhite;
}



// function for recieving JSON from AI server








