document.addEventListener("DOMContentLoaded", function () {
  loadWords();
});

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
  let englishContainer = document.getElementById("englishCards");
  let koreanContainer = document.getElementById("koreanCards");

  console.log("영어 카드 컨테이너:", englishContainer);
  console.log("한글 카드 컨테이너:", koreanContainer);

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

      parentRect = draggable.offsetParent.getBoundingClientRect(); // 부모 요소 위치 저장

      startX = draggable.offsetLeft; // 카드의 초기 X 좌표
      startY = draggable.offsetTop; // 카드의 초기 Y 좌표

      offsetX = touch.clientX - (startX + parentRect.left);
      offsetY = touch.clientY - (startY + parentRect.top);

      draggable.style.zIndex = "1000"; // 드래그 중 최상단
      draggable.style.position = "absolute"; // 위치 고정
    });

    draggable.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];

      // 부모 요소 기준으로 위치 보정 적용
      draggable.style.left = `${touch.clientX - offsetX - parentRect.left}px`;
      draggable.style.top = `${touch.clientY - offsetY - parentRect.top}px`;
    });

    draggable.addEventListener("touchend", () => {
      let droppedCorrectly = false;

      droppables.forEach((droppable) => {
        const dRect = droppable.getBoundingClientRect();
        const tRect = draggable.getBoundingClientRect();

        // 정답 체크 (범위 내에 있는지 확인)
        if (tRect.right > dRect.left && tRect.left < dRect.right && tRect.bottom > dRect.top && tRect.top < dRect.bottom) {
          if (draggable.dataset.word === droppable.dataset.word) {
            // 정답일 경우 드롭존 위치에 고정
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

      // 오답이면 원래 위치로 복귀
      if (!droppedCorrectly) {
        draggable.style.left = `${startX}px`;
        draggable.style.top = `${startY}px`;
      }

      // 모든 정답 완료 시 메시지 표시
      if (correctCount === 3) {
        document.getElementById("message").style.display = "block";
        setTimeout(nextQuestion, 1500);
      }
    });
  });
}
