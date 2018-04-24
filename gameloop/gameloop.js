var canvas = document.getElementById("can");
var ctx = canvas.getContext('2d');
var gameState = "normal";

var initGameLoop = function() {
  player1 = new humanPlayer();
  player2 = new computerPlayer();
  function animate () {
    if(gameState === "playerMove1") {
      player1.acceptMove();
      gameState ="playerMove2";
      
    } else if(gameState === "playerMove2"){
      player2.acceptMove();
      gameState ="wait";
    } else{

    }
    redraw();
    requestAnimationFrame(animate)
  }
  animate()
};

function redraw() {
  ctx.font="10px Sans-serif";
  ctx.fillStyle="#333333";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#00FFFF";
  ctx.fillText(player1.count,100,50);
  ctx.fillStyle="#FFFF00";
  ctx.fillText(player2.count,100,70);
  ctx.fillStyle="#EEEEEE";
  ctx.fillText("PLAYER 1:", 40,50);
  ctx.fillText("PLAYER 2:", 40,70);
}

function addPieceWithMouse() {
   gameState = "playerMove"; 
}

function finishMove() {
   gameState = "normal";
}

function player1() {
   gameState = "playerMove1";
}

// canvas.addEventListener("mousedown", addPieceWithMouse);
// canvas.addEventListener("mouseup", finishMove);
canvas.addEventListener("click", player1);

var humanPlayer = function() {
  this.count = 0;
  this.acceptMove = function() {
    this.count += 1
  };
};

var computerPlayer = function() {
  this.count = 0;
  this.acceptMove = function() {
    this.computerMove();
  };
  this.computerMove = function() {
    this.count += 1
  };
};


  
  initGameLoop();