//11:20 백업

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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let currentWordObj = null; // 🔹 현재 출제된 단어 저장 변수
let lastWordObj = null; // 🔹 바로 직전 문제 방지 변수
let wordScores = {}; // 🔹 단어별 점수 저장
const PASS_THRESHOLD = 3; // 🔹 패스 기준 가산점

function startGame() {
  // 🔹 모든 단어가 패스 기준을 넘으면 종료
  let remainingWords = words.filter((w) => (wordScores[w.word] || 0) < PASS_THRESHOLD);
  if (remainingWords.length === 0) {
    alert("모든 문제를 잘 풀었어요! 축하합니다! 🎉");
    return;
  }

  // 🔹 바로 직전 문제와 다른 단어 선택
  let availableWords = remainingWords.filter((w) => w !== lastWordObj);
  currentWordObj = availableWords[Math.floor(Math.random() * availableWords.length)];
  lastWordObj = currentWordObj;

  let word = currentWordObj.word;
  let meaning = currentWordObj.meaning;

  document.querySelector(".word-meaning").textContent = `뜻: ${meaning}`;
  document.querySelector(".slots").innerHTML = "";
  document.querySelector(".stickers").innerHTML = "";

  let letters = word.split("");
  let revealedLetters = new Map();

  letters.forEach((letter, index) => {
    let slot = document.createElement("div");
    slot.classList.add("slot");
    if (letter === " ") {
      slot.classList.add("empty");
      slot.textContent = "";
    } else if (Math.random() < 0.4) {
      slot.textContent = letter;
      slot.style.color = "black";
      revealedLetters.set(index, letter);
    } else {
      slot.dataset.index = index;
    }
    document.querySelector(".slots").appendChild(slot);
  });

  let filteredLetters = letters.filter((_, index) => !revealedLetters.has(index) && letters[index] !== " ");
  let shuffledLetters = shuffle(filteredLetters.filter((letter) => letter !== " "));

  let stickerContainer = document.querySelector(".stickers");
  stickerContainer.style.position = "relative";
  stickerContainer.style.height = "120px";
  stickerContainer.style.width = "100%";

  let stickerCount = shuffledLetters.length;
  let maxPerRow = stickerContainer.clientWidth >= 450 ? 8 : 6;
  let rowCount = Math.ceil(stickerCount / maxPerRow);

  let stickerSize = 40;
  let gap = 10;
  let rowHeight = stickerSize + gap;

  stickerContainer.style.height = `${rowCount * rowHeight}px`;

  shuffledLetters.forEach((letter, index) => {
    let sticker = document.createElement("div");
    sticker.classList.add("sticker");
    sticker.textContent = letter;
    sticker.style.position = "absolute";

    let row = Math.floor(index / maxPerRow);
    let col = index % maxPerRow;
    let totalInRow = Math.min(stickerCount - row * maxPerRow, maxPerRow);
    let rowWidth = totalInRow * (stickerSize + gap) - gap;
    let startX = (stickerContainer.clientWidth - rowWidth) / 2;

    let x = startX + col * (stickerSize + gap);
    let y = row * rowHeight;

    sticker.style.left = `${x}px`;
    sticker.style.top = `${y}px`;

    sticker.onclick = function () {
      let emptySlot = document.querySelector(".slot[data-index]");
      if (emptySlot) {
        emptySlot.textContent = letter;
        emptySlot.style.color = "#aaa";
        emptySlot.removeAttribute("data-index");
        sticker.remove();

        if (!document.querySelector(".slot[data-index]")) {
          checkAnswer();
        }
      }
    };

    stickerContainer.appendChild(sticker);
  });
}

function checkAnswer() {
  let slots = Array.from(document.querySelectorAll(".slot"));

  if (slots.filter((slot) => !slot.classList.contains("empty")).some((slot) => slot.textContent === "")) return;

  let answer = slots
    .map((s) => s.textContent)
    .join(" ")
    .replace(/ /g, "");
  let correctAnswer = currentWordObj.word.replace(/ /g, "");

  console.log("사용자가 입력한 단어:", `"${answer}"`);
  console.log("정답 단어:", `"${correctAnswer}"`);

  if (answer === correctAnswer) {
    slots.forEach((slot) => {
      slot.style.color = "black";
      slot.style.border = "none";
    });

    wordScores[correctAnswer] = (wordScores[correctAnswer] || 0) + 1;
    console.log(`✅ 정답! 현재 점수: ${wordScores[correctAnswer]}`);

    const audioEngFile = `Audio/${currentWordObj.word.replace(/ /g, "_")}.mp3`;
    const audioKorFile = `Audio/${currentWordObj.word.replace(/ /g, "_")}_kor.mp3`;

    let audioEng = new Audio(audioEngFile);
    let audioKor = new Audio(audioKorFile);

    audioEng.play();
    setTimeout(startGame, 2000);
  } else {
    // 🔹 공백을 제거한 배열 생성 (공백 포함된 원래 슬롯 비교용)
    let correctWordArray = currentWordObj.word.replace(/ /g, "").split("");
    let userWordArray = slots
      .map((s) => s.textContent)
      .join("")
      .replace(/ /g, "")
      .split("");

    console.log("사용자 입력 배열:", userWordArray);
    console.log("정답 배열:", correctWordArray);

    let incorrectLetters = []; // 틀린 글자를 저장할 배열

    let userIndex = 0; // 사용자 입력 배열 인덱스 (공백 제외)
    slots.forEach((slot) => {
      if (!slot.classList.contains("empty")) {
        if (userWordArray[userIndex] !== correctWordArray[userIndex]) {
          slot.style.color = "red"; // ❌ 틀린 글자 빨간색
          incorrectLetters.push(slot.textContent.trim()); // 틀린 글자 저장
        } else {
          slot.style.color = "black"; // ✅ 맞은 글자는 검정색 유지
        }
        userIndex++; // 공백이 아닌 글자만 증가
      }
    });

    setTimeout(() => {
      document.querySelector(".stickers").innerHTML = ""; // 기존 스티커 초기화

      userIndex = 0; // 다시 사용자 인덱스 초기화
      slots.forEach((slot) => {
        if (!slot.classList.contains("empty")) {
          if (userWordArray[userIndex] !== correctWordArray[userIndex]) {
            slot.textContent = ""; // 틀린 글자만 제거
            slot.dataset.index = "";
            slot.style.color = "#aaa";
          }
          userIndex++; // 공백이 아닌 글자만 증가
        }
      });

      incorrectLetters.forEach((letter) => {
        let sticker = document.createElement("div");
        sticker.classList.add("sticker");
        sticker.textContent = letter;
        sticker.onclick = function () {
          let emptySlot = document.querySelector(".slot[data-index]");
          if (emptySlot) {
            emptySlot.textContent = letter;
            emptySlot.style.color = "#aaa"; // 🔹 입력된 글자도 회색으로 유지
            emptySlot.removeAttribute("data-index");
            sticker.remove();
            if (!document.querySelector(".slot[data-index]")) {
              checkAnswer();
            }
          }
        };
        document.querySelector(".stickers").appendChild(sticker);
      });
    }, 1000);
  }
}

startGame();
