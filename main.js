document
  .querySelector(".control-buttons span")
  .addEventListener("click", function () {
    this.parentElement.remove();
    startGame();
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
  countdown(3);
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
