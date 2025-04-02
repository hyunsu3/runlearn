document.addEventListener("DOMContentLoaded", function () {
  loadWords();
});

const words = [
  { word: "pursuit", meaning: "추구, 좇음" },
  { word: "associated with", meaning: "~와 관련이 있는" },
  { word: "whether A or B", meaning: "A 또는 B" },
  { word: "objective", meaning: "목표" },
  { word: "reality", meaning: "현실" },
  { word: "temporary", meaning: "일시적인" },
  { word: "clarity", meaning: "명료성" },
  { word: "assess", meaning: "평가하다" },
  { word: "hinder", meaning: "방해하다" },
  { word: "further", meaning: "더 멀리 나아가" },
  { word: "outcome", meaning: "결과" },
  { word: "involve", meaning: "~을 포함하다" },
  { word: "abstract", meaning: "추상적인" },
  { word: "factor", meaning: "요인" },
  { word: "enhance", meaning: "향상시키다" },
  { word: "attribute A to B", meaning: "A의 원인을 B에게 돌리다" },
  { word: "era", meaning: "시대" },
  { word: "novel", meaning: "새로운" },
  { word: "competent", meaning: "능숙한" },
  { word: "opportunity", meaning: "기회" },
  { word: "cultivate", meaning: "경작하다" },
  { word: "in order to", meaning: "~하기 위해서" },
  { word: "keep you from ing", meaning: "당신이 ~하는 것을 막다" },
  { word: "appropriate", meaning: "적절한" },
];

let usedWords = new Set();
let currentRound = 0;
let totalRounds = 10;
let correctCount = 0;

function loadWords() {
  nextQuestion();
}

function getRandomWords() {
  let availableWords = words.filter((w) => !usedWords.has(w.word));
  if (availableWords.length < 5) {
    usedWords.clear();
    availableWords = words;
  }

  let selected = [];
  while (selected.length < 5) {
    let word = availableWords[Math.floor(Math.random() * availableWords.length)];
    if (!selected.includes(word)) {
      selected.push(word);
      usedWords.add(word.word);
    }
  }
  return selected;
}

function nextQuestion() {
  const englishContainer = document.getElementById("englishCards");
  const koreanContainer = document.getElementById("koreanCards");
  const messageBox = document.getElementById("message");
  const container = document.querySelector(".container");

  if (!englishContainer || !koreanContainer) {
    console.error("❌ 컨테이너 없음!");
    return;
  }

  if (currentRound >= totalRounds) {
    messageBox.innerText = "🎉 모든 문제를 완료했습니다! 🎉";
    messageBox.style.display = "block";

    if (!document.querySelector(".next-button")) {
      const nextStageButton = document.createElement("button");
      nextStageButton.innerText = "다음 단계로";
      nextStageButton.classList.add("next-button");
      nextStageButton.onclick = () => (location.href = "step3.html");
      container.appendChild(nextStageButton);
    }
    return;
  }

  currentRound++;
  correctCount = 0;
  messageBox.style.display = "none";

  const selectedWords = getRandomWords();
  const shuffledKorean = [...selectedWords].sort(() => Math.random() - 0.5);

  englishContainer.innerHTML = "";
  koreanContainer.innerHTML = "";

  selectedWords.forEach((word, index) => {
    const card = createDraggableCard(word.word, `draggable-${word.word}`);
    card.style.position = "absolute";
    card.style.left = `3%`;
    card.style.top = `${index * 90}px`;
    englishContainer.appendChild(card);
  });

  shuffledKorean.forEach((word, index) => {
    const dropZone = createDropZone(word.meaning, `droppable-${word.word}`, word.word);
    dropZone.style.position = "absolute";
    dropZone.style.right = `3%`;
    dropZone.style.top = `${index * 90}px`;
    koreanContainer.appendChild(dropZone);
  });

  applyTouchEvents();
}

function createDraggableCard(text, id) {
  const card = document.createElement("div");
  card.classList.add("draggable");
  card.innerText = text;
  card.id = id;
  card.dataset.word = text;
  return card;
}

function createDropZone(text, id, word) {
  const dropZone = document.createElement("div");
  dropZone.classList.add("droppable");
  dropZone.innerText = text;
  dropZone.id = id;
  dropZone.dataset.word = word;
  return dropZone;
}

function applyTouchEvents() {
  const draggables = document.querySelectorAll(".draggable");
  const droppables = document.querySelectorAll(".droppable");

  const audioEng = new Audio();
  const audioKor = new Audio();

  draggables.forEach((draggable) => {
    let startX, startY, offsetX, offsetY, parentRect;
    let hasPlayedEng = false;

    function onStart(clientX, clientY, type = "touch") {
      parentRect = draggable.offsetParent.getBoundingClientRect();
      const rect = draggable.getBoundingClientRect();

      startX = rect.left;
      startY = rect.top;

      offsetX = clientX - startX;
      offsetY = clientY - startY;

      draggable.style.zIndex = "1000";
      draggable.style.position = "absolute";
      draggable.style.transform = "scale(1.1)";

      audioKor.pause();
      audioKor.currentTime = 0;
      audioEng.pause();
      audioEng.currentTime = 0;

      if (!hasPlayedEng) {
        hasPlayedEng = true;
        const audioEngFile = `Audio/${draggable.dataset.word.replace(/ /g, "_")}.mp3`;
        audioEng.src = audioEngFile;
        audioEng.play().catch(console.error);
      }

      if (type === "mouse") {
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onEnd);
      }
    }

    function onMove(clientX, clientY) {
      draggable.style.left = `${clientX - offsetX - parentRect.left}px`;
      draggable.style.top = `${clientY - offsetY - parentRect.top}px`;
    }

    function onEnd() {
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
            draggable.style.pointerEvents = "none";
            droppedCorrectly = true;
            correctCount++;

            const audioKorFile = `Audio/${draggable.dataset.word.replace(/ /g, "_")}_kor.mp3`;
            audioKor.src = audioKorFile;
            audioKor.play().catch(console.error);
            if (navigator.vibrate) navigator.vibrate(100);
          }
        }
      });

      if (!droppedCorrectly) {
        draggable.style.left = `${startX - parentRect.left}px`;
        draggable.style.top = `${startY - parentRect.top}px`;
      }

      draggable.style.transform = "scale(1)";

      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onEnd);

      if (correctCount === 5) {
        setTimeout(nextQuestion, 1500);
      }
    }

    function onMouseMove(e) {
      onMove(e.clientX, e.clientY);
    }

    draggable.addEventListener("touchstart", (e) => onStart(e.touches[0].clientX, e.touches[0].clientY));
    draggable.addEventListener("touchmove", (e) => {
      e.preventDefault();
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    });
    draggable.addEventListener("touchend", onEnd);

    draggable.addEventListener("mousedown", (e) => {
      e.preventDefault();
      onStart(e.clientX, e.clientY, "mouse");
    });
  });
}
