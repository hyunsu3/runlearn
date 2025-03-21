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
const PASS_THRESHOLD = 1; // 🔹 패스 기준 가산점

function startGame() {
  console.log("=== 게임 시작 ===");
  console.log(
    "전체 단어 배열 (words):",
    words.map((w) => w.word)
  );
  console.log("현재 wordScores 상태:", wordScores);
  console.log("PASS_THRESHOLD:", PASS_THRESHOLD);

  // 🔹 모든 단어가 패스 기준을 넘으면 종료 (공백 제거 후 가산점 조회)
  let remainingWords = words.filter((w) => {
    let cleanWord = w.word.trim().replace(/\s/g, ""); // 공백 제거
    let score = wordScores[cleanWord] || 0;
    console.log(`단어: ${w.word} (정리된: ${cleanWord}), 점수: ${score}, 패스 기준(${PASS_THRESHOLD}) 비교: ${score < PASS_THRESHOLD}`);
    return score < PASS_THRESHOLD;
  });

  console.log(
    "필터링된 remainingWords:",
    remainingWords.map((w) => w.word)
  );

  if (remainingWords.length === 0) {
    alert("모든 문제를 잘 풀었어요! 축하합니다! 🎉");
    return;
  }

  // 🔹 바로 직전 문제와 다른 단어 선택
  let availableWords = remainingWords.filter((w) => w !== lastWordObj);
  console.log(
    "필터링된 availableWords (직전 단어 제외):",
    availableWords.map((w) => w.word)
  );

  // 🔹 남은 단어가 하나뿐이라면 그 단어라도 출제
  if (availableWords.length === 0) {
    if (remainingWords.length === 1) {
      availableWords = remainingWords;
      console.log("⚠️ 남은 단어가 하나뿐이므로 해당 단어 선택:", availableWords[0].word);
    } else {
      availableWords = remainingWords.filter((w) => w !== lastWordObj);
    }
  }

  // 🔹 선택된 단어 출력 (공백 제거 후 점수 확인)
  currentWordObj = availableWords[Math.floor(Math.random() * availableWords.length)];
  lastWordObj = currentWordObj;

  let cleanSelectedWord = currentWordObj.word.trim().replace(/\s/g, "");
  console.log(`✅ 선택된 단어: ${currentWordObj.word}, 현재 점수: ${wordScores[cleanSelectedWord] || 0}`);

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

  let cleanWord = currentWordObj.word.trim().replace(/\s/g, "");

  if (answer === correctAnswer) {
    slots.forEach((slot) => {
      slot.style.color = "black";
      slot.style.border = "none";
    });

    wordScores[cleanWord] = (wordScores[cleanWord] || 0) + 1;
    console.log(`✅ 정답! 현재 점수: ${wordScores[cleanWord]}`);

    const audioEngFile = `Audio/${currentWordObj.word.replace(/ /g, "_")}.mp3`;
    const audioKorFile = `Audio/${currentWordObj.word.replace(/ /g, "_")}_kor.mp3`;

    let audioEng = new Audio(audioEngFile);
    let audioKor = new Audio(audioKorFile);

    audioEng.play();
    setTimeout(startGame, 2000);
  } else {
    // 🔹 틀렸을 경우 -1점 반영 (0점 이하 제한 제거)
    wordScores[cleanWord] = (wordScores[cleanWord] || 0) - 1;
    console.log(`❌ 오답! 현재 점수: ${wordScores[cleanWord]}`);

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
