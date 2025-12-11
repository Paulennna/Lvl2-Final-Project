const flashcard = document.getElementById("flashcard");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressContainer = document.getElementById("progress");
const progressBar = document.getElementById("progressBar");
const progressValue = document.getElementById("progressValue");
const addFlashcardBtn = document.getElementById("addFlashcardBtn");
const addDialog = document.getElementById("addDialog");
const closeAddBtn = document.getElementById("closeAddBtn");
const inputQuestion = document.getElementById("inputQuestion");
const inputAnswer = document.getElementById("inputAnswer");
const editDialog = document.getElementById("editDialog");
const editFlashcardBtn = document.getElementById("editFlashcardBtn");
const closeEditBtn = document.getElementById("closeEditBtn");
const flashcardTable = document.getElementById("flashcardTable");
const shuffleBtn = document.getElementById("shuffleBtn");
const snackbar = document.getElementById("snackbar");
const correctBtn = document.getElementById("correctBtn");
const incorrectBtn = document.getElementById("incorrectBtn");
const scoreDisplay = document.getElementById("scoreDisplay");

let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
let currentIndex = parseInt(localStorage.getItem("currentIndex"), 10) || 0;
let progress = parseInt(localStorage.getItem("progress"), 10) || 0;
let displayOrder = JSON.parse(localStorage.getItem("displayOrder")) || [];
let progressState = localStorage.getItem("progressState") || "percentage";
let correct = parseInt(localStorage.getItem("correct"), 10) || 0;
let incorrect = parseInt(localStorage.getItem("incorrect"), 10) || 0;

let displayIndex = null;

const displayQuestion = document.createElement("h2");
const displayAnswer = document.createElement("h2");
flashcard.appendChild(displayQuestion);
flashcard.appendChild(displayAnswer);
displayQuestion.id = "question";
displayAnswer.id = "answer";

loadContent();

function loadContent() {
  if (flashcards.length === 0) {
      showNothing();
    updateProgress();
    shuffleBtn.disabled = true;
  } else { 
    if (!displayOrder || displayOrder.length !== flashcards.length){
      resetDisplayOrder();
      localStorage.setItem("displayOrder", JSON.stringify(displayOrder))
    }
   if (flashcards.length === currentIndex) {
    showFinished();
    updateProgress();
  } else {
    shuffleBtn.disabled = false;
    showFlashcard(currentIndex);
    updateProgress();
  }}
  updateScoreDisplay();
  renderFlashCardTable();
} 

function displayCard(front, back) {
  displayQuestion.textContent = front;
  displayAnswer.textContent = back;
  displayQuestion.style.display = "block";
  displayAnswer.style.display = "none";
}

function showNothing() {
  currentIndex = 0;
  displayCard("", "");
}

function showFlashcard(index) {
  displayIndex = displayOrder[index];

  if (!flashcards[displayIndex].state) {
    flashcards[displayIndex].state = "neutral";
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }

  displayCard(
    flashcards[displayIndex].question,
    flashcards[displayIndex].answer
  );

  handleButtons(displayIndex);
}

function showFinished() {
  displayCard("You did it!", "You did it!");
  prevBtn.disabled = flashcards.length === 0 ? true : false;
  nextBtn.disabled = true;
}

function resetDisplayOrder() {
  displayOrder = flashcards.map((_, i) => i);
}

flashcard.addEventListener("click", () => {
  flipFlashCard();
});

function flipFlashCard() {
  if (displayQuestion.style.display === "block") {
    displayQuestion.style.display = "none";
    displayAnswer.style.display = "block";
  } else {
    displayQuestion.style.display = "block";
    displayAnswer.style.display = "none";
  }

  if (flashcards.length != 0 && currentIndex != flashcards.length) {
    flashcard.classList.toggle("flipped");
  }
}

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
    flashcard.classList.remove("flipped");
    showFlashcard(currentIndex);
    updateProgress();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < flashcards.length - 1) {
    currentIndex++;
    localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
    flashcard.classList.remove("flipped");
    showFlashcard(currentIndex);
    updateProgress();
  } else if (currentIndex === flashcards.length - 1) {
    currentIndex++;
    localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
    showFinished();
    updateProgress();
  }
});

