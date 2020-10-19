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
var brickRowCount= 8;
var brickColumnCount = 3;
var brickWidth = 28;
var brickHeight = 8;
var brickPadding = 7;
var brickOffsetTop = 15;
var brickOffsetLeft = 10;
var score = 0;
var lives = 3;

function Box(height, width){
    this.height = height;
    this.width = width;
  }
  
  
  
  function Screen(height, width) {
      Box.call(this, height, width);
  }
  
  Screen.prototype = Object.create(Box.prototype);
  Screen.prototype.constructor = Box;
  
  const screen = new Screen(10, 10);
  
  
  
  
  function Paddle(height, width, paddleX, paddleY) {
    Box.call(this, height, width);
    this.paddleX = paddleX;
    this.paddleY = paddleY;
  } 
  
  Paddle.prototype = Object.create(Box.prototype);
  Paddle.prototype.constructor = Box;
  
  const paddle = new Paddle(4, 8, 5, 8);
  
  
  
  
  function Bricks(height, width, padding) {
    Box.call(this, height, width);
    this.padding = padding;
  }
  
  Bricks.prototype = Object.create(Box.prototype);
  Bricks.prototype.constructor = Box;
  
  const bricks = new Bricks(3, 6, 4);
  
  
  
  
  function Wall(r, c, leftOffset, TopOffset){
    this.rowCount = r;
    this.columnCount = c;
    this.leftOffset = leftOffset;
    this.rightOffset = TopOffset;
  }
  
  const wall = new Wall(5, 10, 1, 1);
  
  
  
  function Ball( radius, x, y, dx, dy) {
	this.radius = radius;
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
}

function Game( score, lives, bricks_matrix) {
	this.score = score;
  this.lives = lives;
  this.bricks_matrix = bricks_matrix;
}

const ball = new Ball();
const game = new Game();