// game state
let backgroundMusicPlaying = false;
let score = 0;
let gameOver = false;

// board
const tileSize = 32;
const rows = 16;
const columns = 16;

const board = document.getElementById("board");
const boardWidth = tileSize * columns; // 32 * 16
const boardHeight = tileSize * rows; // 32 * 16
const context = board.getContext("2d");

//ship
const shipWidth = tileSize * 2;
const shipHeight = tileSize * 2;
const shipX = (tileSize * columns) / 2 - tileSize;
const shipY = tileSize * rows - tileSize * 2;

let ship = {
  x: shipX,
  y: shipY,
  width: shipWidth,
  height: shipHeight,
};
let life = 3;

let shipImg;
let shipVelocityX = tileSize; //ship moving speed

//aliens
let alienArray = [];
const alienWidth = tileSize;
const alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;
let alienShootingTimer = 100;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; //number of alien to defeat
let alienVelocityX = 1; //alien moving speed

// player bullets
let bulletArray = [];
const bulletVelocityY = -10; //bullet moving speed

// alien bullets
let alienBulletArray = [];

// DOM
let play = document.getElementById("play");
