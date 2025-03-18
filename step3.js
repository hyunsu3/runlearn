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

function checkAnswer() {
  let slots = Array.from(document.querySelectorAll(".slot"));
  if (slots.filter((slot) => !slot.classList.contains("empty")).some((slot) => slot.textContent === "")) return;

  let answer = slots
    .map((s) => s.textContent)
    .join("")
    .replace(/ /g, "");
  let correctAnswer = words.find((w) => w.word.replace(/ /g, "") === answer);

  if (correctAnswer) {
    slots.forEach((slot) => {
      slot.style.color = "black";
      slot.style.border = "none";
    });

    const word = correctAnswer.word;
    const audioEngFile = `Audio/${word.replace(/ /g, "_")}.mp3`;
    const audioKorFile = `Audio/${word.replace(/ /g, "_")}_kor.mp3`;

    let audioEng = new Audio(audioEngFile);
    let audioKor = new Audio(audioKorFile);

    audioEng.play();

    setTimeout(startGame, 3000);
  } else {
    let correctWordObj = words.find((w) => w.word.replace(/ /g, "").length === answer.length);
    if (!correctWordObj) return;

    let correctWordArray = correctWordObj.word.replace(/ /g, "").split("");
    slots.forEach((slot, index) => {
      if (slot.textContent !== correctWordArray[index]) {
        let incorrectLetter = slot.textContent;
        slot.style.color = "red";
        setTimeout(() => {
          slot.style.color = "#aaa";
          slot.style.border = "2px solid gray";
          slot.textContent = "";
          slot.dataset.index = index;

          // Restore incorrect letter as a sticker
          let sticker = document.createElement("div");
          sticker.classList.add("sticker");
          sticker.textContent = incorrectLetter;
          sticker.onclick = function () {
            let emptySlot = document.querySelector(".slot[data-index]");
            if (emptySlot) {
              emptySlot.textContent = incorrectLetter;
              emptySlot.removeAttribute("data-index");
              sticker.remove();
              checkAnswer();
            }
          };
          document.querySelector(".stickers").appendChild(sticker);
        }, 1000);
      }
    });
  }
}

function startGame() {
  let randomWordObj = words[Math.floor(Math.random() * words.length)];
  let word = randomWordObj.word;
  let meaning = randomWordObj.meaning;

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

  shuffledLetters.forEach((letter) => {
    let sticker = document.createElement("div");
    sticker.classList.add("sticker");
    sticker.textContent = letter;
    sticker.onclick = function () {
      let emptySlot = document.querySelector(".slot[data-index]");
      if (emptySlot) {
        emptySlot.textContent = letter;
        emptySlot.removeAttribute("data-index");
        sticker.remove();
        checkAnswer();
      }
    };
    document.querySelector(".stickers").appendChild(sticker);
  });
}

startGame();
