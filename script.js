// DOM Elements
const addWordForm = document.querySelector(".add-word-form");

const wordInput = document.getElementById("wordInput");

const meaningInput = document.getElementById("meaningInput");

const exampleInput = document.getElementById("exampleInput");

const decksContainer = document.querySelector(".decks-container");

const reviewContainer = document.querySelector(".review-container");
const noWordReview = document.querySelector(".no-word-review");
const foundWordReview = document.querySelector(".found-word-review");

const startReviewButton = document.querySelector(".found-word-review button");

const numWordsElements = document.querySelectorAll(".num-words");

const dueWordsElement = document.querySelector(".due-words");
const totalWordsElement = document.querySelector(".total-words");
const masteredWordsElement = document.querySelector(".mastered-words");
const dayStreakElement = document.querySelector(".streak-words");

// Review DOM Elements
const reviewSession = document.querySelector(".review-session");

const endReviewButton = document.querySelector(".end-review");

const reviewCounter = document.querySelector(".review-counter");

const reviewProgressBar = document.querySelector(".review-progress-bar");

const flashcard = document.querySelector(".flashcard");

const cardInner = document.querySelector(".card-inner");

const listenButton = document.querySelector(".listen-button");

const stillLearningButton = document.querySelector(".still-learning");

const knewItButton = document.querySelector(".knew-it");

//flash card content
const cardWord = document.querySelector(".card-word");
const cardMeaning = document.querySelector(".card-meaning");
const cardExample = document.querySelector(".card-example");


//final card of reviwing 
let knewItCount = 0;
let stillLearningCount = 0;

// Application Data
let cards = [];
// Review State
let currentCardIndex = 0;
let isReviewing = false;

addWordForm.addEventListener("submit", (e) => {
  //1
  e.preventDefault();

  //2
  const word = wordInput.value.trim();
  const meaning = meaningInput.value.trim();
  const example = exampleInput.value.trim();

  //3
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const wordCard = {
    id: Date.now(),
    word,
    meaning,
    example,
    //adding data for reviewing
    level: 1,
    progress: 0, //for level progress
    nextReview: tomorrow.toISOString(),
  };
  //4
  cards.push(wordCard);
  wordInput.value = "";
  meaningInput.value = "";
  exampleInput.value = "";

  renderCards();
});

function renderCards() {
  decksContainer.innerHTML = "";

  for (const card of cards) {
    const deck = document.createElement("div");
    const deckInfo = document.createElement("div");
    const h4 = document.createElement("h4");
    const small = document.createElement("small");
    const level = document.createElement("div");
    const progress = document.createElement("progress");
    const levelName = document.createElement("span");
    const btnDel = document.createElement("button");

    h4.textContent = card.word;
    small.textContent = card.example;

    progress.max = 100;
    progress.value = card.progress;
    levelName.textContent = `Level ${card.level}`;

    btnDel.textContent = "x";
    btnDel.dataset.wordId = card.id;

    level.classList.add("level");
    deckInfo.classList.add("deck-info");
    btnDel.classList.add("delete-card");
    btnDel.setAttribute("aria-label", "Delete card");
    progress.classList.add("level-progress");

    deck.classList.add("deck");

    deckInfo.append(h4);
    deckInfo.append(small);

    level.append(progress);
    level.append(levelName);

    deck.append(deckInfo);
    deck.append(level);
    deck.append(btnDel);

    decksContainer.append(deck);
  }
  updateStatistics();
  updateReviewState();
  dueWordsElement.textContent = getDueCards().length;
}

//helper function to update number of words
function updateStatistics() {
  const numWords = cards.length;
  totalWordsElement.textContent = numWords;
  numWordsElements.forEach((w) => {
    w.textContent = numWords;
  });
}

//herper function to control in show and hide cards
function updateReviewState() {
  if (cards.length > 0) {
    reviewContainer.classList.add("has-words");
  } else {
    reviewContainer.classList.remove("has-words");
  }
}

decksContainer.addEventListener("click", (e) => {
  const btnDel = e.target.closest(".delete-card");
  if (!btnDel) return;

  const wordId = Number(btnDel.dataset.wordId);
  //   const index = cards.findIndex((w) => w.id === wordId);
  //   if (index === -1) return;
  //   cards.splice(index, 1);
  cards = cards.filter((card) => card.id !== wordId);
  renderCards();
});

function getDueCards() {
  const dueCards = cards.filter(
    (card) => new Date(card.nextReview) >= new Date(),
  );

  return dueCards;
}

function startReview() {
  reviewCards = getDueCards();
  if (reviewCards.length <= 0) return;

  currentCardIndex = 0;
  isReviewing = true;

  reviewSession.classList.add("active");
  showCurrentCard();
  startReviewProgres();
}

startReviewButton.addEventListener("click", () => {
  startReview();
});

//show current card
function showCurrentCard() {
  const currentCard = reviewCards[currentCardIndex];
  cardWord.textContent = currentCard.word;
  cardMeaning.textContent = currentCard.meaning;
  cardExample.textContent = currentCard.example;
  flashcard.classList.remove("flipped");
}

flashcard.addEventListener("click", () => {
  flashcard.classList.toggle("flipped");
});

function nextReviewCard() {
  currentCardIndex++;
  if (currentCardIndex >= reviewCards.length) return;

  showCurrentCard();
  updateReviewProgress();
}

stillLearningButton.addEventListener("click", (e) => {
  e.stopPropagation();
  const currentCard = reviewCards[currentCardIndex];

  updateCardProgress(currentCard, 5);
  nextReviewCard();
});

knewItButton.addEventListener("click", (e) => {
  e.stopPropagation();

  const currentCard = reviewCards[currentCardIndex];

  updateCardProgress(currentCard, 20);
  nextReviewCard();
});

//end session
endReviewButton.addEventListener("click", () => {
  reviewSession.classList.remove("active");
  isReviewing = false;
  renderCards();
});

function updateReviewProgress() {
  const dueCards = getDueCards();
  const totalCards = dueCards.length;

  if (totalCards === 0) {
    reviewProgressBar.value = 0;
    reviewCounter.textContent = "0 / 0";
    return;
  }

  const current = currentCardIndex;
  const progress = (current / totalCards) * 100;

  reviewProgressBar.value = progress;
  reviewCounter.textContent = `${current} / ${totalCards}`;
}

function startReviewProgres() {
  reviewCounter.textContent = `0 / ${getDueCards().length}`;
}

function updateCardProgress(card, amount) {
  card.progress += amount;

  if (card.progress >= 100) {
    card.level++;
    card.progress = 0;
  }
}
