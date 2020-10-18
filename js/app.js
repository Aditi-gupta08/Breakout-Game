var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 4;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 1;
var dy = -1;
var paddleHeight = 5;
var paddleWidth = 40;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 8;
var brickColumnCount = 3;
var brickWidth = 28;
var brickHeight = 8;
var brickPadding = 7;
var brickOffsetTop = 15;
var brickOffsetLeft = 10;
var score = 0;
var lives = 3;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 2 };
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}
function collisionDetection() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status > 0) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          --b.status;
          score++;
          if(score == 2*brickRowCount*brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#6f25e463";          //purple
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  /* ctx.fillStyle = "#0095DD"; */
  ctx.fillStyle = "#6f25e463";             //purple
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status > 0) {
        var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);

        if(bricks[c][r].status == 2)
            ctx.fillStyle = "#ce0b64";      // pink color
            /* ctx.fillStyle = "#0095DD"; */    // sky blue
        else if (bricks[c][r].status == 1)
            ctx.fillStyle = "#901c57c7";    // maroon

        ctx.fill();
        ctx.closePath();
      }
    }
  }
}


function drawScore() {
  ctx.font = "9px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: "+score, 6, 10);
}


function drawLives() {
  ctx.font = "9px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Lives: "+lives, canvas.width-65, 10);
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {         // left nd right wall collision
    dx = -dx;
  }
  if(y + dy < ballRadius) {                                             // top wall collision
    dy = -dy;
  }
  else if( x+ballRadius > paddleX && x-ballRadius < paddleX + paddleWidth && y + dy > canvas.height-ballRadius -paddleHeight) {
      dy = -dy;
  }
  else if(y + dy > canvas.height-ballRadius) {            // Bottom wall collision
      lives--;

      if(!lives) {
        alert("GAME OVER");
        document.location.reload();
      }
      else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 1.25;
        dy = -1.25;
        paddleX = (canvas.width-paddleWidth)/2;
      }
  }

  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();