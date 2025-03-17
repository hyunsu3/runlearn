let words = [];
let usedWords = new Set();
let totalRounds = 10;
let currentRound = 0;
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
    showNextStageButton();
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
  card.dataset.word = text;

  card.addEventListener("dragstart", (event) => {
    draggedCard = event.target;
    event.target.style.opacity = "0.5";
    playAudio(event.target.dataset.word, "eng");
  });

  card.addEventListener("dragend", (event) => {
    event.target.style.opacity = "1";
    draggedCard = null;
  });

  // 터치 이벤트 추가
  card.addEventListener("touchstart", (event) => {
    draggedCard = event.target;
    draggedCard.style.opacity = "0.5";
    draggedCard.style.position = "absolute";
    event.preventDefault();
  });

  card.addEventListener("touchmove", (event) => {
    if (!draggedCard) return;
    let touch = event.touches[0];
    draggedCard.style.left = `${touch.clientX - draggedCard.offsetWidth / 2}px`;
    draggedCard.style.top = `${touch.clientY - draggedCard.offsetHeight / 2}px`;
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
  dropZone.classList.add("drop-zone", "korean-card");
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
        draggedCard.remove();
        playAudio(zone.dataset.word, "kor");
        setTimeout(nextQuestion, 1000); // 정답 맞추면 자동으로 다음 문제로
      } else {
        draggedCard.classList.add("wrong");
        setTimeout(() => {
          draggedCard.classList.remove("wrong");
        }, 500);
      }
    });
  });
}

function playAudio(word, lang) {
  let audio = lang === "eng" ? audioEng : audioKor;
  audio.src = `Audio/${word.replace(/ /g, "_")}${lang === "kor" ? "_kor" : ""}.mp3`;
  audio.play().catch((error) => console.error("음원 재생 오류:", error));
}

function showNextStageButton() {
  let container = document.querySelector(".container");
  let nextStageButton = document.createElement("button");
  nextStageButton.innerText = "다음 단계로!";
  nextStageButton.classList.add("next-button");
  nextStageButton.onclick = () => (window.location.href = "step3.html");
  container.appendChild(nextStageButton);
}

window.onload = loadWords;
