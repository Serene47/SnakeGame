
let horizondalBoxes = 20;
let verticalBoxes = 20;

let boxSize = 30;

let context;
let snakePoints  = [], moves = [], food;

let interval;

window.addEventListener("DOMContentLoaded", () => {

  let gameCanvas = document.getElementById("game-canvas");

  context = gameCanvas.getContext('2d');

  start();

})


const start = () => {

  snakePoints =[
    { h : 9 , v : 8},
    { h : 9 , v : 9},
    { h : 9 , v : 10}
  ]

  moves.push({
    dir : "up",
    start : 0,
    end : snakePoints.length -1
  })

  createFood();

  updateCanvas();

  interval = setInterval( 
    () => {
      
      updateSnakePoints();

      updateCanvas();

    },500
  )

  document.body.addEventListener('keydown',handleKeyPress);

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
  
      interval = setInterval( 
        () => {
  
          updateMoves();
  
          updateSnakePoints();
  
          updateCanvas();
  
        },500
      )

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
  
  moves.slice(1, moves.length).forEach(
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

  //console.log("Snake points " ,  ...snakePoints);

  if(doesContainFood()) {
    addSnakePoint();
  }

}

doesContainFood = () => {

  let snakeFirstPoint = snakePoints[0]

  return snakeFirstPoint.v == food.v && snakeFirstPoint.h == food.h;

}

addSnakePoint = () => {

  let snakeLastPoint = snakePoints[snakePoints.length - 1];
  let lastMove = moves[moves.length - 1];

  let newPoint = { ...snakeLastPoint};

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
  updateMoves();

  updateSnakePoints();
  
  updateCanvas();

  clearFood();

  createFood();

}

const drawGrid = () => {

  context.beginPath();

  for(let i=0;i<horizondalBoxes;i++) {

    context.moveTo( i*boxSize, 0 );
    context.lineTo(i*boxSize , boxSize * verticalBoxes);

  }

  for(let i=0;i<verticalBoxes;i++) {

    context.moveTo( 0 , i*boxSize);
    context.lineTo(boxSize * verticalBoxes, i*boxSize);

  }

  context.strokeStyle = '#fff';
  context.stroke();



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

  console.log("Food", food)

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

createFood = () => {

  let vertical = Math.round(Math.random() * (verticalBoxes - 1));
  let horizondal = Math.round(Math.random() * (horizondalBoxes - 1));

  let ifInsideSnake = snakePoints.some(
    (point) => {
      return point.v == vertical && point.h == horizondal;
    }
  )

  if(!ifInsideSnake) 
    food = {  h : horizondal , v : vertical};
  else
    createFood();

}

