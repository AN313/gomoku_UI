var chess = document.getElementById('chess');
var context = chess.getContext('2d');


// TODO:  set white to 1 or 2 

var color = true;

// init board 
var chessBoard = [];
for (var i = 0; i < 15; i++) {
	chessBoard[i] = [];
	for (var j = 0; j < 15; j++) {
		chessBoard[i][j] = 0;
	}
}

// constant
var size = 450 // TODO: get size from responsive webpage 
var borderWidth = 15
var cellWidth = 30 
var stoneR = 13

//add background and set strock color 
context.strokeStyle = '#666666';

// TODO change logo to background? 
var logo = new Image();
logo.src = "image/logo.png";
logo.onload = function() {
	context.drawImage(logo, 0, 0, size, size);
	drawChessBoard();
}

//Draw board 
var drawChessBoard = function() {
	for (var i = 0; i < borderWidth; i++) {
		context.moveTo(borderWidth + i * cellWidth, borderWidth);
		context.lineTo(borderWidth + i * cellWidth, size - borderWidth);
		context.stroke();
		context.moveTo(borderWidth, borderWidth + i * cellWidth);
		context.lineTo(size - borderWidth, borderWidth + i * cellWidth);
		context.stroke();
	}
}

var step = function(i, j, color) {
	context.beginPath();
	context.arc(borderWidth + i * 30, borderWidth + j * 30, 13, 0, 2 * Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(borderWidth + i * cellWidth + 2, 
												borderWidth + j * cellWidth - 2, 
												13, 
												borderWidth + i * cellWidth + 2, 
												borderWidth + j * cellWidth - 2, 
												0);
	
	// TODO set color to constant 
	if (color) {
		gradient.addColorStop(0, "#0A0A0A");
		gradient.addColorStop(1, "#636766");
	} else {
		gradient.addColorStop(0, "#D1D1D1");
		gradient.addColorStop(1, "#F9F9F9");
	}
	context.fillStyle = gradient;
	context.fill();
}

chess.onclick = function(e) {
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if (chessBoard[i][j] == 0) {
		step(i, j, color);
		if (color) {
			chessBoard[i][j]=1;
		} else {
			chessBoard[i][j]=2;
		}		
	}

	// Send JSON 

	color = !color;



}



// function for recieving JSON from AI








