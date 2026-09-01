// DOM Elements
const homeView = document.querySelector("main");
const reviewView = document.querySelector(".review-session");
const completeView = document.querySelector(".review-complete");

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
// Review Complete DOM Elements
const reviewedCount = document.querySelector(".reviewed-count");

const recallPercent = document.querySelector(".recall-percent");

const knownCount = document.querySelector(".known-count");

const learningCount = document.querySelector(".learning-count");

const backToDeckButton = document.querySelector(".back-to-deck");

// Application Data
const seedCards = [
  {
    id: 1,
    word: "Apple",
    meaning: "تفاحة",
    example: "I ate an apple this morning.",
    level: 1,
    progress: 0,
    nextReview: new Date("2025-01-01").toISOString(),
  },

  {
    id: 2,
    word: "Book",
    meaning: "كتاب",
    example: "This book is very interesting.",
    level: 1,
    progress: 0,
    nextReview: new Date("2025-01-01").toISOString(),
  },

  {
    id: 3,
    word: "Learn",
    meaning: "يتعلم",
    example: "I want to learn English quickly.",
    level: 1,
    progress: 0,
    nextReview: new Date("2025-01-01").toISOString(),
  },

  {
    id: 4,
    word: "Travel",
    meaning: "يسافر",
    example: "We travel every summer.",
    level: 1,
    progress: 0,
    nextReview: new Date("2025-01-01").toISOString(),
  },

  {
    id: 5,
    word: "Friend",
    meaning: "صديق",
    example: "My friend lives in Cairo.",
    level: 1,
    progress: 0,
    nextReview: new Date("2025-01-01").toISOString(),
  },
];

let cards = [...seedCards];
// Review State
let reviewCards = [];
let currentCardIndex = 0;
let isReviewing = false;

let knewItCount = 0;
let stillLearningCount = 0;

//creating database
let db;

const request = window.indexedDB.open("FlashCards", 1);

request.onupgradeneeded = function (e) {
  db = e.target.result; //get db
  const store = db.creatObjectStore("Cards", {
    keyPath: "id",
  });
  store.createIndex("word", "word", { unique: false });
};

request.onsuccess = function (e) {
  db = e.target.result;
  console.log("Database opened successfully");
};

request.onerror = function (e) {
  console.error("Database error:", e.target.error);
};

function tx(objectStoreName, mode) {
  const transaction = db.transaction([objectStoreName], mode);
  const store = transaction.objectStore(objectStoreName);

  return store;
}

//first crud
//add word -> word is about card
function addWord(card) {
  return new Promise((resolve, reject) => {
    const store = tx("cards", "readwrite");

    const request = store.add(card);

    request.onsuccess = function () {
      resolve();
    };

    request.onerror = function () {
      reject(request.error);
    };
  });
}

//get all cards
function getCards() {
  return new Promise((resolve, reject) => {
    const store = tx("cards", "readonly");

    //create request
    const readRequest = store.getAll();

    //check onsuccess
    readRequest.onsuccess = function () {
      //success message
      cards = readRequest.result;
      resolve(cards);
    };

    readRequest.onerror = function () {
      //error message
      reject(readRequest.error);
    };
  });
}

//updateCard
function updateCard(card) {
  return new Promise((resolve, reject) => {
    const store = tx("cards", "readwrite");

    const request = store.put(card);

    request.onsuccess = function () {
      resolve();
    };

    request.onerror = function () {
      reject(request.error);
    };
  });
}



//delete card

// Delete card
function deleteCard(id) {
  return new Promise((resolve, reject) => {
    const store = tx("cards", "readwrite");

    const request = store.delete(id);

    request.onsuccess = function () {
      resolve();
    };

    request.onerror = function () {
      reject(request.error);
    };
  });
}






renderCards();

function showView(view) {
  homeView.classList.remove("active");
  reviewView.classList.remove("active");
  completeView.classList.remove("active");

  view.classList.add("active");
}

