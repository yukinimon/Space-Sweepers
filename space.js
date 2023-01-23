//board
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns; // 32 * 16
let boardHeight = tileSize * rows; // 32 * 16
let context;

//restart button
document
  .getElementById("restart")
  .addEventListener("click", () => window.location.reload());

//ship
let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = (tileSize * columns) / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;

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
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;
let alienShootingTimer = 100;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; //number of alien to defeat
let alienVelocityX = 1; //alien moving speed

//bullets
let bulletArray = [];
let bulletVelocityY = -10; //bullet moving speed

// alien bullets
let alienBulletArray = [];

let score = 0;
let gameOver = false;

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d"); //used for drawing on the board

  //draw initial ship
  //context.fillStyle="green";
  //context.fillRect(ship.x, ship.y, ship.width, ship.height);

  //load Images
  shipImg = new Image();
  shipImg.src = "./img/ship.png";
  shipImg.onload = function () {
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
  };

  alienImg = new Image();
  alienImg.src = "./img/alien-magenta.png";
  createAliens();

  requestAnimationFrame(update);
  document.addEventListener("keydown", moveShip);
  document.addEventListener("keyup", shoot);
};

function update() {
  requestAnimationFrame(update);

  if (gameOver) {
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  //ship
  context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

  //alien
  for (let i = 0; i < alienArray.length; i++) {
    let alien = alienArray[i];
    if (alien.alive) {
      alien.x += alienVelocityX;

      //if alien touches the borders
      if (alien.x + alien.width >= board.width || alien.x <= 0) {
        alienVelocityX *= -1;
        alien.x += alienVelocityX * 2;

        //move all aliens up by one row
        for (let j = 0; j < alienArray.length; j++) {
          alienArray[j].y += alienHeight;
        }
      }
      context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

      if (alien.y >= ship.y) {
        gameOver = true;
        setGameOverView();
      }
    } else {
      alienArray.splice(i, 1);
    }
  }

  // make random alien shoot
  alienShootingTimer--;
  if (alienShootingTimer <= 0) {
    alienShootingTimer = 100;
    const alien = alienArray[Math.floor(Math.random() * alienArray.length)];
    alienShoot(alien);
  }

  // alien bullet
  for (let i = 0; i < alienBulletArray.length; i++) {
    let bullet = alienBulletArray[i];
    bullet.y -= bulletVelocityY + 5;
    context.fillStyle = "red";
    context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    //bullet collision with ship
    if (!bullet.used && detectCollision(bullet, ship)) {
      bullet.used = true;
      life -= 1;

      if (life <= 0) {
        gameOver = true;
        setGameOverView();
        return;
      }
    }
  }

  //bullet
  for (let i = 0; i < bulletArray.length; i++) {
    let bullet = bulletArray[i];
    bullet.y += bulletVelocityY;
    context.fillStyle = "white";
    context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    //bullet collision with aliens
    for (let j = 0; j < alienArray.length; j++) {
      let alien = alienArray[j];
      if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
        bullet.used = true;
        alien.alive = false;
        alienCount--;
        score += 100;
      }
    }
  }

  //clear bullets
  while (
    bulletArray.length > 0 &&
    (bulletArray[0].used || bulletArray[0].y < 0)
  ) {
    bulletArray.shift(); //removes the first element of the array
  }
  while (
    alienBulletArray.length > 0 &&
    (alienBulletArray[0].used || alienBulletArray[0].y < 0)
  ) {
    alienBulletArray.shift(); //removes the first element of the array
  }

  //next level
  if (alienCount == 0) {
    //increase the numner of aliens in columns and rows by 1
    alienColumns = Math.min(alienColumns + 1, columns / 2 - 2); //cap at 16/2 ==2 =
    alienRows = Math.min(alienRows + 1, rows - 4); //cap at 16-4 = 12
    alienVelocityX += 0.2; //increase the alien movement speed
    alienArray = [];
    bulletArray = [];
    createAliens();
  }

  //score
  context.fillStyle = "white";
  context.font = "16px courier";
  context.fillText(`score: ${score}`, 5, 20);

  // life
  context.fillStyle = "purple";
  context.font = "30px courier";
  let lifeArr = [];
  for (let i = 0; i < life; i++) {
    lifeArr.push(`♥️`);
  }
  context.fillText(lifeArr.join(""), 5, 50);
}

function moveShip(e) {
  if (gameOver) {
    return;
  }
  if (e.keyCode === 65 && ship.x - shipVelocityX >= 0) {
    ship.x -= shipVelocityX; //move left one tile
  } else if (
    e.keyCode === 68 &&
    ship.x + shipVelocityX + ship.width <= board.width
  ) {
    ship.x += shipVelocityX; //move right one tile
  }
}

function createAliens() {
  for (let c = 0; c < alienColumns; c++) {
    for (let r = 0; r < alienRows; r++) {
      let alien = {
        img: alienImg,
        x: alienX + c * alienWidth,
        y: alienY + r * alienHeight,
        width: alienWidth,
        height: alienHeight,
        alive: true,
      };
      alienArray.push(alien);
    }
  }
  alienCount = alienArray.length;
}

function alienShoot(alien) {
  if (gameOver) {
    return;
  }

  let bullet = {
    x: alien.x + (alienWidth * 15) / 32,
    y: alien.y,
    width: tileSize / 8,
    height: tileSize / 2,
    used: false,
  };
  alienBulletArray.push(bullet);
}

function shoot(e) {
  if (gameOver) {
    return;
  }

  if (e.code == "Space") {
    //shoot
    let bullet = {
      x: ship.x + (shipWidth * 15) / 32,
      y: ship.y,
      width: tileSize / 8,
      height: tileSize / 2,
      used: false,
    };
    bulletArray.push(bullet);
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && //a's top right corner passes b's top left corner
    a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y
  ); //a's bottom left corner passes b's top left corner
}

function setGameOverView() {
  document.querySelector(".game-over").classList.toggle("hide");
  document.getElementById("main-game").classList.add("hide");
  document.getElementById("dom-score").innerText = score;
}
