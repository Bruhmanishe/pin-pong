"use strict";

const wrapper = document.querySelector(".wrapper");
const gameBoard = document.querySelector(".game-board");
const ctx = gameBoard.getContext("2d");
const btnUp = document.querySelector(".Up");
const btnDown = document.querySelector(".Down");
const btn2Up = document.querySelector(".Up");
const btn2Down = document.querySelector(".Down");
const score = document.querySelector(".score-count > span");

let playerColor = "#666";
let firstPlayer = {
  x: 5,
  y: 50,
  height: 40,
  width: 10,
};
let secondPlayer = {
  x: 355,
  y: 50,
  height: 40,
  width: 10,
};
let gameWidth = gameBoard.width;
let gameHeight = gameBoard.height;
let ballSpeed = 0.5;
let playerSpeed = 16;
let intervalID;
let playerOneScore = 0;
let playerTwoScore = 0;

let ballRadius = 5;
let ballColor = "#888";
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDir = 0;
let ballYDir = 0;

function drawPlayer(player) {
  ctx.fillStyle = playerColor;
  ctx.strokeStyle = "black";
  ctx.strokeWidth = 10;

  ctx.stroke();
  ctx.beginPath();
  ctx.strokeRect(player.x, player.y, player.width, player.height);
  ctx.fillRect(player.x, player.y, player.width, player.height);
}
function nextTick() {
  intervalID = setTimeout(() => {
    drawBoard();
    drawPlayer(firstPlayer);
    drawPlayer(secondPlayer);
    moveBall();
    checkingColls();
    nextTick();
  }, 0.1);
}

function drawBall(ballX, ballY) {
  ctx.fillStyle = ballColor;
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
  ctx.fill();
}

function moveBall() {
  ballX += ballSpeed * ballXDir;
  ballY += ballSpeed * ballYDir;
  drawBall(ballX, ballY);
}

function createBall() {
  if (Math.round(Math.random()) == 1) {
    ballXDir = 1;
  } else if (Math.round(Math.random()) == 0) {
    ballXDir = -1;
  }
  if (Math.round(Math.random()) == 1) {
    ballYDir = 1;
  } else if (Math.round(Math.random()) == 0) {
    ballYDir = -1;
  }
}

function gameStart() {
  nextTick();
  createBall();
  secondPlayerMove();
}

function drawBoard() {
  ctx.fillStyle = "#eee";
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function movePlayer(e) {
  switch (e.target) {
    case btnDown:
      if (firstPlayer.y + firstPlayer.height >= gameHeight) {
        firstPlayer.y = gameHeight - firstPlayer.height;
      } else {
        firstPlayer.y += playerSpeed;
      }
      break;
    case btnUp:
      if (firstPlayer.y <= 0) {
        firstPlayer.y = 0;
      } else {
        firstPlayer.y -= playerSpeed;
      }
      break;
  }
}

function checkingColls() {
  if (ballY + ballRadius >= gameHeight) {
    ballYDir *= -1;
  }
  if (ballY - ballRadius <= 0) {
    ballYDir *= -1;
  }
  if (ballX - ballRadius <= firstPlayer.x + firstPlayer.width) {
    if (
      ballY - ballRadius > firstPlayer.y &&
      ballY - ballRadius < firstPlayer.y + firstPlayer.height
    ) {
      ballXDir *= -1;
      if(ballSpeed > 1.5){
      ballSpeed += 0.01;
      }
    }
  } else if (ballX - ballRadius >= secondPlayer.x - secondPlayer.width) {
    if (
      ballY + ballRadius > secondPlayer.y &&
      ballY + ballRadius < secondPlayer.y + secondPlayer.height
    ) {
      ballXDir *= -1;
      if(ballSpeed > 1.5){
      ballSpeed += 0.01;
      }
    }
  }

  if (ballX <= 0) {
    updateScore();
    respawnBall();
    playerTwoScore += 1;
  } else if (ballX >= gameWidth) {
    updateScore();
    respawnBall();
    playerOneScore += 1;
  }
}

gameStart();

btnDown.addEventListener("click", movePlayer);
btnUp.addEventListener("click", movePlayer);

function respawnBall() {
  ballX = gameWidth / 2;
  ballY = gameHeight / 2;
  ballSpeed = 0.5;
}

function updateScore() {
  if (playerTwoScore < 9 || playerOneScore < 9) {
    score.textContent = `00${playerOneScore}:00${playerTwoScore}`;
  } else if (playerTwoScore >= 9 || playerOneScore >= 9) {
    score.textContent = `0${playerOneScore}:0${playerTwoScore}`;
  } else if (playerTwoScore >= 99 || playerOneScore >= 99) {
    score.textContent = `${playerOneScore}:${playerTwoScore}`;
  }
}

function secondPlayerMove() {
  setTimeout(move, 100);
  function move() {
    if (ballY > secondPlayer.y + secondPlayer.height / 2) {
      secondPlayer.y += playerSpeed;
    } else if (ballY < secondPlayer.y + secondPlayer.height / 2) {
      secondPlayer.y -= playerSpeed;
    }
    secondPlayerMove();
  }
}
