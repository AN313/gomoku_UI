var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var me = true;
var over = false;

//赢法数组
var wins = [];

//赢法统计数组
var myWin = [];
var computerWin = [];

var chessBoard = [];
for (var i = 0; i < 15; i++) {
	chessBoard[i] = [];
	for (var j = 0; j < 15; j++) {
		chessBoard[i][j] = 0;
	}
}

//初始化wins数组，为三维数组
for (var i = 0; i < 15; i++) {
	wins[i] = [];
	for (var j = 0; j < 15; j++) {
		wins[i][j] = [];
	}
}
var count = 0;
//遍历所有横线连法
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i][j + k][count] = true;
		}
		count++;
	}
}
console.log(count);
//遍历所有竖线连法

for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[j + k][i][count] = true;
		}
		count++;
	}
}
console.log(count);
//遍历所有斜线连法
for (var i = 0; i < 11; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i + k][j + k][count] = true;
		}
		count++;
	}
}
console.log(count);
//遍历所有反斜线连法
for (var i = 4; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i - k][j + k][count] = true;
		}
		count++;
	}
}
console.log(count);

for (var i = 0; i < count; i++) {
	myWin[i] = 0;
	computerWin[i] = 0;
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

var oneStep = function(i, j, me) {
	context.beginPath();
	context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
	if (me) {
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
	if (over) {
		return;
	}
	if (!me) {
		return;
	}
	// 找到点击处x,y的偏移量
	var x = e.offsetX;
	var y = e.offsetY;
	//计算出点击处位于第几行第几列
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if (chessBoard[i][j] == 0) {
		oneStep(i, j, me);
		chessBoard[i][j] = 1;

		for (var k = 0; k < count; k++) {
			if (wins[i][j][k]) {
				myWin[k]++;
				computerWin[k] = 6;
				if (myWin[k] == 5) {
					window.alert("你赢了！");
					over = true;
				}
			}
		}
		if (!over) {
			me = !me;
			computerAI();
		}
	}
}

var computerAI = function(argument) {
	var myScore = [];
	var computerScore = [];
	var max = 0;
	var u = 0,
		v = 0;
	for (var i = 0; i < 15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for (var j = 0; j < 15; j++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if (chessBoard[i][j] == 0) {
				for (var k = 0; k < count; k++) {
					if (wins[i][j][k]) {
						if (myWin[k] == 1) {
							myScore[i][j] += 200;
						} else if (myWin[k] == 2) {
							myScore[i][j] += 400;
						} else if (myWin[k] == 3) {
							myScore[i][j] += 2000;
						} else if (myWin[k] == 4) {
							myScore[i][j] += 10000;
						}

						if (computerWin[k] == 1) {
							computerScore[i][j] += 220;
						} else if (computerWin[k] == 2) {
							computerScore[i][j] += 420;
						} else if (computerWin[k] == 3) {
							computerScore[i][j] += 2100;
						} else if (computerWin[k] == 4) {
							computerScore[i][j] += 20000;
						}
					}
				}
				if (myScore[i][j] > max) {
					max = myScore[i][j];
					u = i;
					v = j;
				} else if (myScore[i][j] == max) {
					if (computerScore[i][j] > computerScore[u][v]) {
						u = i;
						v = j;
					}
				}
				if (computerScore[i][j] > max) {
					max = computerScore[i][j];
					u = i;
					v = j;
				} else if (computerScore[i][j] == max) {
					if (myScore[i][j] > myScore[u][v]) {
						u = i;
						v = j;
					}
				}
			}
		}
	}
	oneStep(u, v, false);
	chessBoard[u][v] = 2;
	for (var k = 0; k < count; k++) {
		if (wins[u][v][k]) {
			computerWin[k]++;
			myWin[k] = 6;
			if (computerWin[k] == 5) {
				window.alert("被电脑赢了哟！");
				over = true;
			}
		}
	}
	if (!over) {
		me = !me;
	}
}