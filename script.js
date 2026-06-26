const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const restartButton = document.querySelector(".btn-restart");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockHeight = 50;
const blockWidth = 50;

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00-00`;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

const blocks = [];
let snake = [{ x: 1, y: 3 }];
let speed = 300;

let intervalId = null;
let timerIntervalId = null;
let direction = "right";

function foodCoordinates() {
  let xCord, yCord;
  do {
    xCord = Math.floor(Math.random() * rows);
    yCord = Math.floor(Math.random() * cols);
  } while (snake.some((segment) => segment.x === xCord && segment.y === yCord));
  return {
    x: xCord,
    y: yCord,
  };
}

let food = foodCoordinates();

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
    // block.innerText = `${row}-${col}`
  }
}

const checkBodyCollision = () => {
  const head = snake[0];
  let collided = false;
  snake.forEach((body, idx) => {
    if (idx != 0) {
      if (body.x == head.x && body.y == head.y) {
        //Found Collision
        clearInterval(intervalId);
        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        collided = true;
        return;
      }
    }
  });
  return collided;
};

function render() {
  let head = null;
  blocks[`${food.x}-${food.y}`].classList.add("food");

  if (direction === "left") {
    head = {
      x: snake[0].x,
      y: snake[0].y - 1,
    };
  } else if (direction === "right") {
    head = {
      x: snake[0].x,
      y: snake[0].y + 1,
    };
  } else if (direction === "down") {
    head = {
      x: snake[0].x + 1,
      y: snake[0].y,
    };
  } else if (direction === "up") {
    head = {
      x: snake[0].x - 1,
      y: snake[0].y,
    };
  }

  //snake to wall collision logic
  // Add snake to snake collision logic
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    return;
  }
  if (checkBodyCollision()) {
    return;
  }

  //food consume logic

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    blocks[`${segment.x}-${segment.y}`].classList.remove("head");
  });

  // Food consume logic
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = foodCoordinates();
    blocks[`${food.x}-${food.y}`].classList.add("food");

    snake.unshift(head); // Grow (don't remove tail)

    score += 5;
    scoreElement.innerText = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore.toString());
      highScoreElement.innerText = highScore;
    }

    if (score > 100) speed -= 50;
    if (score > 500) speed -= 50;
    if (speed > 1000) speed -= 50;
  } else {
    // Normal movement
    snake.unshift(head);
    snake.pop();
  }

  // Draw updated snake
  snake.forEach((segment, idx) => {
    if (idx == 0) {
      blocks[`${segment.x}-${segment.y}`].classList.add("head");
    } else {
      blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    }
  });
}

startButton.addEventListener("click", () => {
  modal.style.display = "none";
  highScoreElement.innerText = highScore;
  intervalId = setInterval(() => {
    render();
  }, speed);
  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);
    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }
    time = `${min}-${sec}`;
    timeElement.innerText = time;
  }, 1000);
});

restartButton.addEventListener("click", restartGame);

function restartGame() {
  clearInterval(intervalId);
  clearInterval(timerIntervalId);
  score = 0;
  time = `00-00`;
  speed = 100;

  scoreElement.innerText = score;
  timeElement.innerText = time;
  highScoreElement.innerText = highScore;

  blocks[`${food.x}-${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    blocks[`${segment.x}-${segment.y}`].classList.remove("head");
  });

  modal.style.display = "none";
  snake = [
    {
      x: 1,
      y: 3,
    },
  ];
  direction = "right";

  food = foodCoordinates();
  intervalId = setInterval(render, speed);
  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);
    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }
    time = `${min}-${sec}`;
    timeElement.innerText = time;
  }, 1000);
}

addEventListener("keydown", (e) => {
  if (
    (e.key === "ArrowUp" || e.key === "w" || e.key === "W") &&
    direction != "down"
  )
    direction = "up";
  else if (
    (e.key === "ArrowDown" || e.key === "s" || e.key === "S") &&
    direction != "up"
  )
    direction = "down";
  else if (
    (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") &&
    direction != "right"
  )
    direction = "left";
  else if (
    (e.key === "ArrowRight" || e.key === "d" || e.key === "D") &&
    direction != "left"
  )
    direction = "right";
});
