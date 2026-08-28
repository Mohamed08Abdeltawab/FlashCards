// DOM Elements
const addWordForm = document.querySelector(".add-word-form");

const wordInput = document.getElementById("wordInput");

const meaningInput = document.getElementById("meaningInput");

const exampleInput = document.getElementById("exampleInput");

const decksContainer = document.querySelector(".decks-container");

const noWordReview = document.querySelector(".no-word-review");
const foundWordReview = document.querySelector(".found-word-review");

const startReviewButton = document.querySelector(".found-word-review button");

const numWordsElements = document.querySelectorAll(".num-words");

const dueWordsElement = document.querySelector(".due-words");
const totalWordsElement = document.querySelector(".total-words");
const masteredWordsElement = document.querySelector(".mastered-words");
const dayStreakElement = document.querySelector(".streak-words");

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
  const wordCard = {
    word,
    meaning,
    example,
  };
  //4
  cards.push(wordCard);

  renderCards();

  //   console.log(cards);

  wordInput.value = "";
  meaningInput.value = "";
  exampleInput.value = "";
});

function renderCards() {
  decksContainer.innerHTML = "";

  const progressValue = 0;
  const levelText = "Level 1";

  for (const card of cards) {

    const deck = document.createElement("div");
        const deckInfo = document.createElement("div");
            const h4 = document.createElement("h4");
            const small = document.createElement("small");
        const level = document.createElement("div");
            const progress = document.createElement("progress");
            const level1 = document.createElement("span");

    h4.textContent = card.word;
    small.textContent = card.example;

    progress.value = progressValue;
    level1.textContent = levelText;

    deckInfo.append(h4);
    deckInfo.append(small);

    level.append(progress);
    level.append(level1);

    deck.append(deckInfo);
    deck.append(level);

    level.classList.add("level");
    deckInfo.classList.add("deck-info");

    deck.classList.add("deck");
    decksContainer.append(deck);
  }
}
