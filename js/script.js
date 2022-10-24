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
  if (startButton) {
    startButton.style.backgroundColor = setRandomColor();
  }
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
    this.y = this.canvas.height - 670;
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

  display() {
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
    this.y -= 2.5;
    this.y %= this.canvas.height;
  }
  display() {
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
    this.gates = [];
    this.gatePosition = ["left", "center", "right"];
  }
  init() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.createEventListeners();
  }
  startGame() {
    this.intervalId = setInterval(() => {
      this.frames++;
      if (this.frames % 100 === 0) {
        this.gates.push(
          new Gate(
            this.canvas,
            this.ctx,
            this.gatePosition[
              Math.floor(Math.random() * this.gatePosition.length)
            ]
          )
        );
      }
      this.slope.display();
      this.slope.move();
      this.skier.display();
      for (const gate of this.gates) {
        gate.display();
        if (this.checkCollision(gate, this.skier)) {
          this.stopGame();
        }
        gate.move();
      }
    }, 1000 / 60);
  }

  stopGame() {
    clearInterval(this.intervalId);
  }

  checkCollision(gate, skier) {
    const isInX =
      gate.rightEdge() >= skier.leftEdge() &&
      gate.leftEdge() <= skier.rightEdge();
    const isInY =
      gate.topEdge() <= skier.bottomEdge() &&
      gate.bottomEdge() >= skier.topEdge();
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

class Gate {
  constructor(canvas, ctx, position) {
    this.image = new Image();
    this.image.src = "./../images/gate.png";
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = 80;
    this.height = 45;
    this.x = 200;
    this.y = this.canvas.height;
    this.position = position;
    this.changePosition();
  }

  changePosition() {
    if (this.position === "left") {
      this.x = 70;
    } else if (this.position === "center") {
      this.x = 220;
    } else {
      this.x = 350;
    }
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

  display() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  move() {
    this.y -= 2.5;
  }
}
