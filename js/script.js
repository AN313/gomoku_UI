var board = document.getElementById('chess');
var context = chess.getContext('2d');
var board1 = document.getElementById('prob');
var context_prob = prob.getContext('2d');
var container = document.getElementById('canvas_container');


///////////////////////////////////
//////    initialization    ///////
///////////////////////////////////

// black -1 white 1
var isGameOn = false;
var isWhite = false;
var isPlayer1Turn = true;
var isVSComp = true;
var reseted = false;
var dataSent = true;
var displayProb = true;

// init board value
var brd = [];
for (var i = 0; i < 15; i++) {
	brd[i] = [];
	for (var j = 0; j < 15; j++) {
		brd[i][j] = 0;
	}
}

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
var borderWidth = 25
var cellWidth = 50
var stoneR = 50/2 - 3

//add background and set strock color
context.strokeStyle = '#000000';

// TODO change logo to background?
var background = new Image();
background.src = "image/white.png";
// $(document).ready(function() {
background.onload = function() {
	context.drawImage(background, 0, 0, size, size);
	drawBoard();
}


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

	// board.onclick = function(e) {
	container.onclick = function(e) {
		var x = e.offsetX;
		var y = e.offsetY;
		var i = Math.floor(x / cellWidth);
		var j = Math.floor(y / cellWidth);
		console.log(i);
		console.log(j);
		if (brd[i][j] != 0) return;
		context_prob.clearRect(0, 0, board.width, board.height);
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
			// $('#canvas_container').click(function(){return false;});
			// gameState ="playerMove1";
			isPlayer1Turn = !isPlayer1Turn;
		}
		// switch side after clicking the board
		isWhite = !isWhite;
	}

	////////////////////////////
	//////    buttons    ///////
	////////////////////////////

	$("#reset").click(function(){
		console.log("reseting")
		resetGame();
	});



	$(document).ready(function(){
		$("#switch").click(function(){
			// set human player's color
			// black play first
			if (!isGameOn){
				isWhite = !isWhite;
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
			// set if playing against computer
			// default true
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
		$("#start").click(function(){
			// start
			isGameOn = true;
			console.log("game started")

		});
	});


	///////////////////////////////
	//////    functions    ////////
	///////////////////////////////

	function sendMove(x, y, color){
		$.ajax({
			type: "post",
			url: "http://cnx.ddns.net:8000/move?x="+ x.toString()
			+"&y="+y.toString()
			+"&color="+color.toString(),
			success: function (data) {
				console.log("send move success");
				console.log("x="+ x.toString()+"   y="+y.toString()
				+"   color="+color.toString());
				dataSent=true;
			},
			error: function (request, status, error) {
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
				context_prob.clearRect(0, 0, board.width, board.height);
				console.log("redrew board");
				// background.onload = function() {
				context.drawImage(background, 0, 0, size, size);
				drawBoard();


			},
			error: function (request, status, error) {
				console.log(request.responseText);
			}
		});
		reseted = true;
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
				// switch side after computer makes move
				isWhite = !isWhite;
			},
			error: function (request, status, error) {
				console.log(equest.responseText);
			}
		});

		// switch side after computer makes move
		isWhite = !isWhite;
	}


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
		// draw probability for other possible moves
		//
		if (displayProb){
			console.log("drawing other possible moves")
			for (idx in list) {
				possible_move = list[idx]
				console.log(possible_move);
				context_prob.beginPath();
				context_prob.setLineDash([5]);
				context_prob.arc(borderWidth + possible_move['x'] * cellWidth, borderWidth + possible_move['y'] * cellWidth, stoneR, 0, 2 * Math.PI);
				context_prob.textAlign = 'center';
				context_prob.textBaseline = 'middle';
				// context_prob.fillStyle = "#fff";
				// context_prob.fill();
				context_prob.fillStyle = "#ff6600";
				context_prob.fillText(	possible_move['Q'].toFixed(2),
				borderWidth + possible_move['x'] * cellWidth,
				borderWidth + possible_move['y'] * cellWidth);
				context_prob.closePath();
				context_prob.stroke();
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
				console.log("was reseted");
				reseted = false;
				initGameLoop(isGameOn);
			}else{
				resetGame();
				console.log("resete now!");
				reseted = false;
				initGameLoop(isGameOn);
			}

		}

	});


	// create two game loop for switching sides
	var initGameLoop = function() {

		if (isVSComp){
			// if computer first (isWhite == true )

			if (isWhite){
				// since computer is first and playing black
				isWhite =!isWhite;

				function animate () {

					if(isPlayer1Turn) {

						if(dataSent){
							playMove();
							isPlayer1Turn = !isPlayer1Turn;

						}
					} else if (!isPlayer1Turn ){


					} else{

					}
					requestAnimationFrame(animate);
				}
				animate();

			}else{
				// else human first (isWhite ==flase)
				function animate () {

					if(isPlayer1Turn) {

					} else if (!isPlayer1Turn){


						if(dataSent){
							playMove();
							isPlayer1Turn=!isPlayer1Turn;
						}
					} else{

					}
					requestAnimationFrame(animate);
				}
				animate();
			}
		}else{
			// human play human
			// does not need gameloop
		}
	};
