function setGameOverView() {
  document.querySelector(".game-over").classList.toggle("hide");
  document.getElementById("main-game").classList.add("hide");
  document.getElementById("dom-score").innerText = score;
  if (bgmAudio) {
    bgmAudio.pause()
    bgmAudio.currentTime = 0
  }
  playSound("gameOver");
}

function playSound(sound) {
  const audio = new Audio();

  switch (sound) {
    case "bgm":
      const bgm = new Audio();
      bgm.src = "../sfx/bg-music.mp3";
      bgm.loop = true;
      bgm.play();
      bgmAudio = bgm
      break;
    case "shoot":
      audio.src = "../sfx/shoot.mp3";
      audio.play();
      break;
    case "gameOver":
      audio.src = "../sfx/game_over-sound.mp3"
      audio.play();
      break;
    case "hitSound":
      audio.src = "../sfx/hit-sound.mp3"
      audio.play();
      break;
    default:
      break;
  }
}

function startGame() {
  window.location = window.location
    .toString()
    .replace(/index.html/, "main.html");
}

//restart button
document
  .getElementById("restart")
  .addEventListener("click", () => window.location.reload());

play.addEventListener("click", () => {
  if (!backgroundMusicPlaying) {
    playSound("bgm");
    backgroundMusicPlaying = true;
  }
});
