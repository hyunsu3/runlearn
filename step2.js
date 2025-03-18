let words = [];
let usedWords = new Set();
let currentRound = 0;
let totalRounds = 5;
let correctCount = 0;

async function loadWords() {
  try {
    const response = await fetch("words.json");
    if (!response.ok) {
      throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
    }
    words = await response.json();
    console.log("불러온 단어:", words);
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
  correctCount = 0;

  let selectedWords = getRandomWords();
  let shuffledKorean = [...selectedWords].sort(() => Math.random() - 0.5);

  let englishContainer = document.getElementById("englishCards");
  let koreanContainer = document.getElementById("koreanCards");

  englishContainer.innerHTML = "";
  koreanContainer.innerHTML = "";

  selectedWords.forEach((word) => {
    let cardWrapper = createDraggableCard(word.word, `draggable-${word.word}`);
    englishContainer.appendChild(cardWrapper);
  });

  shuffledKorean.forEach((word) => {
    let dropWrapper = createDropZone(word.meaning, `droppable-${word.word}`, word.word);
    koreanContainer.appendChild(dropWrapper);
  });

  applyTouchEvents();
}

function createDraggableCard(text, id) {
  let wrapper = document.createElement("div");
  wrapper.classList.add("card-wrapper");

  let card = document.createElement("div");
  card.classList.add("draggable");
  card.innerText = text;
  card.id = id;
  card.dataset.word = text;

  wrapper.appendChild(card);
  return wrapper;
}

function createDropZone(text, id, word) {
  let wrapper = document.createElement("div");
  wrapper.classList.add("card-wrapper");

  let dropZone = document.createElement("div");
  dropZone.classList.add("droppable");
  dropZone.innerText = text;
  dropZone.id = id;
  dropZone.dataset.word = word;

  wrapper.appendChild(dropZone);
  return wrapper;
}

function applyTouchEvents() {
  const draggables = document.querySelectorAll(".draggable");
  const droppables = document.querySelectorAll(".droppable");

  draggables.forEach((draggable) => {
    let startX, startY, offsetX, offsetY, parentRect;

    draggable.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      startX = draggable.offsetLeft;
      startY = draggable.offsetTop;
      offsetX = touch.clientX - startX;
      offsetY = touch.clientY - startY;
      parentRect = draggable.offsetParent.getBoundingClientRect();
      draggable.style.zIndex = "1000"; // 드래그 중 최상단
    });

    draggable.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      draggable.style.left = `${touch.clientX - offsetX}px`;
      draggable.style.top = `${touch.clientY - offsetY}px`;
    });

    draggable.addEventListener("touchend", () => {
      let droppedCorrectly = false;

      droppables.forEach((droppable) => {
        const dRect = droppable.getBoundingClientRect();
        const tRect = draggable.getBoundingClientRect();

        if (tRect.right > dRect.left && tRect.left < dRect.right && tRect.bottom > dRect.top && tRect.top < dRect.bottom) {
          if (draggable.dataset.word === droppable.dataset.word) {
            draggable.style.left = droppable.style.left;
            draggable.style.top = droppable.style.top;
            draggable.classList.add("correct");
            droppedCorrectly = true;
            correctCount++;
          }
        }
      });

      if (!droppedCorrectly) {
        draggable.style.left = `${startX}px`;
        draggable.style.top = `${startY}px`;
      }

      if (correctCount === 3) {
        document.getElementById("message").style.display = "block";
        setTimeout(nextQuestion, 1500);
      }
    });
  });
}

window.onload = loadWords;
