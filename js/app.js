
//get DPI
let dpi = window.devicePixelRatio;

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let rightPressed = false;
let leftPressed = false;


function Box(height, width){
  this.height = height;
  this.width = width;
}


function Game_screen(height, width) {
	Box.call(this, height, width);
}

Game_screen.prototype = Object.create(Box.prototype);
Game_screen.prototype.constructor = Box;



function Paddle( height, width ) {
  Box.call(this, height, width);
  this.paddleX = (game_screen.width  - this.width)/2;
  this.paddleY = game_screen.height- this.height ;
} 

Paddle.prototype = Object.create(Box.prototype);
Paddle.prototype.constructor = Box;



function Brick(height, width, padding) {
  Box.call(this, height, width);
  this.padding = padding;
}

Brick.prototype = Object.create(Box.prototype);
Brick.prototype.constructor = Box;



function Wall(r, c, leftOffset, topOffset){
  this.rowCount = r;
  this.columnCount = c;
  this.leftOffset = leftOffset;
  this.topOffset = topOffset;
}

function Ball( radius, dx, dy) {
	this.radius = radius;
  this.x = canvas.width/2;
  this.y = canvas.height-30;
  this.dx = dx;
  this.dy = dy;
}

function Game( score, lives) {
	this.score = score;
  this.lives = lives;
  this.bricks_matrix = [];
}


var words = [
  ["Apple", "Pomme"], ["Girl", "Fille"], ["Boy", "Garçon"], ["Day", "Jour"], ["Cat", "Chat"], ["Hello", "Salut"], ["Bye", "Au reviour"], ["Beautiful", "Belle"], ["Thank You", "Merci"], 
  ["City", "Ville"], ["Earth", "Terre"], ["Sea", "Mer"], ["Pink", "Rose"], ["Black", "Noir"], ["Red", "Rouge"], ["Easy", "Facile"], ["Onion", "Oignon"], ["Vegetables", "Legumes"],
  ["Carrot", "Carrote"], ["Water", "Eau"], ["Kitchen", "Cuisine"], ["House", "Maison"], ["Shirt", "Chemise"], ["Coat", "Manteau"], ["Skirt", "Jupe"], ["Dress", "Robe"], ["Winter", "Hiver"],
  ["Summer", "Ete"], ["Sky", "Ciel"]
]



/*  orig ->
const game_screen = new Game_screen( canvas.height, canvas.width );
const paddle = new Paddle(5, 40);
const brick = new Brick(8, 28, 7);
const wall = new Wall(3, 8, 10, 15);
const ball = new Ball(4, 1, -1);
const game = new Game(0, 3); */


const game_screen = new Game_screen( canvas.height, canvas.width );
const paddle = new Paddle(5, 40);
const brick = new Brick(10, 50, 7);
const wall = new Wall(3, 5, 10, 15);
const ball = new Ball(4, 1, -1);
const game = new Game(0, 3);

function fix_dpi() {
  //create a style object that returns width and height
    let style = {
      height() {
        return +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
      },
      width() {
        return +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
      }
    }
  //set the correct attributes for a crystal clear image!
    canvas.setAttribute('width', style.width() * dpi);
    canvas.setAttribute('height', style.height() * dpi);
  }


function Sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

let hittingBrick = new Sound("sounds/hitting-brick.mp3");
let hittingPaddle = new Sound("sounds/hitting-paddle.mp3");
let fallen = new Sound("sounds/fallen.mp3");
let won = new Sound("sounds/won.mp3");


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
  if(relativeX > 0 && relativeX < game_screen.width ) {
    paddle.paddleX = relativeX - paddle.width/2;
  }
}
function collisionDetection() {
  for(var c=0; c<wall.rowCount; c++) {
    for(var r=0; r<wall.columnCount; r++) {

      var b = game.bricks_matrix[c][r];
      if(b.status > 0) 
      {
        if( (ball.x + ball.radius) > b.x && ball.x - ball.radius < b.x+brick.width)
        {
          if( (ball.y + ball.radius) > b.y && (ball.y - ball.radius) < b.y+brick.height) 
          {
            ball.dy = -ball.dy;
            hittingBrick.play();
            --b.status;
            game.score++;

            if(game.score == 2*wall.columnCount*wall.rowCount) {
              won.play();

              setTimeout( () => {
                alert("YOU WIN, CONGRATS!");
                document.location.reload();
              }, 1000);

            }
          }
        }
         
      }

    }
  }
}


function randomWordGenerator() {
  let randInd = Math.floor((Math.random() * words.length));
  return words[randInd];
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
  ctx.fillStyle = "#6f25e463";          //purple
  ctx.fillStyle = "#1304f0";            // blue
  ctx.fill();
  ctx.closePath();
}

