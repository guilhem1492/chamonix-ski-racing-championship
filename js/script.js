//variables and start button EventListener

const audio = new Audio();
audio.src = "./../audio/undersea_palace.mp3";

/*This one doesn't work due to DOM exception
window.onload = (event) => {
  audio.play();
};
*/

const startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", goPlay);

const tryAgainBtn = document.querySelector("#restart-btn");

const winnerBtn = document.querySelector("#winnerBtn");

setInterval(() => {
  changeColor(startBtn);
  changeColor(tryAgainBtn);
  changeColor(winnerBtn);
}, 500);

//reusable functions

function setRandomColor() {
  return "#" + Math.floor(Math.random() * 16789215).toString(16);
}

function changeColor(button) {
  button.style.backgroundColor = setRandomColor();
}

function deleteButton(button) {
  button.classList.add("hidden");
}

function goPlay() {
  const game = new Game();
  game.startGame();
  audio.play();
  deleteButton(startBtn);
  deleteButton(tryAgainBtn);
  deleteButton(winnerBtn);
}

//classes

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
    return this.x + parseInt(this.width * 0.2);
  }
  rightEdge() {
    return this.x + this.width - parseInt(this.width * 0.2);
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
    this.y -= 2;
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
    this.finishLine = null;
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
      if (this.isSkierInFinish()) {
        this.winGame();
      }
      this.frames++;
      if (!this.finishLine && this.frames % 100 === 0) {
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
      if (this.frames === 11050) {
        this.finishLine = new FinishLine(this.canvas, this.ctx);
        console.log(this.finishLine);
      }
      this.slope.display();
      this.slope.move();
      this.skier.display();
      for (const gate of this.gates) {
        gate.display();
        if (!this.isSkierInTrack(gate, this.skier)) {
          this.stopGame();
        }
        gate.move();
      }
      if (this.finishLine) {
        this.finishLine.display();
        this.finishLine.move();
      }
    }, 1000 / 60);
  }

  stopGame() {
    clearInterval(this.intervalId);
    audio.pause();
    audio.currentTime = 0;
    tryAgainBtn.classList.remove("hidden");
    tryAgainBtn.addEventListener("click", goPlay);
  }

  winGame() {
    clearInterval(this.intervalId);
    audio.pause();
    audio.currentTime = 0;
    winnerBtn.classList.remove("hidden");
    winnerBtn.addEventListener("click", goPlay);
  }

  isSkierInTrack(gate, skier) {
    if (skier.y !== gate.y) {
      return true;
    }
    const isInX =
      gate.rightEdge() >= skier.rightEdge() &&
      gate.leftEdge() <= skier.leftEdge();
    const isInY =
      gate.topEdge() <= skier.bottomEdge() &&
      gate.bottomEdge() >= skier.topEdge();
    return isInX && isInY;
  }

  isSkierInFinish() {
    if (!this.finishLine) {
      return false;
    }
    return this.skier.y > this.finishLine.y;
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
      this.x = 100;
    } else if (this.position === "center") {
      this.x = 220;
    } else {
      this.x = 320;
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
    this.y -= 2;
  }
}

class FinishLine {
  constructor(canvas, ctx) {
    this.image = new Image();
    this.image.src = "./../images/finish-line.png";
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = 400;
    this.height = 40;
    this.x = 50;
    this.y = this.canvas.height;
  }

  display() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  move() {
    this.y -= 2;
  }
}
