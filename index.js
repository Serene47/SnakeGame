
let horizondalBoxes = 20;
let verticalBoxes = 20;

let boxSize = 30;

let context;
let snakePoints, moves, food;

const scoreOffset = 1, bestScoreKey = "snake2021BestScore";

let score = 0,bestScore = localStorage.getItem(bestScoreKey) || 0;

let startButton,startContent,gameOverContent,gameContent,restartButton,
  infoButton,infoDialog,infoCloseButton,
  exitButton,exitConfirmDialog,exitConfirmButton,exitCancelButton,exitCloseButton,
  startBest,gamePlayScore,gamePlayBest,gameOverScore,gameOverBest;

let interval;

window.addEventListener("DOMContentLoaded", () => {

  let gameCanvas = document.getElementById("game-canvas");

  context = gameCanvas.getContext("2d");

  startButton = document.getElementById("start-button");
  restartButton = document.getElementById("restart-button");

  startContent = document.getElementById("start-content");
  gameContent = document.getElementById("game-content");
  gameOverContent = document.getElementById("game-over-content");

  infoButton = document.getElementById("info-button");
  infoDialog = document.getElementById("info");
  infoCloseButton = document.getElementById("info-close");

  exitButton = document.getElementById("exit-button");
  exitConfirmDialog = document.getElementById("exit-confirmation");
  exitConfirmButton = document.getElementById("exit-confirm-button");
  exitCancelButton = document.getElementById("exit-cancel-button");
  exitCloseButton = document.getElementById("exit-close");

  startBest = document.getElementById("start-best");
  gamePlayScore = document.getElementById("game-play-score");
  gamePlayBest = document.getElementById("game-play-best");
  gameOverScore = document.getElementById("game-over-score");
  gameOverBest = document.getElementById("game-over-best");

  startBest.innerText = 
  gamePlayBest.innerText = 
  gameOverBest.innerText = bestScore;

  startButton.addEventListener("click", start);
  restartButton.addEventListener("click", start);

  infoButton.addEventListener("click", openInfo);
  infoCloseButton.addEventListener("click", closeInfo);

  exitButton.addEventListener("click", showExitConfirmation);
  exitConfirmButton.addEventListener("click", performExit );
  exitCancelButton.addEventListener("click", closeExitConfirmation);
  exitCloseButton.addEventListener("click", closeExitConfirmation)

  document.body.addEventListener("keydown",handleKeyPress);

})


const start = () => {

  startContent.classList.add("hidden");
  gameOverContent.classList.add("hidden");

  gameContent.classList.remove("hidden");

  snakePoints =[
    { h : 9 , v : 8},
    { h : 9 , v : 9},
    { h : 9 , v : 10}
  ]

  moves = []

  food = null;

  moves.push({
    dir : "up",
    start : 0,
    end : snakePoints.length -1
  })

  createFood();

  updateCanvas();

  startGameInterval();

  score = 0;

  updateCurrScore();

  //document.body.addEventListener("keydown",handleKeyPress);

}

const pause = () => {

  clearInterval(interval);

}

const resume = () => {

  startGameInterval();

}

const exit = () => {

  clearInterval(interval);

  gameContent.classList.add("hidden");
  startContent.classList.remove("hidden");

}

const startGameInterval = () => {

  clearInterval(interval)

  interval = setInterval( 
    () => {
      
      updateMoves();

      updateSnakePoints();

      updateCanvas();

    },350
  )

}

const handleKeyPress = (event) => {

  let dir;

  if([37,38,39,40].includes(event.keyCode)) {

    switch(event.keyCode) {

      case 37 :
        dir = "left";
        break;
      case 38 :
        dir = "up";
        break;
      case 39 :
        dir = "right";
        break;
      case 40 :
        dir = "down";
        break;
    }

    if( !isSame(dir) && !isOpposite(dir)) {

      moves.unshift({
        dir ,
        start : 0,
        end : snakePoints.length - 1
      })
  
      updateMoves();
  
      updateSnakePoints();
  
      updateCanvas();
  
      clearInterval(interval);
  
      startGameInterval();
      
    }

  }

}

const isSame = (dir) => {
  return [moves[0].dir] ==  dir;
}

const isOpposite = (dir) => {

  const oppoistes = {
    "up" : "down",
    "down" : "up",
    "left" : "right",
    "right" : "left"
  }


  return oppoistes[moves[0].dir] ==  dir;

}

const updateMoves = () => {
  
  moves.slice(1).forEach(
    (move) => {

      move.start++;
      move.end = move.end + 1 < snakePoints.length ?  move.end + 1 : snakePoints.length - 1;

    }
  )

  moves = moves.filter(
    move => move.start < snakePoints.length
  )

}

const getSnakeMoves = () => {

  let snakeMoves = [];

  moves.forEach(
    (move,index) => {

      if(index == 0) {
        
        for (let moveIndex = move.start; moveIndex <= move.end; moveIndex++) {
          snakeMoves.push(move.dir)
        }


      } else {

        for (let moveIndex = move.start; moveIndex <= move.end; moveIndex++) {
          snakeMoves[moveIndex] = move.dir;
        }

      }

    }
  )

  return snakeMoves;

}

