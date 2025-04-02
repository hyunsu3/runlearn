words = [
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
    audioEng.onended = () => {
      audioKor.play();
      audioKor.onended = () => {
        // 모든 단어가 통과했는지 확인
        const allPassed = words.every((w) => {
          const clean = w.word.trim().replace(/\s/g, "");
          return (wordScores[clean] || 0) >= PASS_THRESHOLD;
        });

        if (allPassed) {
          const goodJobAudio = new Audio("Audio/goodjob.mp3");
          goodJobAudio.play();

          // 🎉 무지개 콘페티 효과
          const end = Date.now() + 5 * 1000;
          const colors = ["#ff0000", "#ffff00", "#0000ff", "#00ff00", "#8000ff", "#ff8000"];

          (function frame() {
            confetti({
              particleCount: 3,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: colors,
            });
            confetti({
              particleCount: 3,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: colors,
            });
            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          })();
        } else {
          setTimeout(startGame, 500);
        }
      };
    };
  } else {
    wordScores[cleanWord] = (wordScores[cleanWord] || 0) - 1;
    console.log(`❌ 오답! 현재 점수: ${wordScores[cleanWord]}`);

    let correctWordArray = currentWordObj.word.replace(/ /g, "").split("");
    let userWordArray = slots
      .map((s) => s.textContent)
      .join("")
      .replace(/ /g, "")
      .split("");

    let incorrectLetters = [];
    let userIndex = 0;
    slots.forEach((slot) => {
      if (!slot.classList.contains("empty")) {
        if (userWordArray[userIndex] !== correctWordArray[userIndex]) {
          slot.style.color = "red";
          incorrectLetters.push(slot.textContent.trim());
        } else {
          slot.style.color = "black";
        }
        userIndex++;
      }
    });

    setTimeout(() => {
      document.querySelector(".stickers").innerHTML = "";

      userIndex = 0;
      slots.forEach((slot) => {
        if (!slot.classList.contains("empty")) {
          if (userWordArray[userIndex] !== correctWordArray[userIndex]) {
            slot.textContent = "";
            slot.dataset.index = "";
            slot.style.color = "#aaa";
          }
          userIndex++;
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
            emptySlot.style.color = "#aaa";
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

document.onkeydown = (e) => {
  const key = e.key.toLowerCase();

  // 알파벳만 허용 (shift나 ctrl 등은 무시)
  if (!/^[a-z]$/.test(key)) return;

  // 화면에 남아있는 스티커 중 key에 해당하는 것 찾기
  const stickers = Array.from(document.querySelectorAll(".sticker"));
  const targetSticker = stickers.find((sticker) => sticker.textContent.toLowerCase() === key);

  if (targetSticker) {
    targetSticker.click(); // 스티커 클릭 효과 발생
  }
};
