var board = document.getElementById('chess');
var context = chess.getContext('2d');

// black -1 white 1
var isGameOn = false;
var isWhite = false;
var isPlayer1Turn = true;
var isVsComputer = true;
var reseted = false;

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

// sample function 
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
	color = -1;
	if (isWhite){
		color = 1;
	}
	sendMove(i,j,color);
	isWhite = !isWhite;

}


$("#play").click(function(){
	var text = '{"x":3,"y":3,"color":"black" }';
	obj = JSON.parse(text);
	i = obj.x
	j = obj.y
	isWhite = (obj.color == "white")
	// alert("Width of div: " + $("#chess").width());
	if (brd[i][j] == 0) {
		step(i, j, isWhite);
		if (isWhite) {
			brd[i][j]=1;
		} else {
			brd[i][j]=2;
		}		
	}
});


$("#reset").onclick = resetGame();

$("#play").onclick = function(e) {
	i = 10 // placeholder for now
	// while(not game end)
	if(reseted){
		reseted = false;
		while(i>0){
			console.log("here in the game loop");
			
			if(isPlayer1Turn){
				// default black first,computer play first move
				playMove();
				isPlayer1Turn = !isPlayer1Turn;
			}else{
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
					color = -1;
					if (isWhite){
						color = 1;
					}
					sendMove(i,j,color);
					isWhite = !isWhite;
				
				}
			}
			
			
			i=i-1;
		}
	
	}
}



function sendMove(x, y, color){
	$.ajax({
		type: "post", 
		// TODO: edit 
		url: "http://cnx.ddns.net:8000/move?x="+x.toString()
				+"&y="+y.toString()
				+"&color="+color.toString(),
		success: function (data) {
			// alert("success");
			console.log("send move success");
		},
		error: function (request, status, error) {
			// alert(request.responseText);
			console.log(equest.responseText);
		}
	});

}

function resetGame(){
	$.ajax({
		type: "post", 
		url: "http://cnx.ddns.net:8000/reset",
		success: function (data) {
			// alert("success");
			console.log("reset success");
		},
		error: function (request, status, error) {
			// alert(request.responseText);
			console.log(equest.responseText);
		}
	});
	reseted = true;
}

function playMove(){
	$.ajax({
		type: "get", 
		url: "http://cnx.ddns.net:8000/mcts",
		success: function (data) {
			console.log("get computer success");
			makeMove(data['x'],data['y'])
		},
		error: function (request, status, error) {
			// alert(request.responseText);
			console.log(equest.responseText);
    	}
	});
}

function makeMove(i, j, color=1){
	isWhite = (color == 1);
	if (brd[i][j] == 0) {
		step(i, j, isWhite);
		if (isWhite) {
			brd[i][j]=1;
		} else {
			brd[i][j]=2;
		}	
	}	
	isWhite = !isWhite;
} 

// MAIN GAME LOOP
$(document).ready(function(){
	var i = 10 // placeholder for now
	// while(not game end)
	if(reseted){
		alert("was reseted")
		reseted = false;
		while(i>0){
			console.log("here in the game loop");
			
			if(isPlayer1Turn){
				// default black first,computer play first move
				playMove();
				isPlayer1Turn = !isPlayer1Turn;
				console.log("got computer move");
			}else{
				console.log("waiting for user click");
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
					color = -1;
					if (isWhite){
						color = 1;
					}
					sendMove(i,j,color);
					isWhite = !isWhite;
				
				}
				// console.log(a)
			}
			
			console.log(i)
			i=i-1;
		}
	
	}


});