const updateSnakePoints = () => {

  let snakeMoves = getSnakeMoves();
  let move, point;

  //console.log("Snake moves : " ,  ...snakeMoves);
  //console.log("Snake points before  : " ,  ...snakePoints);

  for(let index =0; index < snakePoints.length; index ++) {

    point = snakePoints[index];

    move = snakeMoves[index];

    switch(move) {

      case "up" : 
        point.v--;
        break;
      case "down" : 
        point.v++;
        break;
      case "left" : 
        point.h--;
        break;
      case "right" : 
        point.h++;
        break;

    }

  }

  if(isCrossedBoundaries() || doBiteItself()) {

    clearInterval(interval);
  
    gameOverContent.classList.remove("hidden");
    gameContent.classList.add("hidden");
    
  }

  if(doesContainFood()) {
    addSnakePoint();
  }

  //console.log("Snake points " ,  ...snakePoints);

}

const doesContainFood = () => {

  let head = snakePoints[0]

  return head.v == food.v && head.h == food.h;

}

const addSnakePoint = () => {

  let tail = snakePoints[snakePoints.length - 1];
  let lastMove = moves[moves.length - 1];

  let newPoint = { ...tail};

  switch(lastMove.dir) {

    case "up" : 
      ++newPoint.v;
      break;
    case "down" : 
      --newPoint.v;
      break;
    case "left" : 
      ++newPoint.h;
      break;
    case "right" : 
      --newPoint.h;
      break;

  }

  snakePoints.push(newPoint);

  moves[0].end ++;
  
  updateCanvas();

  clearFood();

  createFood();

  score += scoreOffset;

  updateScores();

}

const drawGrid = () => {

  context.fillStyle = "#ddd";

  for(let hdl=0;hdl<horizondalBoxes;hdl++) {

    for(let vtl=0;vtl<verticalBoxes;vtl++) {

      // fill even columns in even rows and odd columns in odd rows
      if( (hdl + vtl) % 2 == 0) 
        context.fillRect(hdl * boxSize, vtl * boxSize, boxSize, boxSize);
  
  
    }

  }


}


const drawSnake = () => {

  snakePoints.forEach(
    (point,index) => {

      context.strokeStyle = "#fff";

      if(index == 0) {

        context.fillStyle = "#077301";
        context.fillRect(point.h * boxSize,point.v * boxSize, boxSize ,boxSize );

        context.strokeRect(point.h * boxSize,point.v * boxSize, boxSize ,boxSize );

      } else {

        context.fillStyle = "#2fa828";
        context.fillRect(point.h * boxSize,point.v * boxSize, boxSize ,boxSize );

        context.strokeRect(point.h * boxSize,point.v * boxSize, boxSize ,boxSize );
      }

     
    }
  )

}

const drawFood = () => {

  context.fillStyle = "#ff0";
  context.fillRect(food.h * boxSize,food.v * boxSize , boxSize, boxSize);

}

const updateCanvas = () => {

  context.clearRect(0,0,600,600);

  drawGrid();
  drawSnake();
  drawFood();

}

const clearFood =() => {
  if(food) {
    context.clearRect(food.h * boxSize,food.v * boxSize , boxSize, boxSize)
  }
}

const createFood = () => {

  let vertical = Math.round(Math.random() * (verticalBoxes - 1));
  let horizondal = Math.round(Math.random() * (horizondalBoxes - 1));

  if(!isInsideSnake(snakePoints,vertical,horizondal)) 
    food = {  h : horizondal , v : vertical};
  else
    createFood();

}

const isInsideSnake = (snakePoints,vertical,horizondal) => {

  return snakePoints.some(
    (point) => {
      return point.v == vertical && point.h == horizondal;
    }
  )

}

const doBiteItself = () => {

  let head = snakePoints[0];

  return isInsideSnake(snakePoints.slice(1,snakePoints.length),head.v,head.h)

}

const isCrossedBoundaries = () => {

  let head = snakePoints[0];

  return head.v < 0 || head.v >= verticalBoxes 
  || head.h < 0 || head.h >= horizondalBoxes;

}

const openInfo = () => {

  infoDialog.classList.remove("hidden");

  pause();

}

const closeInfo = () => {

  infoDialog.classList.add("hidden");

  resume();

}

const showExitConfirmation = () => {

  exitConfirmDialog.classList.remove("hidden");

  pause();

}

const closeExitConfirmation = () => {

  exitConfirmDialog.classList.add("hidden");

  resume();

}

const performExit = () => {

  exitConfirmDialog.classList.add("hidden");

  exit();

}

const updateCurrScore = () => {

  gamePlayScore.innerText = gameOverScore.innerText = score;

}

const updateBestScore = () => {

  if(score > bestScore) {

    bestScore = score;

    startBest.innerText = 
    gamePlayBest.innerText = 
    gameOverBest.innerText = bestScore;

    localStorage.setItem(bestScoreKey, bestScore);

  }

}

const updateScores = () => {

  updateCurrScore();

  updateBestScore();

}
