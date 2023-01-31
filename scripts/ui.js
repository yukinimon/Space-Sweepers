function setGameOverView() {
  document.querySelector(".game-over").classList.toggle("hide");
  document.getElementById("main-game").classList.add("hide");
  document.getElementById("dom-score").innerText = score;
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
  }
  playSound("gameOver");
}

function playSound(sound) {
  const audio = new Audio();
  audio.crossOrigin = "anonymous";

  switch (sound) {
    case "bgm":
      const bgm = new Audio();
      bgm.crossOrigin = "anonymous";
      bgm.src =
        "https://github.com/yukinimon/Space-Invaders/blob/30e9dfd1f13e3748aed035db615ca95bf185afc7/sfx/bg-music.mp3?raw=true";
      bgm.loop = true;
      bgm.play();
      bgmAudio = bgm;
      break;
    case "shoot":
      audio.src =
        "https://github.com/yukinimon/Space-Invaders/blob/30e9dfd1f13e3748aed035db615ca95bf185afc7/sfx/shoot.mp3?raw=true";
      audio.play();
      break;
    case "gameOver":
      audio.src =
        "https://github.com/yukinimon/Space-Invaders/blob/30e9dfd1f13e3748aed035db615ca95bf185afc7/sfx/game_over-sound.mp3?raw=true";
      audio.play();
      break;
    case "hitSound":
      audio.src =
        "https://github.com/yukinimon/Space-Invaders/blob/30e9dfd1f13e3748aed035db615ca95bf185afc7/sfx/hit-sound.mp3?raw=true";
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
