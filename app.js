let activeCard = null;
let audioEng = new Audio();
let audioKor = new Audio();
let flipTimeout = null;

async function loadWords() {
  try {
    const response = await fetch("words0327.json");
    const words = await response.json();
    displayCards(words);
  } catch (error) {
    console.error("단어 파일을 불러오는 중 오류 발생:", error);
  }
}

function displayCards(words) {
  const container = document.getElementById("cardContainer");
  container.innerHTML = ""; // 기존 카드 제거

  words.forEach((entry) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const front = document.createElement("div");
    front.classList.add("card-front");
    front.innerText = entry.word;

    const back = document.createElement("div");
    back.classList.add("card-back");
    back.innerText = entry.meaning;

    cardInner.appendChild(front);
    cardInner.appendChild(back);
    card.appendChild(cardInner);

    card.addEventListener("click", () => handleCardClick(card, entry.word));

    container.appendChild(card);
  });
}

let delayTimer;
function handleCardClick(card, word) {
  // 기존 진행 중인 이벤트 정리
  if (activeCard) {
    activeCard.classList.remove("flipped", "active");
    clearTimeout(flipTimeout);
    audioEng.pause();
    audioEng.currentTime = 0;
    audioKor.pause();
    audioKor.currentTime = 0;
  }

  // 새로운 카드 활성화
  activeCard = card;
  card.classList.add("active");

  // 영어 음원 파일명 변환
  const audioEngFile = `Audio/${word.replace(/ /g, "_")}.mp3`;
  const audioKorFile = `Audio/${word.replace(/ /g, "_")}_kor.mp3`;

  // 영어 음원 재생 후 뒤집기
  audioEng.src = audioEngFile;
  audioEng
    .play()
    .then(() => {
      const engDuration = audioEng.duration || 0;
      const delay = engDuration < 0.5 ? 500 : engDuration * 500; // 0.5초 이하일 경우 추가 대기

      setTimeout(() => {
        card.classList.add("flipped");

        // 영어 음원이 끝나면 한글 음원 재생
        audioKor.src = audioKorFile;
        audioKor.play();

        // 한글 음원이 끝나면 원래 상태로 복귀
        flipTimeout = setTimeout(() => {
          card.classList.remove("flipped", "active");
          activeCard = null;
        }, audioKor.duration * 500);
      }, delay);
    })
    .catch((error) => console.error("영어 음원 재생 오류:", error));
}

function goToStep2() {
  window.location.href = "step2.html";
}

// 페이지 로딩 시 단어 자동 로드
window.onload = loadWords;