addWordForm.addEventListener("submit", (e) => {
  //1
  e.preventDefault();

  //2
  const word = wordInput.value.trim();
  const meaning = meaningInput.value.trim();
  const example = exampleInput.value.trim();

  //3
  const nextReview = new Date();

  nextReview.setMinutes(nextReview.getMinutes() + 10);

  const wordCard = {
    id: Date.now(),
    word,
    meaning,
    example,

    level: 1,
    progress: 0,
    nextReview: nextReview.toISOString(),
  };
  //4
  // cards.push(wordCard);
  addWord(wordCard);
  wordInput.value = "";
  meaningInput.value = "";
  exampleInput.value = "";

  renderCards();
});

async function renderCards() {
  decksContainer.innerHTML = "";
  cards = await getCards();
  if(cards.length === 0){
    //show message error
    return
  }
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

    reviewProgressBar.value = 0;

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
    (card) => new Date(card.nextReview) <= new Date(),
  );

  return dueCards;
}

function startReview() {
  //intialize with 0
  knewItCount = 0;
  stillLearningCount = 0;

  reviewCards = getDueCards();
  if (reviewCards.length <= 0) return;

  showView(reviewView);
  currentCardIndex = 0;
  isReviewing = true;
  showCurrentCard();
  startReviewProgres();
}

function startReviewProgres() {
  reviewCounter.textContent = `0 / ${reviewCards.length}`;
}

startReviewButton.addEventListener("click", () => {
  startReview();
});

//show current card
function showCurrentCard() {
  const currentCard = reviewCards[currentCardIndex];
  flashcard.classList.remove("flipped");
  cardWord.textContent = currentCard.word;
  cardMeaning.textContent = currentCard.meaning;
  cardExample.textContent = currentCard.example;
}

flashcard.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn) return;

  flashcard.classList.toggle("flipped");
});

function nextReviewCard() {
  currentCardIndex++;

  if (currentCardIndex >= reviewCards.length) {
    showReviewComplete();
    return;
  }

  showCurrentCard();
  updateReviewProgress();
}

stillLearningButton.addEventListener("click", async (e) => {
  e.stopPropagation();
  const currentCard = reviewCards[currentCardIndex];

  updateCardProgress(currentCard, 5);
  updateNextReview(currentCard);

  stillLearningCount++;
  flashcard.classList.remove("flipped");
  await updateCard(currentCard);
  nextReviewCard();
});

knewItButton.addEventListener("click", async (e) => {
  e.stopPropagation();

  const currentCard = reviewCards[currentCardIndex];

  updateCardProgress(currentCard, 20);
  updateNextReview(currentCard);

  knewItCount++;
  flashcard.classList.remove("flipped");
  await updateCard(currentCard);
  nextReviewCard();
});

//end session
endReviewButton.addEventListener("click", () => {
  showView(homeView);
  isReviewing = false;
  renderCards();
});

function updateReviewProgress() {
  const totalCards = reviewCards.length;

  if (totalCards === 0) {
    reviewProgressBar.value = 0;
    reviewCounter.textContent = "0 / 0";
    return;
  }

  const completedCards = currentCardIndex;
  const progress = (completedCards / totalCards) * 100;

  reviewProgressBar.value = progress;
  reviewCounter.textContent = `${completedCards} / ${totalCards}`;
}

function updateCardProgress(card, amount) {
  card.progress += amount;

  if (card.progress >= 100) {
    card.level++;
    card.progress = 0;
  }
}

// showReviewComplete
function showReviewComplete() {
  showView(completeView);
  knownCount.textContent = knewItCount;
  learningCount.textContent = stillLearningCount;
  reviewProgressBar.value = 0;

  const wordsReviewedCount = knewItCount + stillLearningCount;
  if (wordsReviewedCount === 0) {
    return;
  }
  const percent = Math.round((knewItCount / wordsReviewedCount) * 100);

  reviewedCount.textContent = wordsReviewedCount;
  recallPercent.textContent = `${percent}%`;
}

backToDeckButton.addEventListener("click", () => {
  showView(homeView);
  renderCards();
});

//next review
function updateNextReview(card) {
  const nextReview = new Date();

  nextReview.setMinutes(nextReview.getMinutes() + 10);

  card.nextReview = nextReview.toISOString();
}
