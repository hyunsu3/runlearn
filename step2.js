document.addEventListener("DOMContentLoaded", function () {
  loadWords(); // 페이지 로드 시 단어 데이터 로드
});

let words = [
  { word: "sustainable", meaning: "지속 가능한" },
  { word: "address", meaning: "~을 다루다" },
  { word: "facilitate", meaning: "~을 용이하게 하다" },
  { word: "facilitate trade", meaning: "무역을 용이하게 하다" },
  { word: "allocate", meaning: "분배하다" },
  { word: "justify", meaning: "정당화하다" },
  { word: "advance", meaning: "발전" },
  { word: "expand", meaning: "확장하다" },
  { word: "struggle", meaning: "고생하다" },
  { word: "enact", meaning: "제정하다" },
  { word: "enact a law", meaning: "법을 제정하다" },
  { word: "hazard", meaning: "위험" },
  { word: "patient", meaning: "환자" },
  { word: "deception", meaning: "기만" },
  { word: "vulnerable", meaning: "취약한" },
  { word: "companion", meaning: "동반자" },
  { word: "inferior", meaning: "열등한" },
  { word: "superior", meaning: "우수한" },
  { word: "distinguish", meaning: "구별하다" },
  { word: "persuade", meaning: "설득하다" },
  { word: "innovation", meaning: "혁신" },
  { word: "innovative", meaning: "혁신적인" },
];

// async function loadWords() {
//   try {
//     const response = await fetch("words.json");
//     words = await response.json();
//     nextQuestion();
//   } catch (error) {
//     console.error("단어 파일을 불러오는 중 오류 발생:", error);
//   }
// }

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
  document.getElementById("message").style.display = "none";

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
