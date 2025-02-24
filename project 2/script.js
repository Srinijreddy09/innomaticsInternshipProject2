const categories = {
  Fruits: ["🍎", "🍌", "🍇", "🍉", "🍓", "🍒", "🥭", "🍍"],
  Emojis: ["😀", "😂", "😍", "😎", "🥳", "🤩", "😜", "😇"],
  Animals: ["🐶", "🐱", "🐭", "🐼", "🦊", "🐻", "🐨", "🦁"],
  Planets: ["🌍", "🪐", "🌕", "⭐", "☀️", "🌑", "🌠", "🌟"],
  Flags: ["🇺🇸", "🇬🇧", "🇨🇦", "🇮🇳", "🇯🇵", "🇩🇪", "🇫🇷", "🇦🇺"],
  Landmarks: ["🗼", "🗽", "🏰", "🏯", "🕌", "🛕", "⛩️", "🏛️"]
};

let selectedCategory = "";
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let timeLeft = 30;
let timer;
const gameBoard = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");

const flipSound = new Audio("flip.mp3");
const matchSound = new Audio("match.mp3");
const winSound = new Audio("win.mp3");
const gameOverSound = new Audio("gameover.mp3");

function startGame(category) {
  selectedCategory = category;
  document.getElementById("categorySelection").style.display = "none";
  gameBoard.innerHTML = "";
  score = 0;
  timeLeft = 30;
  scoreDisplay.innerText = `Score: ${score}`;
  timerDisplay.innerText = `Time: ${timeLeft}s`;

  let items = [...categories[category], ...categories[category]];
  items.sort(() => Math.random() - 0.5);

  items.forEach(emoji => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.emoji = emoji;
      card.innerHTML = "?";
      card.addEventListener("click", flipCard);
      gameBoard.appendChild(card);
  });

  gameBoard.style.display = "grid";
  startTimer();
}

function flipCard() {
  if (lockBoard || this === firstCard) return;
  
  flipSound.play();
  this.innerHTML = this.dataset.emoji;
  this.classList.add("flipped");

  if (!firstCard) {
      firstCard = this;
  } else {
      secondCard = this;
      lockBoard = true;
      setTimeout(checkMatch, 1000);
  }
}

function checkMatch() {
  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
      matchSound.play();
      firstCard.classList.add("hidden");
      secondCard.classList.add("hidden");
      score += 10;
      scoreDisplay.innerText = `Score: ${score}`;
  } else {
      firstCard.innerHTML = "?";
      secondCard.innerHTML = "?";
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
  }
  
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  
  if (document.querySelectorAll(".hidden").length === 16) {
      endGame(true);
  }
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
      timeLeft--;
      timerDisplay.innerText = `Time: ${timeLeft}s`;
      if (timeLeft === 0) {
          endGame(false);
      }
  }, 1000);
}

function endGame(win) {
  clearInterval(timer);
  setTimeout(() => {
      if (win) {
          winSound.play();
          alert(`🎉 You Win! Score: ${score}`);
      } else {
          gameOverSound.play();
          alert("⏳ Time's Up! Try Again.");
      }
      resetGame();
  }, 500);
}

function resetGame() {
  document.getElementById("categorySelection").style.display = "block";
  gameBoard.style.display = "none";
  gameBoard.innerHTML = "";
}
