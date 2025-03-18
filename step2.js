let words = [];
let usedWords = new Set();
let currentRound = 0;
let totalRounds = 10;
let draggedCard = null;
let audioEng = new Audio();
let audioKor = new Audio();

async function loadWords() {
  try {
    const response = await fetch("words.json");
    words = await response.json();
    nextQuestion();
  } catch (error) {
    console.error("단어 파일을 불러오는 중 오류 발생:", error);
  }
}

function getRandomWords() {
  let availableWords = words.filter((w) => !usedWords.has(w.word));
  if (availableWords.length < 3) {
    usedWords.clear();
    availableWords = words;
  }

  let selected = [];
  while (selected.length < 3) {
    let randomIndex = Math.floor(Math.random() * availableWords.length);
    let word = availableWords[randomIndex];
    if (!selected.includes(word)) {
      selected.push(word);
      usedWords.add(word.word);
    }
  }
  return selected;
}

function nextQuestion() {
  if (currentRound >= totalRounds) {
    alert("모든 문제를 완료했습니다!");
    return;
  }
  currentRound++;

  let selectedWords = getRandomWords();
  let shuffledKorean = [...selectedWords].sort(() => Math.random() - 0.5);

  let englishContainer = document.getElementById("englishCards");
  let koreanContainer = document.getElementById("koreanCards");

  englishContainer.innerHTML = "";
  koreanContainer.innerHTML = "";

  selectedWords.forEach((word) => {
    let card = createDraggableCard(word.word);
    card.dataset.word = word.word;
    englishContainer.appendChild(card);
  });

  shuffledKorean.forEach((word) => {
    let dropZone = createDropZone(word.meaning, word.word);
    koreanContainer.appendChild(dropZone);
  });

  addDragAndDropEvents();
}

function createDraggableCard(text) {
  let card = document.createElement("div");
  card.classList.add("card");
  card.innerText = text;
  card.draggable = true;
  card.dataset.word = text;

  card.addEventListener("dragstart", (event) => {
    draggedCard = event.target;
    event.target.style.opacity = "0.5";
  });

  card.addEventListener("dragend", (event) => {
    event.target.style.opacity = "1";
    draggedCard = null;
  });

  card.addEventListener("touchstart", (event) => {
    draggedCard = event.target;
    draggedCard.style.opacity = "0.5";
  });

  card.addEventListener("touchmove", (event) => {
    if (!draggedCard) return;
    let touch = event.touches[0];
    draggedCard.style.position = "absolute";
    draggedCard.style.left = `${touch.clientX - 75}px`;
    draggedCard.style.top = `${touch.clientY - 40}px`;
    event.preventDefault();
  });

  card.addEventListener("touchend", () => {
    draggedCard.style.opacity = "1";
    draggedCard = null;
  });

  return card;
}

function createDropZone(text, word) {
  let dropZone = document.createElement("div");
  dropZone.classList.add("drop-zone");
  dropZone.innerText = text;
  dropZone.dataset.word = word;
  return dropZone;
}

function addDragAndDropEvents() {
  let dropZones = document.querySelectorAll(".drop-zone");

  dropZones.forEach((zone) => {
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("highlight");
    });

    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      if (!draggedCard) return;
      let isCorrect = draggedCard.dataset.word === zone.dataset.word;
      if (isCorrect) {
        zone.classList.add("correct");
        draggedCard.remove();
      } else {
        draggedCard.classList.add("wrong");
        setTimeout(() => draggedCard.classList.remove("wrong"), 500);
      }
    });
  });
}

window.onload = loadWords;
