// Select Elements
let countSpan = document.querySelector(".count span");
let countConatiner = document.querySelector(".count");
let bulletConatiner = document.querySelector(".bullets");
let bulletSpanConatiner = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let btnConatiner = document.querySelector(".btn");
let nextQBtn = document.querySelector("#next");
let markQBtn = document.querySelector("#mark");
let previousQBtn = document.querySelector("#previous");
let submitBtn = document.querySelector("#submit");
let aside = document.querySelector("aside");
let resultArea = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

//Set Options
let currentIndex = 0;
let countDownInterval;
let userAnswers = [];
let objRightAnswers = [];
/*----------------------------------------------------------------------------*/
// get student data
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get("email");
let studentsData = JSON.parse(localStorage.students);
var currentstudent = studentsData.find((obj) => obj["email"] === email);
/*----------------------------------------------------------------------------*/
// Question Function Constructor
function Question(
  _title,
  _answer_1,
  _answer_2,
  _answer_3,
  _answer_4,
  _right_answer
) {
  this.title = _title;
  this.answer_1 = new Answer(_answer_1).answer;
  this.answer_2 = new Answer(_answer_2).answer;
  this.answer_3 = new Answer(_answer_3).answer;
  this.answer_4 = new Answer(_answer_4).answer;
  this.right_answer = new Answer(_right_answer).answer;
}

