document.addEventListener("DOMContentLoaded", function () {
  loadWords(); // 페이지 로드 시 단어 데이터 로드
});

let words = [
  { word: "apple", meaning: "사과" },
  { word: "banana", meaning: "바나나" },
  { word: "grape", meaning: "포도" },
  { word: "orange", meaning: "오렌지" },
  { word: "watermelon", meaning: "수박" },
];

let usedWords = new Set();
let currentRound = 0;
let totalRounds = 5;
let correctCount = 0;

function loadWords() {
  console.log("불러온 단어:", words);
  nextQuestion();
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
  let englishContainer = document.getElementById("englishCards");
  let koreanContainer = document.getElementById("koreanCards");

  if (!englishContainer || !koreanContainer) {
    console.error("❌ 영어 또는 한글 카드 컨테이너가 존재하지 않습니다!");
    return;
  }

  if (currentRound >= totalRounds) {
    alert("모든 문제를 완료했습니다!");
    return;
  }
  currentRound++;
  correctCount = 0;

  let selectedWords = getRandomWords();
  let shuffledKorean = [...selectedWords].sort(() => Math.random() - 0.5);

  englishContainer.innerHTML = "";
  koreanContainer.innerHTML = "";

  selectedWords.forEach((word, index) => {
    let card = createDraggableCard(word.word, `draggable-${word.word}`);

    // ✅ 각 카드의 초기 위치를 강제로 지정 (고정된 배열 유지)
    card.style.position = "absolute";
    card.style.left = `50px`;
    card.style.top = `${50 + index * 100}px`;

    englishContainer.appendChild(card);
  });

  shuffledKorean.forEach((word, index) => {
    let dropZone = createDropZone(word.meaning, `droppable-${word.word}`, word.word);

    // ✅ 드롭존도 고정된 위치에 배치
    dropZone.style.position = "absolute";
    dropZone.style.left = `250px`;
    dropZone.style.top = `${50 + index * 100}px`;

    koreanContainer.appendChild(dropZone);
  });

  applyTouchEvents();
}

function createDraggableCard(text, id) {
  let card = document.createElement("div");
  card.classList.add("draggable");
  card.innerText = text;
  card.id = id;
  card.dataset.word = text;
  return card;
}

function createDropZone(text, id, word) {
  let dropZone = document.createElement("div");
  dropZone.classList.add("droppable");
  dropZone.innerText = text;
  dropZone.id = id;
  dropZone.dataset.word = word;
  return dropZone;
}

function applyTouchEvents() {
  const draggables = document.querySelectorAll(".draggable");
  const droppables = document.querySelectorAll(".droppable");

  draggables.forEach((draggable) => {
    let startX, startY, offsetX, offsetY, parentRect;

    draggable.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];

      parentRect = draggable.offsetParent.getBoundingClientRect();

      startX = draggable.getBoundingClientRect().left;
      startY = draggable.getBoundingClientRect().top;

      offsetX = touch.clientX - startX;
      offsetY = touch.clientY - startY;

      draggable.style.zIndex = "1000";
      draggable.style.position = "absolute"; // 개별 이동 유지
      draggable.style.transform = "scale(1.1)"; // 드래그 시 확대 효과
    });

    draggable.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];

      draggable.style.left = `${touch.clientX - offsetX - parentRect.left}px`;
      draggable.style.top = `${touch.clientY - offsetY - parentRect.top}px`;
    });

    draggable.addEventListener("touchend", () => {
      let droppedCorrectly = false;

      droppables.forEach((droppable) => {
        const dRect = droppable.getBoundingClientRect();
        const tRect = draggable.getBoundingClientRect();

        if (tRect.right > dRect.left && tRect.left < dRect.right && tRect.bottom > dRect.top && tRect.top < dRect.bottom) {
          if (draggable.dataset.word === droppable.dataset.word) {
            const dropX = dRect.left - parentRect.left + (dRect.width - draggable.offsetWidth) / 2;
            const dropY = dRect.top - parentRect.top + (dRect.height - draggable.offsetHeight) / 2;

            draggable.style.left = `${dropX}px`;
            draggable.style.top = `${dropY}px`;

            draggable.classList.add("correct");
            droppedCorrectly = true;
            correctCount++;
          }
        }
      });

      if (!droppedCorrectly) {
        draggable.style.left = `${startX - parentRect.left}px`;
        draggable.style.top = `${startY - parentRect.top}px`;
      }

      draggable.style.transform = "scale(1)"; // 원래 크기로 복구

      if (correctCount === 3) {
        document.getElementById("message").style.display = "block";
        setTimeout(nextQuestion, 1500);
      }
    });
  });
}
