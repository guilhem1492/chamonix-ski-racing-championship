window.onload = () => {
  document.getElementById("start-btn").onclick = () => {
    const game = new Game();
    game.startGame();
    playSong();
    deleteButton();
  };
};

function deleteButton() {
  const startButton = document.getElementById("start-btn");
  startButton.remove();
}

function playSong() {
  const audio = new Audio();
  audio.src = "./../audio/undersea_palace.mp3";
  audio.play();
}

function setRandomColor() {
  return "#" + Math.floor(Math.random() * 16789215).toString(16);
}

function changeColor() {
  const startButton = document.getElementById("start-btn");
  startButton.style.backgroundColor = setRandomColor();
}

setInterval(changeColor, 500);

class Skier {
  constructor(canvas, ctx) {
    this.image = new Image();
    this.image.src = "./../images/skier.png";
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = 40;
    this.height = 55;
    this.x = this.canvas.width / 2 - this.width / 2;
    this.y = this.canvas.height - 680;
  }

  bottomEdge() {
    return this.y + this.height;
  }

  leftEdge() {
    return this.x;
  }
  rightEdge() {
    return this.x + this.width;
  }
  topEdge() {
    return this.y;
  }

  moveLeft() {
    if (this.x <= 45) {
      return;
    }
    this.x -= 6;
  }
  moveRight() {
    if (this.x >= this.canvas.width - this.width - 45) {
      return;
    }
    this.x += 6;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Slope {
  constructor(canvas, ctx) {
    this.image = new Image();
    this.image.src = "./../images/snow.png";
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = 0;
    this.y = 0;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  move() {
    this.y -= 2;
    this.y %= this.canvas.height;
  }
  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.ctx.drawImage(
      this.image,
      this.x,
      this.y + this.height,
      this.width,
      this.height
    );
  }
}

class Game {
  constructor() {
    this.canvas = null;
    this.intervalId = null;
    this.ctx = null;
    this.init();
    this.slope = new Slope(this.canvas, this.ctx);
    this.skier = new Skier(this.canvas, this.ctx);
    this.frames = 0;
    this.obstacles = [];
  }
  init() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.createEventListeners();
  }
  startGame() {
    this.intervalId = setInterval(() => {
      this.frames++;
      if (this.frames % 60 === 0) {
        this.obstacles.push(new Obstacle(this.canvas, this.ctx));
      }
      this.slope.draw();
      this.slope.move();
      this.skier.draw();
      for (const obstacle of this.obstacles) {
        obstacle.draw();
        if (this.checkCollision(obstacle, this.skier)) {
          this.stopGame();
        }
        obstacle.move();
      }
    }, 1000 / 60);
  }

  stopGame() {
    clearInterval(this.intervalId);
  }

  checkCollision(obstacle, skier) {
    const isInX =
      obstacle.rightEdge() >= skier.leftEdge() &&
      obstacle.leftEdge() <= skier.rightEdge();
    const isInY =
      obstacle.topEdge() <= skier.bottomEdge() &&
      obstacle.bottomEdge() >= skier.topEdge();
    return isInX && isInY;
  }

  createEventListeners() {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.skier.moveLeft();
          break;
        case "ArrowRight":
          this.skier.moveRight();
          break;
        default:
          break;
      }
    });
  }
}

/*class Obstacle {
  constructor(canvas, ctx) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = Math.floor(Math.random() * (this.canvas.width / 2)) + 20;
    this.width = Math.floor(Math.random() * (this.canvas.width / 2));
    this.height = 15;
    this.y = -20;
  }

  bottomEdge() {
    return this.y + this.height;
  }

  leftEdge() {
    return this.x;
  }
  rightEdge() {
    return this.x + this.width;
  }
  topEdge() {
    return this.y;
  }

  draw() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    this.y += 3;
  }
}*/
