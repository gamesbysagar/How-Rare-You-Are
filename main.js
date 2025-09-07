

/* Loading page*/
const challangeFriendsText = document.getElementById('challange-friends-text');
const startButton = document.getElementById('start-button');
const startCard = document.getElementById('start-card');
/* Region and Age selection */
const regionSelector = document.querySelector(".region-and-age-selector");
const rasButton = document.querySelector('.region-and-age-submit');
/* questions page */
const questionCard = document.getElementById('question-card');
const questionCounterText = document.getElementById('q-count-text');
const questionText = document.getElementById('question');
/* next button/progress bar */
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const yesButton = document.getElementById('yes');
const noButton = document.getElementById('no');
/* rarity card page */
const rarityPage = document.getElementById('rarity-page');



/* Variables */
let progress = 0;
let index = 0;
let charIndex = 0;
let typingSpeed = 90;
let isDeleting = false;
let questionIndex = 0;
let totalQuestions = 15;

let yes_selected = false;
let no_selected = false;
let anyButtonSelected = false;

let progressGrowth = 0;

let answer_arr = [];
let score = 1;

let questionsArray = [];

fetch('questions.json')
  .then(res => res.json())
  .then(data => {
    questionsArray = data;
    // for check if loaded
    console.log(questionsArray);
    }
  )
  .catch(err => console.error(err));


/* Home Page Texts */
const texts = [
  "Ready to play!",
  "Challenge your friends!",
  "Just answer questions!"
];

/* Start Button */
startButton.addEventListener('click', function () {
  setTimeout(() => {
    startCard.style.display = "none";
    regionSelector.style.display = "flex";
    rasButton.style.display = "inline";
  }, 300);
});

rasButton.addEventListener("click", function() {
  setTimeout(() => {
  rasButton.style.display = 'none';
  regionSelector.style.display = 'none';
  questionCard.style.display = 'flex';
  progressContainer.style.display = 'flex';
  loadQuestionCounter();
  loadQuestion();
  }, 500);
});

/* Button Events */
yesButton.addEventListener('click', function () {
  yes_selected = true;
  no_selected = false;
  anyButtonSelected = true;
});


noButton.addEventListener('click', () => {
  yes_selected = false;
  no_selected = true;
  anyButtonSelected = true;
});

/* Progress click */
progressContainer.addEventListener("click", () => {
  if (anyButtonSelected) {
    checkWhichButton();
    anyButtonSelected = false; // reset
   progressShow();
    loadQuestionCounter();
    loadQuestion();
  } else {
      alert("Please select Yes or No before proceeding!");
  }
});

/* Question counter */
function loadQuestionCounter() {
  let questionCounter = questionIndex + 1;
  if (questionCounter <= totalQuestions) {
    questionCounterText.textContent = "Question " + questionCounter;
  }
}

/* Load questions */
function loadQuestion() {
  checkIfLastQuestion();
  if (questionIndex < totalQuestions) {
    let currentQuestion = questionsArray[questionIndex].question;
    questionText.textContent = ""; // clear before typing

    let i = 0;
    function typeWriter() {
      if (i < currentQuestion.length) {
        questionText.textContent += currentQuestion.charAt(i);
        i++;
        setTimeout(typeWriter, 50); // typing speed
      }
    }
    typeWriter();

    questionIndex++;
  } else {
    finishQuiz();
  }
}

/* Check selected button */
function checkWhichButton() {
  let currentQ = questionsArray[questionIndex]; // last asked question
  if (yes_selected) {
    console.log("Yes selected for question " + currentQ.id);
answer_arr.push(currentQ.globalAverage);
     // add weight
  } else if (no_selected) {
    console.log("No selected for question " + currentQ.id);
    answer_arr.push(1 - (currentQ.globalAverage));
    // no weight added
  }
  updateScore();
  yes_selected = false;
  no_selected = false;
}

function updateScore() {
  score *= answer_arr[answer_arr.length - 1];
}

function finalRarityCalc (){
  let rarityInNumber = score; 
  let oneInX = 1 / rarityInNumber; 
  return oneInX;
}

function finishQuiz() {
  progressShow();
  // delay alert by 300ms
  setTimeout(() => {
    progressContainer.style.display = "none";
    questionCard.style.display = "none";
    rarityPage.style.display = "flex";
    rarityPageCreation();
     }, 300);
}

function progressShow () {
  let devider = 100 / totalQuestions;
  progressGrowth += devider;
  progressBar.style.width = progressGrowth + "%";
}

function checkIfLastQuestion() {
  if (questionIndex + 1 === totalQuestions) {
    progressText.textContent = "CHECK!";
  }
}

function rarityPageCreation () {
  let finalRarity = finalRarityCalc();
  const rarityText = document.getElementById('rarity-text');
  rarityText.textContent = "1 in " + Math.round(finalRarity);
}

/* Questions */

/* Typing animation */
type();
function type() {
  const currentText = texts[index];
  const element = challangeFriendsText; // typing here

  if (!isDeleting && charIndex < currentText.length) {
    element.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
    setTimeout(type, typingSpeed);
  } else if (isDeleting && charIndex > 0) {
    element.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    setTimeout(type, typingSpeed / 2);
  } else {
    if (!isDeleting) {
      isDeleting = true;
      setTimeout(type, 1000); // wait before deleting
    } else {
      isDeleting = false;
      index = (index + 1) % texts.length; // move to next text
      setTimeout(type, 270);
    }
  }
}
