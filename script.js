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
const streakCounter = document.getElementById("day-streak");

const statusMessage = document.getElementById("status-message");

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

let cards = [];
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
  db = e.target.result;
  const store = db.createObjectStore("cards", {
    keyPath: "id",
  });
  store.createIndex("word", "word", { unique: false });

  seedCards.forEach((card) => store.add(card));
};

request.onsuccess = async function (e) {
  db = e.target.result;

  await loadCards();
};

request.onerror = function (e) {
  console.error("Database error:", e.target.error);
};

function tx(objectStoreName, mode) {
  const transaction = db.transaction([objectStoreName], mode);
  const store = transaction.objectStore(objectStoreName);

  return store;
}

async function loadCards() {
  await getCards();
  renderCards();
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

function showView(view) {
  homeView.classList.remove("active");
  reviewView.classList.remove("active");
  completeView.classList.remove("active");

  view.classList.add("active");
}

addWordForm.addEventListener("submit", async (e) => {
  //1
  e.preventDefault();

  //2
  const word = wordInput.value.trim();
  const meaning = meaningInput.value.trim();
  const example = exampleInput.value.trim();

  if (!word || !meaning) {
    showStatusMessage("✗ Please fill in word and meaning!", "error");
    return;
  }

  //3
  const nextReview = new Date();

  nextReview.setMinutes(nextReview.getMinutes() - 15);

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
  try {
    await addWord(wordCard);
    await getCards();
    renderCards();

    wordInput.value = "";
    meaningInput.value = "";
    exampleInput.value = "";

    showStatusMessage(`✓ "${word}" added successfully!`, "success");
  } catch (error) {
    showStatusMessage("✗ Error adding word. Please try again!", "error");
    console.error(error);
  }
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

    btnDel.textContent = "×";
    btnDel.dataset.wordId = card.id;
    btnDel.classList.add("delete-card");
    btnDel.setAttribute("aria-label", "Delete card");

    level.classList.add("level");
    deckInfo.classList.add("deck-info");
    progress.classList.add("level-progress");
    deck.classList.add("deck");
    h4.classList.add("word-deck");

    deckInfo.append(h4, small);
    level.append(progress, levelName);
    deck.append(deckInfo, level, btnDel);

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

  // Update mastered words count
  const masteredCards = getMasteredCards();
  masteredWordsElement.textContent = masteredCards.length;

  // Update day streak
  const streak = calculateDayStreak();
  dayStreakElement.textContent = streak;
  streakCounter.textContent = streak;
}

//herper function to control in show and hide cards
function updateReviewState() {
  if (cards.length > 0) {
    reviewContainer.classList.add("has-words");
  } else {
    reviewContainer.classList.remove("has-words");
  }
}

decksContainer.addEventListener("click", async (e) => {
  const btnDel = e.target.closest(".delete-card");

  if (!btnDel) return;

  const wordId = Number(btnDel.dataset.wordId);

  try {
    await deleteCard(wordId);
    await getCards();

    renderCards();
    showStatusMessage("✓ Word deleted successfully!", "success");
  } catch (error) {
    showStatusMessage("✗ Error deleting word. Please try again!", "error");
    console.error(error);
  }
});

function getDueCards() {
  const dueCards = cards.filter(
    (card) => new Date(card.nextReview) <= new Date(),
  );

  return dueCards;
}

// Get mastered cards (level >= 2)
function getMasteredCards() {
  const masteredCards = cards.filter((card) => card.level >= 2);
  return masteredCards;
}

// Calculate day streak
function calculateDayStreak() {
  const streak = JSON.parse(localStorage.getItem("dayStreak")) || {
    count: 0,
    lastReviewDate: null,
  };
  return streak.count;
}

// Update day streak after review
function updateDayStreak() {
  const today = new Date().toDateString();
  const streak = JSON.parse(localStorage.getItem("dayStreak")) || {
    count: 0,
    lastReviewDate: null,
  };

  // If already reviewed today, don't increment
  if (streak.lastReviewDate === today) {
    return;
  }

  const lastReviewDate = streak.lastReviewDate
    ? new Date(streak.lastReviewDate)
    : null;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if last review was yesterday (continue streak)
  if (
    lastReviewDate &&
    lastReviewDate.toDateString() === yesterday.toDateString()
  ) {
    streak.count++;
  } else if (!lastReviewDate) {
    // First review
    streak.count = 1;
  } else {
    // Streak broken, start new one
    streak.count = 1;
  }

  streak.lastReviewDate = today;
  localStorage.setItem("dayStreak", JSON.stringify(streak));
}

function startReview() {
  knewItCount = 0;
  stillLearningCount = 0;

  reviewCards = getDueCards();
  if (reviewCards.length <= 0) {
    showStatusMessage("✗ No words available for review right now!", "error");
    return;
  }

  showView(reviewView);
  currentCardIndex = 0;
  isReviewing = true;
  showCurrentCard();
  updateReviewProgress();
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

// Listen button functionality - Text to Speech
listenButton.addEventListener("click", (e) => {
  e.stopPropagation();

  const currentCard = reviewCards[currentCardIndex];
  if (!currentCard) return;

  // Stop any ongoing speech
  speechSynthesis.cancel();

  // Create and configure speech
  const utterance = new SpeechSynthesisUtterance(currentCard.word);
  utterance.rate = 0.8;
  utterance.pitch = 1;
  utterance.volume = 1;

  // Speak
  speechSynthesis.speak(utterance);
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

let isProcessingAnswer = false;

stillLearningButton.addEventListener("click", async (e) => {
  e.stopPropagation();
  if (isProcessingAnswer) return;
  isProcessingAnswer = true;

  try {
    const currentCard = reviewCards[currentCardIndex];
    updateCardProgress(currentCard, 5);
    updateNextReview(currentCard);

    stillLearningCount++;
    flashcard.classList.remove("flipped");
    await updateCard(currentCard);
    nextReviewCard();
  } finally {
    isProcessingAnswer = false;
  }
});

knewItButton.addEventListener("click", async (e) => {
  e.stopPropagation();
  if (isProcessingAnswer) return;
  isProcessingAnswer = true;

  try {
    const currentCard = reviewCards[currentCardIndex];
    updateCardProgress(currentCard, 20);
    updateNextReview(currentCard);

    knewItCount++;
    flashcard.classList.remove("flipped");
    await updateCard(currentCard);
    nextReviewCard();
  } finally {
    isProcessingAnswer = false;
  }
});

//end session
endReviewButton.addEventListener("click", async () => {
  showView(homeView);
  isReviewing = false;

  await loadCards();
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

  if (card.progress >= 40) {
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

  // Update day streak
  updateDayStreak();
}

backToDeckButton.addEventListener("click", async () => {
  showView(homeView);
  isReviewing = false;

  await loadCards();
});

//next review
function updateNextReview(card) {
  const nextReview = new Date();

  nextReview.setMinutes(nextReview.getMinutes() + 5); //change the time to 10 seconds for testing purposes

  card.nextReview = nextReview.toISOString();
}

// Show status message (success or error)
function showStatusMessage(message, type = "success") {
  statusMessage.textContent = message;
  statusMessage.className = `status-message show ${type}`;

  // Auto hide after 3 seconds
  setTimeout(() => {
    statusMessage.classList.remove("show");
  }, 3000);
}
