const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const restartButton = document.querySelector('.btn-restart');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');

const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');

const blockHeight = 50;
const blockWidth = 50;

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00-00`

const cols = Math.floor(board.clientWidth/blockWidth);
const rows = Math.floor(board.clientHeight/blockHeight);

const blocks = [];   
let snake = [{x:1, y:3}];
let speed = 300;

let intervalId = null;
let timerIntervalId = null;
let direction = 'left';
let food = {x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};


for(let row =0; row<rows; row++){
    for(let col=0; col<cols; col++){
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
        // block.innerText = `${row}-${col}`
    }
}

function render(){
    let head = null;
    blocks[`${food.x}-${food.y}`].classList.add("food");

    if(direction==="left"){
        head = {
            x : snake[0].x,
            y : snake[0].y -1
        }
    }
    else if(direction==="right"){
        head = {
            x : snake[0].x,
            y : snake[0].y +1
        }
    }
    else if(direction==="down"){
        head = {
            x : snake[0].x +1,
            y : snake[0].y
        }
    }
    else if(direction==="up"){
        head = {
            x : snake[0].x -1,
            y : snake[0].y
        }
    }

    //snake to wall collision logic
    if(head.x <0 || head.x >=rows || head.y<0 || head.y>=cols){
        clearInterval(intervalId);
        modal.style.display =  "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        return;
    }

    //food consume logic
    if(head.x === food.x && head.y === food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {x : Math.floor(Math.random()*rows), y : Math.floor(Math.random()*cols)};
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head);

        score+=5;
        scoreElement.innerText = score

        if(score>highScore){
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());
            highScoreElement.innerText = highScore;
        }

        if(score > 100)
            speed-=50;
        if(score>500)
            speed-=50;
        if(speed>1000)
            speed-=50;
    }

    snake.forEach(segment =>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })

    snake.unshift(head);
    snake.pop();

    snake.forEach(segment =>{
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    })
}


startButton.addEventListener("click", ()=> {
    modal.style.display = 'none';
    highScoreElement.innerText = highScore;
    intervalId = setInterval(()=>{
        render()
    },speed); 
    timerIntervalId = setInterval(()=> {
        let [min,sec] = time.split("-").map(Number);
        if(sec==59){
            min+=1;
            sec=0;
        }
        else{
            sec+=1;
        }
        time = `${min}-${sec}`;
        timeElement.innerText = time;
    },1000)
})

restartButton.addEventListener("click", restartGame);

function restartGame() {
    score=0;
    time=`00-00`
    scoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.innerText = highScore;

    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(segment =>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })

    modal.style.display = "none";
    snake = [{x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)}];
    food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};
    intervalId = setInterval(() => {render()}, speed);
}



addEventListener("keydown", (e) => {
    if(e.key === "ArrowUp" || e.key === "w" || e.key === "W")
        direction = "up";
    else if(e.key === "ArrowDown" || e.key === "s" || e.key === "S")
        direction = "down";
    else if(e.key === "ArrowLeft" || e.key === "a" || e.key === "A")
        direction = "left";
    else if(e.key === "ArrowRight" || e.key === "d" || e.key === "D")
        direction = "right";
})