function updateProgress() {
  if (flashcards.length === 0) {
    correctBtn.disabled = true;
    incorrectBtn.disabled = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    progressBar.value = 0;

    if (progressState === "percentage") {
      progressValue.textContent = `0.0%`;
    } else {
      progressValue.textContent = `0/0`;
    }
    return;
  }
  progress = Number(((currentIndex / flashcards.length) * 100).toFixed(1));
  localStorage.setItem("progress", JSON.stringify(progress));
  progressBar.value = progress;
  if (progressState === "percentage") {
    progressValue.textContent = `${progress}%`;
  } else {
    progressValue.textContent = `${currentIndex}/${flashcards.length}`;
  }

  if (currentIndex === flashcards.length) {
    correctBtn.disabled = true;
    incorrectBtn.disabled = true;
    return;
  }

  if (!displayOrder || displayOrder.length !== flashcards.length) {
    resetDisplayOrder();
    localStorage.setItem("displayOrder", JSON.stringify(displayOrder));
  }

  const di = displayOrder[currentIndex];
  if (!flashcards[di].state) {
    flashcards[di].state = "neutral";
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }

  handleButtons(di);

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === flashcards.length;
}

progressContainer.addEventListener("click", () => {
  progressValueConvert();
});

function progressValueConvert() {
  if (progressState === "fraction") {
    progressState = "percentage";
  } else {
    progressState = "fraction";
  }
  localStorage.setItem("progressState", progressState);
  updateProgress();
}

function updateFlashcardTable(index) {
  const flashcardTR = document.createElement("tr");
  const flashcardFront = document.createElement("td");
  const flashcardBack = document.createElement("td");
  const actionButtons = document.createElement("td");
  const btnsDiv = document.createElement("div");
  const editBtn = document.createElement("button");
  const deleteBtn = document.createElement("button");

  flashcardFront.textContent = "";
  flashcardBack.textContent = "";
  flashcardFront.textContent = flashcards[index].question;
  flashcardBack.textContent = flashcards[index].answer;

  editBtn.innerHTML = `<span class="material-symbols-outlined">edit</span>`;
  editBtn.title = "Edit flashcard";
  deleteBtn.innerHTML = '<span class="material-symbols-outlined">delete</span>';
  deleteBtn.title = "Delete flashcard";

  editBtn.addEventListener("click", () => {
    if (
      editBtn.innerHTML ===
      `<span class="material-symbols-outlined">edit</span>`
    ) {
      let flashFrontInput = flashcardFront.querySelector("input");
      let flashBackInput = flashcardBack.querySelector("input");

      setTimeout(() => {
        flashFrontInput.focus();
        flashFrontInput.select();
      }, 0);

      if (!flashFrontInput) {
        flashFrontInput = document.createElement("input");
        flashBackInput = document.createElement("input");

        flashFrontInput.value = flashcardFront.textContent;
        flashBackInput.value = flashcardBack.textContent;

        flashcardFront.textContent = "";
        flashcardBack.textContent = "";
        flashcardFront.appendChild(flashFrontInput);
        flashcardBack.appendChild(flashBackInput);
      }

      editBtn.innerHTML = `<span class="material-symbols-outlined">save</span>`;
      editBtn.title = "Save flashcard";
    } else {
      const flashFrontInput = flashcardFront.querySelector("input");
      const flashBackInput = flashcardBack.querySelector("input");

      flashcardFront.textContent = flashFrontInput.value;
      flashcardBack.textContent = flashBackInput.value;

      flashcards[index].question = flashcardFront.textContent;
      flashcards[index].answer = flashcardBack.textContent;
      localStorage.setItem("flashcards", JSON.stringify(flashcards));
      resetDisplayOrder();
      localStorage.setItem("displayOrder", JSON.stringify(displayOrder));
      currentIndex = 0;
      localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
      loadContent();

      resetScores();

      editBtn.innerHTML = `<span class="material-symbols-outlined">edit</span>`;
    }
  });

  deleteBtn.addEventListener("click", () => {
    flashcards.splice(index, 1);
    if (currentIndex >= index && currentIndex != 0) {
      currentIndex--;
    }
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
    resetDisplayOrder();
    localStorage.setItem("displayOrder", JSON.stringify(displayOrder));
    currentIndex = 0;
    localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
    resetDisplayOrder();
    localStorage.setItem("displayOrder", JSON.stringify(displayOrder));
    renderFlashCardTable();
    flashcard.classList.remove("flipped");
    loadContent();
    resetScores();
  });

  btnsDiv.appendChild(editBtn);
  btnsDiv.appendChild(deleteBtn);
  btnsDiv.id = `groupBtns`;
  actionButtons.appendChild(btnsDiv);

  flashcardTR.appendChild(flashcardFront);
  flashcardTR.appendChild(flashcardBack);
  flashcardTR.appendChild(actionButtons);
  flashcardTable.appendChild(flashcardTR);
}

