var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var color = true;
var chessBoard = [];
for (var i = 0; i < 15; i++) {
	chessBoard[i] = [];
	for (var j = 0; j < 15; j++) {
		chessBoard[i][j] = 0;
	}
}

//改变画笔颜色
context.strokeStyle = '#bfbfbf';

var logo = new Image();
logo.src = "image/logo.png";
logo.onload = function() {
	context.drawImage(logo, 0, 0, 450, 450);
	drawChessBoard();
}

//画棋盘
var drawChessBoard = function() {
	for (var i = 0; i < 15; i++) {
		context.moveTo(15 + i * 30, 15);
		context.lineTo(15 + i * 30, 435);
		context.stroke();
		context.moveTo(15, 15 + i * 30);
		context.lineTo(435, 15 + i * 30);
		context.stroke();
	}
}

var oneStep = function(i, j, color) {
	context.beginPath();
	context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
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
	// 找到点击处x,y的偏移量
	var x = e.offsetX;
	var y = e.offsetY;
	//计算出点击处位于第几行第几列
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if (chessBoard[i][j] == 0) {
		oneStep(i, j, color);
		if (color) {
			chessBoard[i][j]=1;
		} else {
			chessBoard[i][j]=2;
		}		
	}
	//每次点击后取反，使得黑白交替落子
	color = !color;
}