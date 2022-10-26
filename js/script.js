//variables and start button EventListener

const mainTheme = new Audio();
mainTheme.src = "./audio/undersea_palace.mp3";

/*This function doesn't work due to DOM exception

window.onload = (event) => {
  mainTheme.play();
};
*/

const clickBtnSound = new Audio();
clickBtnSound.src = "./audio/button-sound.mp3";

const gameOverSound = new Audio();
gameOverSound.src = "./audio/game-over-sound.mp3";

const winnerSound = new Audio();
winnerSound.src = "./audio/victory-ff7.mp3";

const skiTurnSound = new Audio();
skiTurnSound.src = "./audio/ski-turn-sound.mp3";

const startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", goPlay);

const tryAgainBtn = document.querySelector("#restart-btn");

const winnerBtn = document.querySelector("#winnerBtn");

let timerId = null;

setInterval(() => {
  changeColor(startBtn);
  changeColor(tryAgainBtn);
  changeColor(winnerBtn);
}, 500);

//adding timer

const timerClock = document.getElementById("timer");

function setTimer() {
  let startMinutes = 3;
  let time = startMinutes * 60;
  timerClock.textContent = `03:00 remaining before the finish line!`;
  timerId = setInterval(() => {
    let minutes = parseInt(time / 60, 10);
    let seconds = parseInt(time % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerClock.textContent = `${minutes}:${seconds} remaining before the finish line!`;
    time = time <= 0 ? 0 : time - 1;
  }, 1000);
}

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

function displayButton(button) {
  button.classList.remove("hidden");
}

function goPlay() {
  const game = new Game();
  game.startGame();
  clickBtnSound.play();
  mainTheme.play();
  deleteButton(startBtn);
  deleteButton(tryAgainBtn);
  deleteButton(winnerBtn);
  displayButton(timerClock);
  winnerSound.pause();
  winnerSound.currentTime = 0;
  setTimer();
}

//classes

class Skier {
  constructor(canvas, ctx) {
    this.image = new Image();
    this.image.src = "./images/skier.png";
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
    return this.x + parseInt(this.width * 0.3);
  }
  rightEdge() {
    return this.x + this.width - parseInt(this.width * 0.3);
  }
  topEdge() {
    return this.y;
  }

  moveLeft() {
    this.image.src = "./images/turn-left.png";
    skiTurnSound.play();
    if (this.x <= 45) {
      return;
    }
    this.x -= 7;
  }
  moveRight() {
    this.image.src = "./images/turn-right.png";
    skiTurnSound.play();
    if (this.x >= this.canvas.width - this.width - 45) {
      return;
    }
    this.x += 7;
  }

  display() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Slope {
  constructor(canvas, ctx) {
    this.image = new Image();
    this.image.src = "./images/snow.png";
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
    mainTheme.pause();
    mainTheme.currentTime = 0;
    gameOverSound.play();
    clearInterval(timerId);
    deleteButton(timerClock);
    displayButton(tryAgainBtn);
    tryAgainBtn.addEventListener("click", goPlay);
  }

  winGame() {
    clearInterval(this.intervalId);
    mainTheme.pause();
    mainTheme.currentTime = 0;
    winnerSound.play();
    clearInterval(timerId);
    deleteButton(timerClock);
    displayButton(winnerBtn);
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
    document.addEventListener("keyup", (event) => {
      this.skier.image.src = "./images/skier.png";
    });
  }
}

class Gate {
  constructor(canvas, ctx, position) {
    this.image = new Image();
    this.image.src = "./images/gate.png";
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = 70;
    this.height = 40;
    this.x = 200;
    this.y = this.canvas.height;
    this.position = position;
    this.changePosition();
  }

  changePosition() {
    if (this.position === "left") {
      this.x = 90;
    } else if (this.position === "center") {
      this.x = 220;
    } else {
      this.x = 340;
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

class FinishLine {
  constructor(canvas, ctx) {
    this.image = new Image();
    this.image.src = "./images/finish-line.png";
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
    this.y -= 2.5;
  }
}
