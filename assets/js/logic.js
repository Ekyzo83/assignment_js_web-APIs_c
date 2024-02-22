
// Reference DOM elements
var startButton = document.getElementById('start');
var questionTitle = document.getElementById('question-title');
var choicesContainer = document.getElementById('choices');
var feedback = document.getElementById('feedback');
var timerElement = document.getElementById('time');
var initialsInput = document.getElementById('initials');
var submitButton = document.getElementById('submit');

var currentQuestionIndex = 0;
var timeLeft = 60; // Initial time for the quiz (in seconds)
var timerInterval;

// Add event listener to start button
startButton.addEventListener('click', startQuiz);

// Function to start the quiz
function startQuiz() {
  // Hide the start screen
  document.getElementById('start-screen').classList.add('hide');

  // Show the questions section
  document.getElementById('questions').classList.remove('hide');

  // Start the timer
  startTimer();

  // Display the first question
  displayQuestion();
}

// Function to display a question
function displayQuestion() {
  var currentQuestion = questions[currentQuestionIndex];
  questionTitle.textContent = currentQuestion.title;
  choicesContainer.innerHTML = '';

  currentQuestion.choices.forEach(function(choice, index) {
    var choiceButton = document.createElement('button');
    choiceButton.textContent = choice;
    choiceButton.setAttribute('data-index', index);
    choiceButton.addEventListener('click', handleAnswerClick);
    choicesContainer.appendChild(choiceButton);
  });
}

// Function to handle click event on answer choices
function handleAnswerClick(event) {
  var choiceIndex = parseInt(event.target.getAttribute('data-index'));
  var selectedChoice = questions[currentQuestionIndex].choices[choiceIndex];

  // Play sound effect
  var audio = new Audio('Main\assets\sfx\correct.wav_effect.wav'); 
  audio.play();

  // Check if the selected choice is correct
  if (selectedChoice === questions[currentQuestionIndex].answer) {
    feedback.textContent = "Correct!";
  } else {
    feedback.textContent = "Wrong!";
    // If the answer is wrong, subtract time from the timer
    timeLeft -= 15;
    if (timeLeft < 0) {
      timeLeft = 0;
    }
  }

  // Move to the next question
  currentQuestionIndex++;

  // Check if all questions have been answered or the timer reaches 0
  if (currentQuestionIndex < questions.length && timeLeft > 0) {
    displayQuestion();
  } else {
    // End the quiz
    endQuiz();
  }
}

// Function to start the timer
function startTimer() {
  // Set up the timer interval to update every second
  timerInterval = setInterval(function() {
    // Update the timer element with the remaining time
    timerElement.textContent = timeLeft;

    // Check if time is up
    if (timeLeft === 0) {
      // End the quiz if time is up
      endQuiz();
    } else {
      // Decrement time left
      timeLeft--;
    }
  }, 1000);
}

// Function to end the quiz
function endQuiz() {
  // Stop the timer interval
  clearInterval(timerInterval);

  // Hide the questions section
  document.getElementById('questions').classList.add('hide');

  // Show the end screen
  var endScreen = document.getElementById('end-screen');
  endScreen.classList.remove('hide');

  // Display final score
  var finalScore = timeLeft; // You can use the remaining time as the final score
  document.getElementById('final-score').textContent = finalScore;

  // Show initials input and submit button
  document.getElementById('initials-container').classList.remove('hide');
}

// Add event listener to submit button
submitButton.addEventListener('click', function() {
  // Get initials entered by the user
  var initials = initialsInput.value.trim();

  // Validate initials
  if (initials === "") {
    alert("Please enter your initials.");
    return;
  }

  // Save initials and score to local storage
  var highscores = JSON.parse(localStorage.getItem("highscores")) || [];
  highscores.push({ initials: initials, score: timeLeft });
  localStorage.setItem("highscores", JSON.stringify(highscores));

  // Redirect to highscores page
  window.location.href = "highscores.html";
});