addFlashcardBtn.addEventListener("click", () => {
  addFlashcardBtn.disabled = true;

  const flashcardTR = document.createElement("tr");
  const flashcardFront = document.createElement("td");
  const flashcardBack = document.createElement("td");
  const actionButtons = document.createElement("td");
  const saveBtn = document.createElement("button");

  const flashFrontInput = document.createElement("input");
  const flashBackInput = document.createElement("input");

  saveBtn.innerHTML = `<span class="material-symbols-outlined">save</span>`;
  saveBtn.title = "Save flashcard";

  flashcardFront.appendChild(flashFrontInput);
  flashcardBack.appendChild(flashBackInput);

  setTimeout(() => {
    flashFrontInput.focus();
    flashFrontInput.select();
  }, 0);

  [flashFrontInput, flashBackInput].forEach((input) => {
    input.addEventListener("keydown", function (event) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === "Enter") {
        event.preventDefault();
        saveBtn.click();
      }
    });
  });

  saveBtn.addEventListener("click", () => {
    const question = flashFrontInput.value.trim();
    const answer = flashBackInput.value.trim();

    if (question && answer) {
      const added = {
        question: question,
        answer: answer,
        state: "neutral",
      };
      flashcards.push(added);
      localStorage.setItem("flashcards", JSON.stringify(flashcards));
      resetDisplayOrder();
      localStorage.setItem("displayOrder", JSON.stringify(displayOrder));
      currentIndex = 0;
      localStorage.setItem("currentIndex", JSON.stringify(currentIndex));

      loadContent();
      renderFlashCardTable();
      updateProgress();
      resetScores();

      if (currentIndex === flashcards.length - 1) {
        showFlashcard(flashcards.length - 1);
      }

      addFlashcardBtn.disabled = false;
    } else {
      alert("Flashcard front and back cannot be empty!");
    }
    addFlashcardBtn.focus();
  });

  const btnsDiv = document.createElement("div");
  btnsDiv.id = "groupBtns";
  btnsDiv.appendChild(saveBtn);
  actionButtons.appendChild(btnsDiv);

  flashcardTR.appendChild(flashcardFront);
  flashcardTR.appendChild(flashcardBack);
  flashcardTR.appendChild(actionButtons);
  flashcardTable.appendChild(flashcardTR);
});

editDialog.addEventListener("close", () => {
  addFlashcardBtn.disabled = false;
  renderFlashCardTable();
});

editFlashcardBtn.addEventListener("click", () => {
  editDialog.showModal();
  addFlashcardBtn.focus();
});

