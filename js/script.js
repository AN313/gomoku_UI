var board = document.getElementById('chess');
var context = chess.getContext('2d');


///////////////////////////////////
//////    initialization    ///////
///////////////////////////////////

// black -1 white 1
var gameState = "normal";
var isGameOn = false;
var isWhite = false;  ///////// fix this
var isPlayer1Turn = true;
var isVSComp = true;
var reseted = false;
var dataSent = false;

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
        	isWhite = !isWhite;
        	console.log('iswhite')
        	console.log(isWhite)
	        if(isWhite){
				$("#sideYou").text('You: White');
			   	$("#sideComp").text('Computer: Black');
			}else{
		    	$("#sideYou").text('You: Black');
		    	$("#sideComp").text('Computer: White');
		    }
        } else {
        	alert("You can not switch side during a game");
        }
    });

    $("#vsComp").click(function(){
        // alert("Width of div: " + $("#chess").width());
        console.log(isVSComp)
        if (!isGameOn){
        	isVSComp = !isVSComp;
	        if(isVSComp){
		    	$("#vsComp").text('Playing against: Computer');

		    }else{
		    	$("#vsComp").text('Playing against: Human');
			}

		    
        } else {
        	alert("You can not change opponent during a game");
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
    
    if(isVSComp){
    	$("#vsComp").text('Playing against: Computer');

    }else{
    	$("#vsComp").text('Playing against: Human');
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
// var logo = new Image();
// logo.src = "image/logo.png";
$(document).ready(function() {
	// context.drawImage(logo, 0, 0, size, size);
	drawBoard();
});


//Draw board
var drawBoard = function() {
	for (var i = 0; i < borderWidth; i++) {
		console.log("drawing line")
		context.beginPath();
		context.moveTo(borderWidth + i * cellWidth, borderWidth);
		context.lineTo(borderWidth + i * cellWidth, size - borderWidth);
		context.stroke();
		context.moveTo(borderWidth, borderWidth + i * cellWidth);
		context.lineTo(size - borderWidth, borderWidth + i * cellWidth);
		context.stroke();
		context.closePath();
	}
}


// Drawing step 
var step = function(i, j, isWhite) {
	isGameOn = true;
	console.log("drawing step")

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
	console.log(i);
	console.log(j);
	if (brd[i][j] == 0) {
		step(i, j, isWhite);
		if (isWhite) {
			brd[i][j]=1;
		} else {
			brd[i][j]=2;
		}		
	}
	
	if(isVSComp){
		dataSent = false;
		color = -1;
		if (isWhite){
			color = 1;
		}

		sendMove(i,j,color);
		gameState ="playerMove1";
	}
	
	isWhite = !isWhite;

	
}

////////////////////////////
//////    buttons    ///////
////////////////////////////


$("#reset").click(function(){
	console.log("reseting")
	resetGame();
});


///////////////////////////////
//////    functions    ////////
///////////////////////////////

function sendMove(x, y, color){
	$.ajax({
		type: "post", 
		// TODO: edit 
		url: "http://cnx.ddns.net:8000/move?x="+ x.toString()
				+"&y="+y.toString()
				+"&color="+color.toString(),
		success: function (data) {
			// alert("success");
			console.log("send move success");
			console.log("x="+ x.toString()+"   y="+y.toString()
				+"   color="+color.toString());
			dataSent=true;
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
			for (var i = 0; i < 15; i++) {
				brd[i] = [];
				for (var j = 0; j < 15; j++) {
					brd[i][j] = 0;
				}
			}
			isGameOn = false;

			context.clearRect(0, 0, board.width, board.height);
			// context.drawImage(logo, 0, 0, size, size);
			console.log("redrew board");
			// drawBoard();
			drawBoard();
	
		},
		error: function (request, status, error) {
			// alert(request.responseText);
			console.log(equest.responseText);
		}
	});
	reseted = true;
	// reset board
}

function playMove(){
	dataSent = false;
	$.ajax({
		type: "get", 
		url: "http://cnx.ddns.net:8000/mcts",
		success: function (data) {
			console.log("get computer success");
			console.log(data);
			makeMove(data['x'],data['y'],data['v_list']);
			color = -1;
			if (isWhite){
				color = 1;
			}
			sendMove(data['x'],data['y'],color);
			
			isWhite = !isWhite;
		},
		error: function (request, status, error) {
			// alert(request.responseText);
			console.log(equest.responseText);
    	}
	});
}

// make one move
// assign value 
function makeMove(i, j, list){
	// isWhite = (color == 1);
	if (brd[i][j] == 0) {
		step(i, j, isWhite);
		// update board
		if (isWhite) {
			brd[i][j]=1;
		} else {
			brd[i][j]=2;
		}
	}	
} 

///////////////////////////////
//////    gameloop    /////////
///////////////////////////////
$(document).ready(function(){
	// while(not game end)
	if(isVSComp){
		if(reseted){
			// if play button is hit
			console.log("was reseted");
			reseted = false;
			initGameLoop();
		}else{
			resetGame();
			console.log("resete now!");
			reseted = false;
			initGameLoop();
		}
	}
});

///////////////// moved from gameloop.js
////// need to fix 
var initGameLoop = function() {
	if (isVSComp){ 
		function animate () {

			if(gameState === "playerMove1") {
				if(dataSent){
					playMove();	
			      	gameState = "playerMove2";
				}
			  	} else if (gameState === "playerMove2"){

			  	} else{
		  
			  	}
				requestAnimationFrame(animate);
			}
			animate();

		}else{
			// human play human
		}
};

