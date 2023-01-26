function setGameOverView() {
  document.querySelector(".game-over").classList.toggle("hide");
  document.getElementById("main-game").classList.add("hide");
  document.getElementById("dom-score").innerText = score;
}

function playSound(sound) {
  const audio = new Audio();

  switch (sound) {
    case "bgm":
      audio.src = "../sfx/bg-music.mp3";
      audio.loop = true;
      audio.play();
      break;
    case "shoot":
      audio.src = "../sfx/shoot.mp3";
      audio.play();
      break;
    default:
      break;
  }
}

function startGame() {
  window.location = window.location
    .toString()
    .replace(/homepage.html/, "index.html");
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