closeEditBtn.addEventListener("click", () => {
  editDialog.close();
});

function renderFlashCardTable() {
  flashcardTable.innerHTML = `
    <tr>
      <th>Flashcard front</th>
      <th>Flashcard back</th>
      <th>Action buttons</th>
    </tr>
  `;
  for (let i = 0; i < flashcards.length; i++) {
    updateFlashcardTable(i);
  }
}

shuffleBtn.addEventListener("click", () => {
  shuffleFlashcards();
  resetScores();
});

function shuffleFlashcards() {
  currentIndex = 0;
  localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
  displayOrder = shuffleArray(displayOrder);
  localStorage.setItem("displayOrder", JSON.stringify(displayOrder));
  loadContent();
  updateProgress();
  snackbar.className = "show";
  setTimeout(() => {
    snackbar.className = snackbar.className.replace("show", "");
  }, 2000);
}

function shuffleArray(array) {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    let rand = getRandIntInclusive(0, i);
    [shuffled[i], shuffled[rand]] = [shuffled[rand], shuffled[i]];
  }
  return shuffled;
}

function getRandIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handleButtons(index) {
  if (flashcards[index].state === "neutral") {
    correctBtn.disabled = false;
    incorrectBtn.disabled = false;
  } else if (flashcards[index].state === "correct") {
    correctBtn.disabled = true;
    incorrectBtn.disabled = false;
  } else {
    correctBtn.disabled = false;
    incorrectBtn.disabled = true;
  }
}

function updateScore(index, state) {
  const prevState = flashcards[index].state;

  if (state === "correct") {
    if (prevState === "neutral") {
      correct++;
    } else if (prevState === "incorrect") {
      correct++;
      incorrect--;
    }
    flashcards[index].state = "correct";
  } else {
    if (prevState === "neutral") {
      incorrect++;
    } else if (prevState === "correct") {
      correct--;
      incorrect++;
    }
    flashcards[index].state = "incorrect";
  }

  localStorage.setItem("flashcards", JSON.stringify(flashcards));
  localStorage.setItem("correct", JSON.stringify(correct));
  localStorage.setItem("incorrect", JSON.stringify(incorrect));

  updateScoreDisplay();
  handleButtons(index);
}

function updateScoreDisplay() {
  scoreDisplay.innerHTML = `Correct: ${correct} | Incorrect: ${incorrect}`;
}

function resetScores() {
  correct = 0;
  incorrect = 0;
  flashcards.forEach((card) => (card.state = "neutral"));

  localStorage.setItem("flashcards", JSON.stringify(flashcards));
  localStorage.setItem("correct", JSON.stringify(correct));
  localStorage.setItem("incorrect", JSON.stringify(incorrect));

  correctBtn.disabled = false;
  incorrectBtn.disabled = false;

  updateScoreDisplay();
}

correctBtn.addEventListener("click", () => {
  if (currentIndex < flashcards.length) {
    updateScore(displayIndex, "correct");
  }
  nextBtn.click();
});

incorrectBtn.addEventListener("click", () => {
  if (currentIndex < flashcards.length) {
    updateScore(displayIndex, "incorrect");
  }
  nextBtn.click();
});

document.addEventListener("keydown", function (event) {
  const active = document.activeElement;

  if (event.ctrlKey || event.metaKey || event.altKey) return;

  if (
    active.tagName === "INPUT" ||
    active.tagName === "TEXTAREA" ||
    active.isContentEditable
  )
    return;

  switch (event.key) {
    case "S":
    case "s":
      shuffleFlashcards();
      break;
    case "E":
    case "e":
      editDialog.showModal();
      addFlashcardBtn.focus();
      break;
    case "A":
    case "a":
    case "ArrowLeft":
      prevBtn.click();
      break;
    case "D":
    case "d":
    case "ArrowRight":
      nextBtn.click();
      break;
    case "F":
    case "f":
      flipFlashCard();
      break;
  }
});
