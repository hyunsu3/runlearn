document.addEventListener("DOMContentLoaded", function () {
  loadWords(); // 페이지 로드 시 단어 데이터 로드
});

let words = [
  { word: "commitment", meaning: "전념, 약속" },
  { word: "correlated with", meaning: "~와 연관이 있는" },
  { word: "contribute", meaning: "기여하다" },
  { word: "reduction", meaning: "감소" },
  { word: "anxiety", meaning: "불안" },
  { word: "resilience", meaning: "회복력" },
  { word: "generate", meaning: "생산하다" },
  { word: "responsible for", meaning: "~에 책임이 있는" },
  { word: "relevant", meaning: "관련이 있는" },
  { word: "embrace", meaning: "받아들이다" },
  { word: "resist", meaning: "저항하다" },
  { word: "observe", meaning: "관찰하다" },
  { word: "absorb", meaning: "흡수하다" },
  { word: "transform", meaning: "변형하다" },
  { word: "overrate", meaning: "과대평가하다" },
  { word: "enable", meaning: "~을 가능하게 하다" },
  { word: "function", meaning: "기능" },
  { word: "substitute", meaning: "대체하다" },
  { word: "overlook", meaning: "간과하다" },
  { word: "implication", meaning: "영향" },
  { word: "implement", meaning: "실행" },
  { word: "guide", meaning: "이끌다" },
  { word: "competitive", meaning: "경쟁력 있는" },
  { word: "consciously", meaning: "의식적으로" },
  { word: "nurture", meaning: "양육하다, 가르치다" },
  { word: "uniformity", meaning: "획일성" },
  { word: "obedience", meaning: "복종" },
  { word: "right", meaning: "권리" },
  { word: "secure", meaning: "안전한" },
  { word: "evaluate", meaning: "평가하다" },
  { word: "improve", meaning: "개선하다" },
  { word: "occupy", meaning: "차지하다" },
  { word: "ethical", meaning: "윤리적인" },
  { word: "responsibility", meaning: "책임" },
];

let usedWords = new Set();
let currentRound = 0;
let totalRounds = 10;
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
  let messageBox = document.getElementById("message");
  let container = document.querySelector(".container");

  if (!englishContainer || !koreanContainer) {
    console.error("❌ 영어 또는 한글 카드 컨테이너가 존재하지 않습니다!");
    return;
  }

  if (currentRound >= totalRounds) {
    messageBox.innerText = "🎉 모든 문제를 완료했습니다! 🎉";
    messageBox.style.display = "block";

    // ✅ "다음 단계로" 버튼 추가
    let nextStageButton = document.createElement("button");
    nextStageButton.innerText = "다음 단계로";
    nextStageButton.classList.add("next-button");
    nextStageButton.onclick = () => (location.href = "step3.html");

    container.appendChild(nextStageButton);
    return;
  }

  currentRound++;
  correctCount = 0;
  messageBox.style.display = "none";

  let selectedWords = getRandomWords();
  let shuffledKorean = [...selectedWords].sort(() => Math.random() - 0.5);

  englishContainer.innerHTML = "";
  koreanContainer.innerHTML = "";

  selectedWords.forEach((word, index) => {
    let card = createDraggableCard(word.word, `draggable-${word.word}`);

    card.style.position = "absolute";
    card.style.left = `3%`;
    card.style.top = `${50 + index * 100}px`;

    englishContainer.appendChild(card);
  });

  shuffledKorean.forEach((word, index) => {
    let dropZone = createDropZone(word.meaning, `droppable-${word.word}`, word.word);

    dropZone.style.position = "absolute";
    dropZone.style.right = `3%`;
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

  let audioEng = new Audio();
  let audioKor = new Audio();

  draggables.forEach((draggable) => {
    let startX, startY, offsetX, offsetY, parentRect;
    let hasPlayedEng = false; // 영어 음성이 처음만 재생되도록 설정

    draggable.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];

      parentRect = draggable.offsetParent.getBoundingClientRect();

      startX = draggable.getBoundingClientRect().left;
      startY = draggable.getBoundingClientRect().top;

      offsetX = touch.clientX - startX;
      offsetY = touch.clientY - startY;

      draggable.style.zIndex = "1000";
      draggable.style.position = "absolute";
      draggable.style.transform = "scale(1.1)"; // 드래그 시 확대 효과

      // ✅ 이전 한글 음원 중지 (새로운 드래그 시작 시)
      audioKor.pause();
      audioKor.currentTime = 0;

      // ✅ 영어 음원 재생 (처음만)
      if (!hasPlayedEng) {
        hasPlayedEng = true;
        const audioEngFile = `Audio/${draggable.dataset.word.replace(/ /g, "_")}.mp3`;
        audioEng.src = audioEngFile;
        audioEng.play().catch((error) => console.error("영어 음원 재생 오류:", error));
      }
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

            // ✅ 한글 음원 재생 (정답일 때만)
            const audioKorFile = `Audio/${draggable.dataset.word.replace(/ /g, "_")}_kor.mp3`;
            audioKor.src = audioKorFile;
            audioKor.play().catch((error) => console.error("한글 음원 재생 오류:", error));
          }
        }
      });

      if (!droppedCorrectly) {
        draggable.style.left = `${startX - parentRect.left}px`;
        draggable.style.top = `${startY - parentRect.top}px`;
      }

      draggable.style.transform = "scale(1)"; // 원래 크기로 복구

      if (correctCount === 3) {
        setTimeout(nextQuestion, 1500);
      }
    });
  });
}
