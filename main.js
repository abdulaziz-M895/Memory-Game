let userName;
document
  .querySelector(".control-buttons span")
  .addEventListener("click", function () {
    userName = prompt("What's you name?");
    if (userName === null || userName === "") {
      document.querySelector(".name span").innerHTML = "Unknown";
    } else {
      document.querySelector(".name span").innerHTML =
        userName.slice(0, 1).toUpperCase() + userName.slice(1);
    }
    this.parentElement.remove();
    startGame();
  });

window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.querySelector(".control-buttons span").click();
  }
});

const blocksContainer = document.querySelector(".memory-game-blocks");
const allBlocks = Array.from(document.querySelectorAll(".game-block"));

const flipTime = 1000;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
shuffleArray(allBlocks);

for (let i = 0; i < allBlocks.length; i++) {
  blocksContainer.append(allBlocks[i]);
  // Elzero way
  // allBlocks[i].style.order = Math.floor(Math.random() * allBlocks.length);
}

function startGame() {
  allBlocks.forEach(function (block) {
    block.classList.add("is-flipped");
    setTimeout(function () {
      block.classList.remove("is-flipped");
    }, flipTime);

    block.onclick = function () {
      this.classList.add("is-flipped");

      const allFlipped = allBlocks.filter((block) =>
        block.classList.contains("is-flipped")
      );

      if (allFlipped.length == 2) {
        stopClicking();

        checkMatch(allFlipped[0], allFlipped[1]);
      }

      checkWinCondition();
    };
  });
  countdown(120);
}

let stopClickingTimeout;

function stopClicking() {
  clearTimeout(stopClickingTimeout);

  if (countdownStatus) {
    stopClickingTimeout = setTimeout(() => {
      blocksContainer.classList.remove("no-clicking");
    }, flipTime);
  } else {
    blocksContainer.classList.add("no-clicking");
  }
}

let triesCount = 0;
function checkMatch(firstBlock, secondBlock) {
  let triesElement = document.querySelector(".tries span");

  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");

    document.querySelector("audio#success").play();
  } else {
    triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;
    triesCount++;

    document.querySelector("audio#fail").play();

    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, flipTime);
  }
}

function gameWon() {
  let div = document.createElement("div");
  let divText = document.createTextNode(`You've won!`);
  div.append(divText);

  let again = document.createElement("p");
  again.textContent = "Reload the page to play again";
  div.append(again);

  div.classList.add("pop-up-won");
  document.body.append(div);

  addToLeaderboard(userName, triesCount);

  makeLeaderboard();
}

function checkWinCondition() {
  const allMatch = allBlocks.filter((block) =>
    block.classList.contains("has-match")
  );

  if (allMatch.length == allBlocks.length) {
    gameWon();
    console.log("Game won");
    clearInterval(countdownInterval);
  }
}

let countdownStatus = true;
let countdownInterval;
function countdown(duration) {
  countdownInterval = setInterval(() => {
    let minutes, seconds;

    minutes = parseInt(duration / 60);
    seconds = parseInt(duration % 60);

    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    document.querySelector(".contdown").innerHTML = `${minutes}:${seconds}`;

    if (--duration < 0) {
      countdownStatus = false;

      clearInterval(countdownInterval);

      let div = document.createElement("div");
      let divText = document.createTextNode(`You've Lost! The Time Ended`);
      div.append(divText);

      let again = document.createElement("p");
      again.textContent = "Reload the page to play again";
      div.append(again);

      div.classList.add("pop-up-lost");
      document.body.append(div);

      // Create an Overlay to prevent from clicking
      let overlay = document.createElement("div");
      overlay.style.cssText =
        "width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 2; background-color: white; opacity: 0;";
      document.body.append(overlay);

      blocksContainer.classList.add("no-clicking");
    }
  }, 1000);
}

// Function to retrieve leaderboard data from local storage
function getLeaderboardData() {
  const leaderboardData = sessionStorage.getItem("leaderboard");
  return leaderboardData ? JSON.parse(leaderboardData) : [];
}

// Function to save leaderboard data to local storage
function saveLeaderboardData(data) {
  sessionStorage.setItem("leaderboard", JSON.stringify(data));
}

// Function to add a new entry to the leaderboard
const leaderboardData = getLeaderboardData();
function addToLeaderboard(playerName, wrongTries) {
  playerName == "" || playerName == null
    ? (playerName = "Unknown")
    : playerName;
  leaderboardData.push({ playerName, wrongTries });
  leaderboardData.sort((a, b) => b.wrongTries - a.wrongTries); // Sort in descending order
  saveLeaderboardData(leaderboardData);
}

function makeLeaderboard() {
  if (leaderboardData.length == 0) {
    const win = document.createElement("p");
    win.innerHTML = "Victory earns you a spot on the Leaderboard.";
    win.style.cssText = "margin-bottom: 0;";
    document.querySelector(".info-container").append(win);
  } else {
    leaderboardData.sort(
      (a, b) => parseInt(a.wrongTries) - parseInt(b.wrongTries)
    ); // Sort in ascending order by wrongTries
    for (let i = 0; i < leaderboardData.length; i++) {
      const li = document.createElement("li");
      li.classList.add("player");
      li.innerHTML = `<span>${
        leaderboardData[i].playerName.slice(0, 1).toUpperCase() +
        leaderboardData[i].playerName.slice(1)
      }</span> <span>Wrong Tries: ${leaderboardData[i].wrongTries}</span>`;
      li.style.cssText =
        "display: flex; align-items: center; justify-content: space-between; padding: 15px; width: 100%; margin-bottom: 10px;";
      document.querySelector(".leaderboard ul").append(li);
    }
  }
}