// Answer Function Constructor
function Answer(_answer) {
  this.answer = _answer;
}
/*----------------------------------------------------------------------------*/
// XMLHttp Request
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.open("GET", "./exam/questions.json", true);
  myRequest.send();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionJsonObj = JSON.parse(this.responseText);
      let questionObject = [];
      for (let i = 0; i < questionJsonObj.length; i++) {
        questionObject.push(
          new Question(
            questionJsonObj[i].title,
            questionJsonObj[i].answer_1,
            questionJsonObj[i].answer_2,
            questionJsonObj[i].answer_3,
            questionJsonObj[i].answer_4,
            questionJsonObj[i].right_answer
          )
        );
      }

      shuffle(questionObject);
      let questionsCount = questionObject.length;

      for (let i = 0; i < questionsCount; i++) {
        objRightAnswers[i] = questionObject[i].right_answer;
      }

      // Create Bullets + set Question Count
      createBullets(questionsCount);

      // Add Question data
      addQuestionData(questionObject[currentIndex], questionsCount);
      currentQuestionNo(currentIndex);

      // Start CountDown
      countDown(60 * 10);
      /*--------------------------------------------------------------------*/
      // Next Question Btn
      nextQBtn.onclick = () => {
        currentIndex++;

        // Remove Previous Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // Add Question Data
        addQuestionData(questionObject[currentIndex], questionsCount);

        // Add Question Number
        currentQuestionNo(currentIndex);

        // Handle Bullets
        handleBullets();

        if (currentIndex >= 1) {
          previousQBtn.style.visibility = "visible";
        }
        if (currentIndex === questionsCount - 1) {
          nextQBtn.style.visibility = "hidden";
        }
      };
      /*--------------------------------------------------------------------*/
      // Previous Question Btn
      previousQBtn.onclick = () => {
        if (currentIndex > 0) {
          currentIndex--;

          // Remove Previous Question
          quizArea.innerHTML = "";
          answersArea.innerHTML = "";

          // Add Question Data
          addQuestionData(questionObject[currentIndex], questionsCount);

          // Add Question Number
          currentQuestionNo(currentIndex);

          // Handle Bullets
          handleBullets();
        }

        if (currentIndex === 0) {
          previousQBtn.style.visibility = "hidden";
        }
        if (currentIndex < questionsCount - 1) {
          nextQBtn.style.visibility = "visible";
        }
      };
      /*--------------------------------------------------------------------*/
      // Mark Question Btn
      markQBtn.addEventListener("click", function () {
        addToMark(questionObject[currentIndex]);
      });
      /*--------------------------------------------------------------------*/
      // Go To Marked Question
      aside.addEventListener("click", function (event) {
        goToMarkedQuestion(event, questionObject);
      });
      /*--------------------------------------------------------------------*/
      // Submit Question Btn
      submitBtn.onclick = () => {
        let userRightAnswers = 0;
        userRightAnswers = calcResult();

        studentsData.map((obj) => {
          if (obj["email"] === email) {
            obj.result = userRightAnswers;
            obj.tookExam = true;
          }
        });
        localStorage.setItem("students", JSON.stringify(studentsData));

        navigateToResult();
      };
    }
  };
}
getQuestions();
/*----------------------------------------------------------------------------*/
// Current Question Number
function currentQuestionNo(currentIndex) {
  countSpan.innerHTML = currentIndex + 1;
}
/*----------------------------------------------------------------------------*/
// Add Question Data
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create h2 Questions Title
    let questionTitle = document.createElement("h2");
    // Create h2 Questions Text
    let questionText = document.createTextNode(obj["title"]);
    // Append Text To h2
    questionTitle.appendChild(questionText);
    // Append h2 to Quiz Area
    quizArea.appendChild(questionTitle);

    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      // Create Main Answer div
      let mainDiv = document.createElement("div");
      // Add Class To Main div
      mainDiv.className = "answer";
      // Create Radio Input
      let radioInput = document.createElement("input");
      // Add Type + Name + ID + data + Attribute
      radioInput.name = "questions";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Create Label
      let answerlabel = document.createElement("label");

      // Add For Attribute
      answerlabel.htmlFor = `answer_${i}`;

      // Create Label Text
      let labelText = document.createTextNode(obj[`answer_${i}`]);

      // Add Text To Label
      answerlabel.appendChild(labelText);

      // Add Input To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(answerlabel);

      // Add All Div To Main Answers Area
      answersArea.appendChild(mainDiv);

      // Check if there is a selected answer for this question
      if (userAnswers[currentIndex] === obj[`answer_${i}`]) {
        radioInput.checked = true;
      }

      radioInput.addEventListener("change", function () {
        let choosenAnswer = this.dataset.answer;

        // Store the user's answer in the array
        userAnswers[currentIndex] = choosenAnswer;
      });
    }
  }
}
/*----------------------------------------------------------------------------*/
// Create Bullets
function createBullets(num) {
  for (let i = 0; i < num; i++) {
    // Create Span
    let theBullet = document.createElement("span");
    // Check if Its First Span
    if (i === 0) {
      theBullet.className = "on";
    }
    // Apend Bullets To Main Nullet Conatiner
    bulletSpanConatiner.appendChild(theBullet);
  }
}
/*----------------------------------------------------------------------------*/
// Handle Bullets
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);

  for (let index = 0; index < arrayOfSpans.length; index++) {
    let span = arrayOfSpans[index];

    if (currentIndex === index) {
      span.className = "on";
    } else if (currentIndex + 1 === index) {
      span.className = "";
    } else if (currentIndex < index) {
      span.className = "";
    } else if (currentIndex > index) {
      span.className = "on";
    }
  }
}
/*----------------------------------------------------------------------------*/
// Count Down
function countDown(duration) {
  let minutes, seconds;
  countDownInterval = setInterval(function () {
    minutes = parseInt(duration / 60);
    seconds = parseInt(duration % 60);

    minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    countdownElement.innerHTML = `${minutes}:${seconds}`;

    if (--duration < 0) {
      clearInterval(countDownInterval);
      studentsData.map((obj) => {
        if (obj["email"] === email) {
          obj.result = 0;
          obj.tookExam = true;
        }
      });
      localStorage.setItem("students", JSON.stringify(studentsData));
      navigateToTimeOut();
    }
  }, 1000);
}
/*----------------------------------------------------------------------------*/
// Mark Question
function addToMark() {
  const markedSpan = document.querySelector(
    `.marked[target='${currentIndex}']`
  );
  if (!markedSpan) {
    aside.innerHTML += `<span class="marked" target='${currentIndex}'> Question  ${
      currentIndex + 1
    } <button onclick="deletecurrent(${currentIndex})">Remove</button></span>`;
  }
}
/*----------------------------------------------------------------------------*/
// Remove the marked question
function deletecurrent(index) {
  const markedSpan = document.querySelector(`.marked[target='${index}']`);
  if (markedSpan) {
    markedSpan.remove();
  }
}
/*----------------------------------------------------------------------------*/
// Function to calculate result
function calcResult() {
  let userRightAnswer = 0;
  for (let i = 0; i < 10; i++) {
    if (userAnswers[i] === objRightAnswers[i]) {
      userRightAnswer++;
    }
  }
  return userRightAnswer;
}
/*----------------------------------------------------------------------------*/
// Function to Rearrange Questions
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
/*----------------------------------------------------------------------------*/
function goToMarkedQuestion(event, questionObject) {
  // Check if the clicked element is a marked question span
  if (event.target.classList.contains("marked")) {
    // Extract the target index from the marked span's 'target' attribute
    let targetIndex = parseInt(event.target.getAttribute("target"));

    // Change the current question index to the marked question index
    currentIndex = targetIndex;

    // Update the quiz area with the marked question data
    quizArea.innerHTML = "";
    answersArea.innerHTML = "";
    addQuestionData(questionObject[currentIndex], questionObject.length);
    currentQuestionNo(currentIndex);

    // Handle Bullets
    handleBullets();

    // handle visibility of next and previous buttons
    previousQBtn.style.visibility = currentIndex === 0 ? "hidden" : "visible";
    nextQBtn.style.visibility =
      currentIndex === questionObject.length - 1 ? "hidden" : "visible";
  }
}
/*----------------------------------------------------------------------------*/
// Function to Redirect the user to the Result page
function navigateToResult() {
  window.location.replace(`result.html?email=${email}`);
}
/*----------------------------------------------------------------------------*/
// Function to Redirect the user to the Time Out page
function navigateToTimeOut() {
  window.location.replace(`timeout.html?email=${email}`);
}
/*----------------------------------------------------------------------------*/
