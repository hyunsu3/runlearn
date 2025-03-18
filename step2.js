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
    let card = createDraggableCard(word.word, `draggable-${word.word}`);
    englishContainer.appendChild(card);
  });

  shuffledKorean.forEach((word) => {
    let dropZone = createDropZone(word.meaning, `droppable-${word.word}`, word.word);
    koreanContainer.appendChild(dropZone);
  });

  applyTouchEvents();
}
