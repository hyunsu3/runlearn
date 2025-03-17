let words = [];
let usedWords = new Set();
let totalRounds = 10;
let currentRound = 0;
let draggedCard = null;

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

  const selected = [];
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
    alert("🎉 10문제 완료! 수고했어요!");
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
    let card = createDraggableCard(word.word, "english-card");
    card.dataset.word = word.word;
    englishContainer.appendChild(card);
  });

  shuffledKorean.forEach((word) => {
    let dropZone = createDropZone(word.meaning, word.word);
    koreanContainer.appendChild(dropZone);
  });

  addDragAndDropEvents();
}

function createDraggableCard(text, className) {
  let card = document.createElement("div");
  card.classList.add("card", className);
  card.innerText = text;
  card.draggable = true;
  return card;
}

function createDropZone(text, word) {
  let dropZone = document.createElement("div");
  dropZone.classList.add("drop-zone", "korean-card");
  dropZone.innerText = text;
  dropZone.dataset.word = word;
  return dropZone;
}

function addDragAndDropEvents() {
  let draggableCards = document.querySelectorAll(".english-card");
  let dropZones = document.querySelectorAll(".drop-zone");

  draggableCards.forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      draggedCard = event.target;
      event.target.style.opacity = "0.5";
    });

    card.addEventListener("dragend", (event) => {
      event.target.style.opacity = "1";
      draggedCard = null;
    });
  });

  dropZones.forEach((zone) => {
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("highlight");
    });

    zone.addEventListener("dragleave", () => {
      zone.classList.remove("highlight");
    });

    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      zone.classList.remove("highlight");

      if (!draggedCard) return;

      let isCorrect = draggedCard.dataset.word === zone.dataset.word;
      if (isCorrect) {
        zone.classList.add("correct");
        draggedCard.remove(); // 정답이면 카드 제거
      } else {
        draggedCard.classList.add("wrong");
        setTimeout(() => {
          draggedCard.classList.remove("wrong");
        }, 500);
      }
    });
  });
}

window.onload = loadWords;
