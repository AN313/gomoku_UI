var board = document.getElementById('chess');
var context = chess.getContext('2d');


var isGameOn = false

// TODO:  switch color button

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

	// Send JSON 
	isWhite = !isWhite;
}



// function for recieving JSON from AI server
// fake json for moves 

// var move = '{ "x":"1", "y":"2" , "color":"black"}';

// move_obj = JSON.parse(move);
// document.getElementById("demo").inneHTML = move_obj.x + " " + move_obj.y + " " + move_obj.color;


function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

$(document).ready(function(){

	// function for recieving JSON from AI server
	// fake json for moves 
	var text = httpGet('http://localhost:8000/mcts')
	var move = '{ "x":"1", "y":"2" , "color":"black"}';

	move_obj = JSON.parse(move);
	// document.getElementById("demo").inneHTML = move_obj.x + " " + move_obj.y + " " + move_obj.color;
	document.getElementById("demo").inneHTML = text

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
});

// sample function for sending ajax
// function send() {
//     var person = {
//         name: $("#id-name").val(),
//         address:$("#id-address").val(),
//         phone:$("#id-phone").val()
//     }

//     $('#target').html('sending..');

//     $.ajax({
//         url: '/test/PersonSubmit',
//         type: 'post',
//         dataType: 'json',
//         success: function (data) {
//             $('#target').html(data.msg);
//         },
//         data: person
//     });
// }




