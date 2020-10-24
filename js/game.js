
//get DPI
let dpi = window.devicePixelRatio;


let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let rightPressed = false;
let leftPressed = false;


//create a style object that returns width and height
let style = 
{
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


var modal = document.getElementById("myModal");

var span = document.getElementsByClassName("close")[0];

function Rotate()
{
  if("orientation" in screen) {
    if(document.documentElement.requestFullscreen) 
    {
      document.documentElement.requestFullscreen();
    } 
    else if( document.documentElement.mozRequestFullscreen ) 
    {
      document.documentElement.mozRequestFullscreen();
    } 
    else if( document.documentElement.webkitRequestFullscreen ) {
      document.documentElement.webkitRequestFullscreen();
    } 
    else {
      document.documentElement.msRequestFullscreen();
    } 

    screen.orientation.lock('landscape-primary');
  }
  
}






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
  this.paddleY = game_screen.height- this.height -20;
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
  this.y = canvas.height-150;
  this.dx = dx;
  this.dy = dy;
}

function Game( score, lives) {
	this.score = score;
  this.lives = lives;
  this.bricks_matrix = [];
  this.paused = false;
}

const game_screen = new Game_screen( canvas.height, canvas.width );
const paddle = new Paddle(30, 230);
const brick = new Brick( game_screen.height/15, game_screen.width/7, 20);
const wall = new Wall(3, 6, 80, 100);
const ball = new Ball(25, 10, -10);
const game = new Game(0, 3);


let words = [
  ["Apple", "Pomme"], ["Girl", "Fille"], ["Boy", "Garçon"], ["Day", "Jour"], ["Cat", "Chat"], ["Hello", "Salut"], ["Bye", "Au reviour"], ["Beautiful", "Belle"], ["Thank You", "Merci"], 
  ["City", "Ville"], ["Earth", "Terre"], ["Sea", "Mer"], ["Pink", "Rose"], ["Black", "Noir"], ["Red", "Rouge"], ["Easy", "Facile"], ["Onion", "Oignon"], ["Vegetables", "Legumes"],
  ["Carrot", "Carrote"], ["Water", "Eau"], ["Kitchen", "Cuisine"], ["House", "Maison"], ["Shirt", "Chemise"], ["Coat", "Manteau"], ["Skirt", "Jupe"], ["Dress", "Robe"], ["Winter", "Hiver"],
  ["Summer", "Ete"], ["Sky", "Ciel"]
]

const wordsMap = [{
  "Apple": {
    "French": "Pomee",
    "Russian": "russian_apple",
    "Spanish": "spanish_apple" 
  }
}, {
  "girl": {
    "French": "fille",
    "Russian": "rus_girl",
    "Spanish": "sp_girl" 
  }
}]




function Sound(src) {

  this.sound = new Audio();
  this.sound.src= src;
  
  this.playSound = (event) => {
      var playedPromise = this.sound.play();
      if (playedPromise) {
          playedPromise.catch((e) => {
              console.log(e)
              if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') { 
                    console.log(e.name);
                }
          })
      }
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

  if( relativeX<paddle.width )
    relativeX = paddle.width/2;
  else if( relativeX > game_screen.width - paddle.width)
    relativeX = game_screen.width - paddle.width/2;

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
            hittingBrick.playSound();
            --b.status;
            game.score++;

            if(game.score == 2*wall.columnCount*wall.rowCount) {
              won.playSound();

              setTimeout( () => {
                game.paused = true;
                document.getElementById("won").style.display = "flex";
              }, 500);

              setTimeout( function() {
                restartGame()
              }, 2500);

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
          ctx.fill();

          ctx.font = "35px Arial";
          ctx.fillStyle = "white";
          ctx.fillText(  cur_brick.word1, brickX + brick.width/4, brickY + 35);
        }
        else if ( cur_brick.status == 1)
        {
          ctx.fillStyle = "#901c57c7";    // maroon
          ctx.fill();

          ctx.font = "35px Arial";
          ctx.fillStyle = "white";
          ctx.fillText(  cur_brick.word2, brickX + brick.width/4, brickY + 35);
        }

        ctx.closePath();
      }
    }
  }
}

let star_image = new Image();
star_image.src = 'images/star6.png';

function drawScore() {
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage( star_image, 15, 15);
  ctx.font = "40px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(game.score, 90, 60);
}


let ball_lives_image = new Image();
ball_lives_image.src = 'images/ball.png';


function drawLives() {
  ctx.imageSmoothingEnabled = false;

  for(let i=0; i<game.lives; i++)
    ctx.drawImage( ball_lives_image, game_screen.width-100 - 50*i, 10);
}


async function wait() {
  await setTimeout(() => {}, 1000);
}

function restartGame() {
  game.paused = false;
  document.location.reload();
  /* init(); */
}



function draw() {
  ctx.clearRect(0, 0, game_screen.width , game_screen.height);
  
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
      hittingPaddle.playSound();
  }
  else if( ball.y + ball.dy > game_screen.height-ball.radius) {            // Bottom wall collision
      fallen.playSound();
      /* await draw(); */
      game.lives--;


      wall.topOffset+= 20;

      if(!game.lives) {
        navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

        if( navigator.vibrate) {
          window.navigator.vibrate(400);
          console.log("vib");
        } else {
          console.log("no");
        }

        game.paused = true;
        document.getElementById("gameOver").style.display = "flex";
        
        setTimeout( function() {
          restartGame()
        }, 2000);
        
      }
      else {

        if( navigator.vibrate) {
          window.navigator.vibrate(300);
          console.log("vib");
        } else {
          console.log("no");
        }

        ball.x = paddle.paddleX + paddle.width/2;
        ball.y = paddle.paddleY - 60;
      }
  }

  if(rightPressed && paddle.paddleX < game_screen.width -paddle.width) {
    paddle.paddleX += 30;
  }
  else if(leftPressed && paddle.paddleX > 0) {
    paddle.paddleX -= 30;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  if( game.paused == false)
  {
    requestAnimationFrame(draw);
  }
}



function startGame() {

  Rotate();

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


function init()
{
  document.getElementById("startGameDiv").style.display = "none";
  startGame();
}

