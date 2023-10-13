function Shape(x, y, velX, velY) {

  this.x = x;
  this.y = y;

  this.velX = velX;
  this.velY = velY;
}

function Ball(x, y, velX, velY, color, size, exists = true) {
  Shape.call(this, x, y, velX, velY)
  this.color = color;
  this.size = size;
  this.exists = exists
}

function EvilCircle(x = 200, y = 200, velX = 2, velY = 2, color = 'rgb(255, 255, 255)', size = 20) {
  Shape.call(this, x, y, velX, velY)
  this.color = color;
  this.size = size;
}

Ball.prototype = Object.create(Shape.prototype)
Object.defineProperty(Ball.prototype, 'constructor', {
  value: Ball,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to hide previous frame (play with alpha to change fade effect)

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  evil.draw()

  requestAnimationFrame(loop);
}

function BallCounter() {
  count = balls.length
  for (i = 0; i < balls.length; i++) {
    if (balls[i].exists === false) {
      count -= 1
    }
  }
  if (document.querySelector('h2') === null) {
    bodyElement = document.querySelector('body')
    counterElement = document.createElement('h2')
    counterElement.textContent = `Balls left: ${count}`
    bodyElement.appendChild(counterElement)
  } else {
    counterElement = document.querySelector('h2')
    counterElement.textContent = `Balls left: ${count}`
  }
}

// Function for the Event Listener

function UserListen(e) {
  const stepSize = 10
  switch (e.keyCode) {
    case 87: // W
      changeX = 0
      changeY = -stepSize
      break;
    case 38: // up arrow
      changeX = 0
      changeY = -stepSize
      break;
    case 65: // A left
      changeX = -stepSize
      changeY = 0
      break;
    case 37: // left arrow
      changeX = -stepSize
      changeY = 0
      break;
    case 83: // S down
      changeX = 0
      changeY = stepSize
      break;
    case 40: // down arrow
      changeX = 0
      changeY = stepSize
      break;
    case 68: // D right
      changeX = stepSize
      changeY = 0
      break;
    case 39: // right arrow
      changeX = stepSize
      changeY = 0
      break;
    default:
      changeX = 0
      changeY = 0
  }
  evil.update(changeX, changeY)
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// draw function

Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

EvilCircle.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

// function that check if the ball will hit the edge of the screen

Ball.prototype.update = function () {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}

// create balls you can change the limit in the while statement to add/remove balls

let balls = [];
let ballsDead = [];

while (balls.length < 25) {
  let size = random(10, 20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
    size
  );

  balls.push(ball);
}

let evil = new EvilCircle()

// new function that detects collision

Ball.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    if (this.exists === true && balls[j].exists === true) {
      if (!(this === balls[j])) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
        }
      }
    }

    const edx = this.x - evil.x;
    const edy = this.y - evil.y;
    const edistance = Math.sqrt(edx * edx + edy * edy);

    if (edistance < this.size + evil.size) {
      this.exists = false
      this.color = 'rgb(0,0,0)'
      BallCounter()
    }


  }
}

loop();


document.addEventListener('keydown', UserListen)

// update method for the EvilCircle object

EvilCircle.prototype.update = function (changeX, changeY) {
  this.x += changeX;
  this.y += changeY;
}
