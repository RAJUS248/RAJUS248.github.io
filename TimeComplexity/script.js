// --- Configuration ---
// !!! IMPORTANT: THIS MUST BE CHANGED to the URL of your live server 
// where you securely call the Gemini API and return the 500 question JSON.
const API_ENDPOINT = '/.netlify/functions/generate-quiz'; 

const MAX_QUESTIONS = 50; // Expected number of questions from the API

let allQuizData = []; // Will store the 500 questions fetched from the API
let filteredQuizData = []; 
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let selectedLanguage = 'java'; 

// DOM Elements
const languageSelect = document.getElementById('language-select');
const questionNumberElement = document.getElementById('question-number');
const codeSnippetElement = document.getElementById('code-snippet');
const optionsContainer = document.getElementById('options-container');
const feedbackElement = document.getElementById('feedback');
const nextButton = document.getElementById('next-button');
const resultArea = document.getElementById('result-area');
const quizArea = document.getElementById('quiz-question-area');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const quizControls = document.getElementById('quiz-controls');

// Function to shuffle an array (remains necessary for options)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * FETCHES 500 unique questions from the server/API.
 * This is the function that replaces the repetitive local generation.
 */
async function fetchQuizData() {
    try {
        questionNumberElement.textContent = "Loading 500 unique questions...";
        quizArea.style.display = 'block';
        optionsContainer.innerHTML = '<h1>Please Wait... Attempting to load questions from server.</h1>';
        
        // This is the call that retrieves the automatically generated questions
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}. Did you deploy the backend?`);
        }
        
        allQuizData = await response.json();

        if (allQuizData.length < 490) { // Safety check
             console.warn(`Received only ${allQuizData.length} questions. Check API prompt/configuration.`);
        }
        
        // Use all fetched data and initialize
        filteredQuizData = allQuizData;
        shuffleArray(filteredQuizData); 
        loadQuestion();

    } catch (error) {
        console.error("Failed to fetch quiz data from API:", error);
        // Show the user an error if the API call fails
        optionsContainer.innerHTML = `<h1>Error: Could not load questions.</h1><p>Check the console for API endpoint details. Did you replace 'YOUR_SERVER_URL'?</p>`;
        quizControls.style.display = 'none';
        nextButton.style.display = 'none';
    }
}

// Function to load a question (Adjusted for API data)
function loadQuestion() {
    if (filteredQuizData.length === 0) return; 

    if (currentQuestionIndex >= filteredQuizData.length) {
        showResults(true); 
        return; 
    }
    
    answered = false;
    feedbackElement.style.display = 'none';
    optionsContainer.innerHTML = '';
    nextButton.style.display = 'none';

    const currentQuestion = filteredQuizData[currentQuestionIndex];
    
    // Use the language and code directly from the API object
    // Assuming the API returns 'language' as 'java', 'python', or 'c'
    selectedLanguage = languageSelect.value;
    const langForSnippet = currentQuestion.language.toLowerCase(); 

    questionNumberElement.textContent = `Question ${currentQuestionIndex + 1} / ${filteredQuizData.length}`;
    
    // Set the code snippet, using data directly from the API
    codeSnippetElement.textContent = currentQuestion.code;
    codeSnippetElement.className = ''; 
    codeSnippetElement.classList.add(`language-${langForSnippet}`);
    Prism.highlightElement(codeSnippetElement);

    let shuffledOptions = [...currentQuestion.options];
    shuffleArray(shuffledOptions);

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('btn', 'option-btn');
        button.textContent = option;
        button.value = option;
        button.onclick = () => checkAnswer(button, option, currentQuestion);
        optionsContainer.appendChild(button);
    });
    
    quizArea.style.display = 'block';
    resultArea.style.display = 'none';
    quizControls.style.display = 'flex';
}

function checkAnswer(selectedButton, selectedOption, question) {
    if (answered) return;
    answered = true;

    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
    });

    if (selectedOption === question.complexity) { 
        score++;
        selectedButton.classList.add('correct');
        feedbackElement.classList.remove('wrong');
        feedbackElement.classList.add('correct');
        feedbackElement.innerHTML = `**Correct!** 🎉 ${question.explanation}`;
    } else {
        selectedButton.classList.add('wrong');
        
        document.querySelectorAll('.option-btn').forEach(btn => {
            if (btn.value === question.complexity) {
                btn.classList.add('correct');
            }
        });

        feedbackElement.classList.remove('correct');
        feedbackElement.classList.add('wrong');
        feedbackElement.innerHTML = `**Wrong.** 😔 The correct answer is **${question.complexity}**. <div class="explanation">${question.explanation}</div>`;
    }

    feedbackElement.style.display = 'block';
    nextButton.style.display = 'block';
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function handleLanguageChange() {
    // Changing language will only affect highlighting, not the question logic (API questions have a fixed language in their code)
    loadQuestion(); 
}

function showResults(isCompleted = false) {
    quizArea.style.display = 'none';
    quizControls.style.display = 'none';
    resultArea.style.display = 'block';
    
    if (isCompleted) {
        finalScoreElement.innerHTML = `**CONGRATULATIONS!** You completed all ${MAX_QUESTIONS} unique questions.<br>Your final score: **${score} / ${currentQuestionIndex}**`;
    } else {
        finalScoreElement.textContent = `You correctly answered ${score} questions out of ${currentQuestionIndex} questions attempted.`;
    }
}

function restartQuiz(fullRestart = true) {
    if (fullRestart) {
        // Fetch new data only if restarting entirely
        currentQuestionIndex = 0;
        score = 0;
        fetchQuizData(); 
    } else {
        loadQuestion();
    }

    resultArea.style.display = 'none';
    quizArea.style.display = 'block';
    quizControls.style.display = 'flex'; 
}

// Event Listeners
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', () => restartQuiz(true));
languageSelect.addEventListener('change', handleLanguageChange);

// Initial call to start the quiz
document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch from the API endpoint
    if (typeof Prism !== 'undefined') {
        fetchQuizData();
    } else {
        console.error("Prism.js not loaded. Syntax highlighting won't work.");
        fetchQuizData();
    }
});