/* 
color-accesbility
flatuicolors */

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.paddleX, paddle.paddleY, paddle.width, paddle.height);
  /* ctx.fillStyle = "#0095DD"; */
  ctx.fillStyle = "#6f25e463";             //purple
  ctx.fillStyle = "#0be881";  // green
  ctx.fillStyle = "#1304f0";              // blue
  ctx.fill();
  ctx.closePath();
}


/* function drawPowerUp() {
  ctx.beginPath();
  ctx.rect(30, 30, 5, 8);
  ctx.fillStyle = "#6f25e463";             //purple
  ctx.fill();
  ctx.closePath();
} */



function drawBricks() {
  for(var c=0; c<wall.rowCount; c++) {
    for(var r=0; r<wall.columnCount; r++) {

      let cur_brick = game.bricks_matrix[c][r];
      if( cur_brick.status > 0) {
        var brickX = (r*(brick.width+brick.padding))+wall.leftOffset;
        var brickY = (c*(brick.height+brick.padding))+wall.topOffset;
         cur_brick.x = brickX;
         cur_brick.y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brick.width, brick.height);


        

        if( cur_brick.status == 2)
        {
          ctx.fillStyle = "#eb3b5a";  // pink
          /* ctx.fillStyle = "#0be881";  // green
          ctx.fillStyle = "#1304f0";              // blue */
          /* "#ce0b64";      // pink color */
          /* #fc427b */
          /* eb3b5a*/
          /* ctx.fillStyle = "#E60000"; */
          ctx.fill();

          ctx.font = "All-caps 6px Arial";
          ctx.fillStyle = "white";
          ctx.fillText(  cur_brick.word1, brickX + brick.width/5, brickY + 7);
        }
        else if ( cur_brick.status == 1)
        {
          ctx.fillStyle = "#901c57c7";    // maroon
          ctx.fill();

          ctx.font = "All-caps 6px Arial";
          ctx.fillStyle = "white";
          ctx.fillText(  cur_brick.word2, brickX + brick.width/4, brickY + 7);
        }

        /* ctx.rect( brickX + (brick.width)/3, brickY + (brick.height)/3, (brick.width)/3, (brick.height)/3);
        ctx.fillStyle = "#6f25e463"; */
        

        /* ctx.fill(); */
        ctx.closePath();
      }
    }
  }
}


function drawScore() {
  ctx.font = "8px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: "+ game.score, 6, 10);
}


function drawLives() {
  ctx.font = "8px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Lives: "+ game.lives, game_screen.width -65, 10);
}


async function wait() {
  await setTimeout(() => {}, 1000);
}


let base_image = new Image();
base_image.src = 'images/star.jpeg';


async function draw() {
  ctx.clearRect(0, 0, game_screen.width , game_screen.height);
  /* ctx.drawImage(base_image, 10, 10); */
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if(ball.x + ball.dx > game_screen.width -ball.radius || ball.x + ball.dx < ball.radius) {         // left nd right wall collision
    ball.dx = -ball.dx;
  }
  if(ball.y + ball.dy < ball.radius) {                                             // top wall collision
    ball.dy = -ball.dy;
  }
  else if( ball.x+ball.radius > paddle.paddleX && ball.x-ball.radius <paddle.paddleX + paddle.width && ball.y + ball.dy > game_screen.height-ball.radius - paddle.height) {
      ball.dy = -ball.dy;
      hittingPaddle.play();
  }
  else if( ball.y + ball.dy > game_screen.height-ball.radius) {            // Bottom wall collision
      fallen.play();
      /* await draw(); */
      game.lives--;

      wall.topOffset+= 20;

      if(!game.lives) {
        alert("GAME OVER");
        document.location.reload(); 
      }
      else {
        /* ball.x = game_screen.width /2;
        ball.y = game_screen.height-30;
        ball.dx = 1.25;
        ball.dy = -1.25;
        paddle.paddleX = (game_screen.width -paddle.width)/2; */

        ball.x = paddle.paddleX + paddle.width/2;
        ball.y = paddle.paddleY - 10;
        ball.dx = 1.25;
        ball.dy = -1.25;
      }
  }

  if(rightPressed && paddle.paddleX < game_screen.width -paddle.width) {
    paddle.paddleX += 7;
  }
  else if(leftPressed && paddle.paddleX > 0) {
    paddle.paddleX -= 7;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;
  requestAnimationFrame(draw);
}



function init() {
  /* fix_dpi(); */
  for(var c=0; c<wall.rowCount; c++) {
    game.bricks_matrix[c] = [];
    for(var r=0; r<wall.columnCount; r++) {

      let randWord = randomWordGenerator()

      game.bricks_matrix[c][r] = 
      { 
          x: 0, 
          y: 0, 
          status: 2,
          word1: randWord[0],
          word2: randWord[1]
      };
    }
  }
  
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);

  draw();
}

init();