let userScore = 0;
let compScore = 0;
const userScore_span = document.getElementById("user-scores");
const compScore_span = document.getElementById("computer-scores");
const result_div = document.getElementById("result");
const user_id = document.getElementById("user");
const comp_id = document.getElementById("comp");
const element_selected_user = document.getElementById("element-selected-user");
const element_selected_comp = document.getElementById("element-selected-comp");
const quiz_board = document.getElementsByClassName("quiz-board");

const question_id = document.getElementById("question_id");
const choice1_id = document.getElementById("choice1_id");
const choice2_id = document.getElementById("choice2_id");
const quizResult = document.getElementById("quiz-result");
const choicesDiv = document.getElementsByClassName("choices");

function quiz() {
    const currentQuestionIndex = Math.floor(Math.random() * 20) + 1; //random number
    fetch("/api/questions")
      .then((response) => response.json())
      .then((data) => {
        const json_question = data.questions[currentQuestionIndex]["question"];
        const json_quiz_choice_1 =
          data.questions[currentQuestionIndex]["choices"][0];
        const json_quiz_choice_2 =
          data.questions[currentQuestionIndex]["choices"][1];
        const json_answer = data.questions[currentQuestionIndex]["answer"];
  
        question_id.innerHTML = json_question;
        choice1_id.innerHTML = json_quiz_choice_1;
        choice2_id.innerHTML = json_quiz_choice_2;
  
        choice1_id.addEventListener("click", function () {
          checkAnswer(json_quiz_choice_1, json_answer);
        });
  
        choice2_id.addEventListener("click", function () {
          checkAnswer(json_quiz_choice_2, json_answer);
        });
      })
      .catch((error) => {
        console.error("Error fetching the questions:", error);
      });
  
  }

  
function displayResult(userChoice, computerChoice, result) {
  const userWord = userChoice;
  const compWord = computerChoice;

  quizResult.innerHTML = "";

  //show the selected element
  element_selected_user.innerHTML = "";
  element_selected_user.appendChild(displaySelectedElement(userWord));

  element_selected_comp.innerHTML = "";
  element_selected_comp.appendChild(displaySelectedElement(compWord));

  //display result
  if (result === "win") {
    hideQuizBoard();
    userScore++;
    user_id.style.backgroundColor = "blue";
    comp_id.style.backgroundColor = "brown";
    result_div.innerHTML = `${userWord} beats ${compWord}. You win! 🎉`;
  } else if (result === "loss") {
    compScore++;
    user_id.style.backgroundColor = "brown";
    comp_id.style.backgroundColor = "blue";
    result_div.innerHTML = `${compWord} beats ${userWord}. You lost! 😔 Pass the quiz to play again! `;
    hideChoicesDiv();
    quiz();
    displayQuizBoard();
    

  } else {
    hideQuizBoard();
    result_div.innerHTML = `${userWord} equals ${compWord}. It's a draw!`;
  }

  userScore_span.innerHTML = userScore;
  compScore_span.innerHTML = compScore;
}


function checkAnswer(choice, answer) {
  var selectedAnswer = choice;
  var realAnswer = answer;
  var result = "";
  console.log(selectedAnswer, realAnswer);

  if (selectedAnswer == realAnswer) {
    result = "Correct";
    hideQuizBoard();
    displayChoicesDiv();
    result_div.innerHTML = "Correct answer ! Make your move again ! ";
  } else {
    result = "Try Again !";
  }
  quizResult.innerHTML = result;
}

function displayQuizBoard(){
    for (var i = 0; i < quiz_board.length; i += 1) {
        quiz_board[i].style.display = "block";
      }
}

function hideQuizBoard() {
  for (var i = 0; i < quiz_board.length; i += 1) {
    quiz_board[i].style.display = "none";
  }
}

function displayChoicesDiv() {
    for (var i = 0; i < choicesDiv.length; i += 1) {
        choicesDiv[i].style.display = "block";
    }
  }

function hideChoicesDiv() {
    for (var i = 0; i < choicesDiv.length; i += 1) {
        choicesDiv[i].style.display = "none";
    }
  }
  

function displaySelectedElement(choice) {
  var img = document.createElement("IMG");
  if (choice === "Paper") {
    img.src = "static/" + "paper.png";
  } else if (choice === "Rock") {
    img.src = "static/" + "rock.png";
  } else {
    img.src = "static/" + "scissor.png";
  }
  return img;
}

function playGame(userChoice) {
  fetch("/play", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userChoice: userChoice }),
  })
    .then((response) => response.json())
    .then((data) => {
      displayResult(data.userChoice, data.computerChoice, data.result);
    });
}

document.getElementById("r").addEventListener("click", function () {
  playGame("r");
});
document.getElementById("p").addEventListener("click", function () {
  playGame("p");
});
document.getElementById("s").addEventListener("click", function () {
  playGame("s");
});
