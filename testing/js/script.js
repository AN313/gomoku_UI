var board = document.getElementById('chess');
var context = chess.getContext('2d');


///////////////////////////////////
//////    initialization    ///////
///////////////////////////////////

// black -1 white 1
var gameState = "normal";
var isGameOn = false;
var isWhite = false;


// init board value
var brd = []; 
for (var i = 0; i < 15; i++) {
	brd[i] = [];
	for (var j = 0; j < 15; j++) {
		brd[i][j] = 0;
	}
}

$(document).ready(function(){
    $("#switch").click(function(){
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
												stoneR/2.0, 
												borderWidth + i * cellWidth + 2, 
												borderWidth + j * cellWidth - 2, 
												stoneR);
	// TODO set color to constant 
	if (isWhite) {
		gradient.addColorStop(0, "#F9F9F9");
		gradient.addColorStop(1, "#D1D1D1");
	} else {
		gradient.addColorStop(0, "#636766");
		gradient.addColorStop(1, "#0A0A0A");
	}
	context.fillStyle = gradient;
	context.fill();
}

// sample function 
board.onclick = function(e) {
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / cellWidth);
	var j = Math.floor(y / cellWidth);
	// console.log(i);
	// console.log(j);
	if (brd[i][j] == 0) {
		step(i, j, isWhite);
		if (isWhite) {
			brd[i][j]=1;
		} else {
			brd[i][j]=2;
		}		
	}
	color = -1;
	if (isWhite){
		color = 1;
	}
	isWhite = !isWhite;

}




