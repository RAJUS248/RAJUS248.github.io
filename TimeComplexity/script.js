// --- Code Generation Helpers ---

// Pool of random words for function and variable names
const namePool = ["calc", "process", "data", "array", "list", "check", "sort", "find", "handle", "value", "count", "idx", "temp", "item", "element"];

/**
 * Generates a unique, descriptive function or variable name.
 */
function generateRandomName(isFunction = false) {
    const part1 = namePool[Math.floor(Math.random() * namePool.length)];
    const part2 = namePool[Math.floor(Math.random() * namePool.length)];
    
    // CamelCase for readability
    const name = part1 + part2.charAt(0).toUpperCase() + part2.slice(1);
    
    // Prefix with 'get' or 'run' for functions
    if (isFunction) {
        return (Math.random() > 0.5 ? "get" : "run") + name.charAt(0).toUpperCase() + name.slice(1);
    }
    return name;
}


// Function to generate the code snippets based on complexity type, language, and UNIQUE NAMES
function generateCode(type, lang, names) {
    // Use the pre-generated unique names for this question
    const { funcName, varName, arrName } = names;

    let code = {};
    
    // --- O(1) TEMPLATES ---
    if (type === 'O(1)-1') {
        code.java = `public int ${funcName}(int[] ${arrName}) {
    // Accessing a fixed index
    return ${arrName}[0];
}`;
        code.python = `def ${funcName}(${arrName}):
    # Accessing a fixed index
    return ${arrName}[0]`;
        code.c = `int ${funcName}(int ${arrName}[], int size) {
    // Accessing a fixed index
    return ${arrName}[0];
}`;
    } else if (type === 'O(1)-2') {
        code.java = `public int ${funcName}(int ${varName}, int constant) {
    int sum = ${varName} + constant;
    return sum * 5;
}`;
        code.python = `def ${funcName}(${varName}, constant):
    sum_val = ${varName} + constant
    return sum_val * 5`;
        code.c = `int ${funcName}(int ${varName}, int constant) {
    int sum = ${varName} + constant;
    return sum * 5;
}`;
    }

    // --- O(log N) TEMPLATES ---
    else if (type === 'O(log N)-1') {
        code.java = `public void ${funcName}(int N) {
    for (int i = 1; i < N; i *= 2) { 
        System.out.println("Processing...");
    }
}`;
        code.python = `def ${funcName}(N):
    i = 1
    while i < N:
        print("Processing...")
        i *= 2`;
        code.c = `void ${funcName}(int N) {
    for (int i = 1; i < N; i *= 2) { 
        printf("Processing...\\n");
    }
}`;
    }

    // --- O(N) TEMPLATES ---
    else if (type === 'O(N)-1') {
        code.java = `public int ${funcName}(int[] ${arrName}) {
    int ${varName} = 0;
    for (int i = 0; i < ${arrName}.length; i++) {
        ${varName} += ${arrName}[i];
    }
    return ${varName};
}`;
        code.python = `def ${funcName}(${arrName}):
    ${varName} = 0
    for x in ${arrName}:
        ${varName} += x
    return ${varName}`;
        code.c = `int ${funcName}(int ${arrName}[], int size) {
    int ${varName} = 0;
    for (int i = 0; i < size; i++) {
        ${varName} += ${arrName}[i];
    }
    return ${varName};
}`;
    } else if (type === 'O(N)-2') {
        code.java = `public void ${funcName}(int N) {
    for (int i = 0; i < N; i++) {
        // O(1) operation
    }
    for (int j = 0; j < N * 3; j++) { 
        // Another O(N) loop
    }
}`;
        code.python = `def ${funcName}(N):
    for i in range(N):
        # O(1) operation
        pass
    for j in range(N * 3):
        # Another O(N) loop
        pass`;
        code.c = `void ${funcName}(int N) {
    for (int i = 0; i < N; i++) {
        // O(1) operation
    }
    for (int j = 0; j < N * 3; j++) {
        // Another O(N) loop
    }
}`;
    }

    // --- O(N log N) TEMPLATES ---
    else if (type === 'O(N log N)-1') {
        code.java = `public void ${funcName}(int N) {
    for (int i = 0; i < N; i++) {
        for (int j = 1; j < N; j *= 2) { // O(log N) inner loop
            System.out.println("Iteration: " + i);
        }
    }
}`;
        code.python = `def ${funcName}(N):
    for i in range(N):
        j = 1
        while j < N: # O(log N) inner loop
            print("Iteration:", i)
            j *= 2`;
        code.c = `void ${funcName}(int N) {
    for (int i = 0; i < N; i++) {
        for (int j = 1; j < N; j *= 2) { // O(log N) inner loop
            printf("Iteration: %d\\n", i);
        }
    }
}`;
    }
    
    // --- O(N^2) TEMPLATES ---
    else if (type === 'O(N^2)-1') {
        code.java = `public void ${funcName}(int N) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) { // Standard Nested Loop
            // O(1) operation
        }
    }
}`;
        code.python = `def ${funcName}(N):
    for i in range(N):
        for j in range(N): # Standard Nested Loop
            // O(1) operation
            pass`;
        code.c = `void ${funcName}(int N) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) { // Standard Nested Loop
            // O(1) operation
        }
    }
}`;
    } else if (type === 'O(N^2)-2') {
        code.java = `public void ${funcName}(int N) {
    for (int i = 0; i < N; i++) {
        for (int j = i; j < N; j++) { // Triangular Nested Loop
            System.out.println("Pair: " + i + "," + j);
        }
    }
}`;
        code.python = `def ${funcName}(N):
    for i in range(N):
        for j in range(i, N): # Triangular Nested Loop
            print(f"Pair: {i},{j}")
`;
        code.c = `void ${funcName}(int N) {
    for (int i = 0; i < N; i++) {
        for (int j = i; j < N; j++) { // Triangular Nested Loop
            printf("Pair: %d,%d\\n", i, j);
        }
    }
}`;
    }
    
    // --- O(N^3) TEMPLATES ---
    else if (type === 'O(N^3)-1') {
        code.java = `public void ${funcName}(int N) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            for (int k = 0; k < N; k++) { // Triple Nested Loop
                // O(1) operation
            }
        }
    }
}`;
        code.python = `def ${funcName}(N):
    for i in range(N):
        for j in range(N):
            for k in range(N): # Triple Nested Loop
                // O(1) operation
                pass`;
        code.c = `void ${funcName}(int N) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            for (int k = 0; k < N; k++) { // Triple Nested Loop
                // O(1) operation
            }
        }
    }
}`;
    }
    
    return code[lang]; 
}

// The base set of 9 complexity templates (without code)
const baseQuizTemplates = [
    { type: 'O(1)-1', answer: "O(1)", options: ["O(N)", "O(1)", "O(log N)", "O(N^2)"], explanation: "Accessing an array element by a known index is a single, constant-time operation (**O(1)**), regardless of the array's size." },
    { type: 'O(1)-2', answer: "O(1)", options: ["O(N log N)", "O(N^2)", "O(1)", "O(N)"], explanation: "Basic arithmetic operations and variable assignments take a fixed amount of time, resulting in **O(1)** constant complexity." },
    { type: 'O(log N)-1', answer: "O(log N)", options: ["O(N)", "O(N log N)", "O(N^2)", "O(log N)"], explanation: "The loop variable is repeatedly multiplied by 2, causing the number of iterations to scale logarithmically, resulting in **O(log N)**." },
    { type: 'O(N)-1', answer: "O(N)", options: ["O(N)", "O(1)", "O($N^3$)", "O(N log N)"], explanation: "A single loop that iterates over the entire input array runs a number of times directly proportional to N, resulting in **O(N)** linear time." },
    { type: 'O(N)-2', answer: "O(N)", options: ["O(N^2)", "O(N)", "O(log N)", "O(1)"], explanation: "Sequential loops are additive. Since both loops are O(N), the total complexity is $O(N) + O(N)$, which simplifies to **O(N)**." },
    { type: 'O(N log N)-1', answer: "O(N log N)", options: ["O(N^2)", "O(N log N)", "O(N)", "O(log N)"], explanation: "The outer loop runs N times. The inner loop, which doubles its counter, runs $\text{log}(N)$ times. The total complexity is the product: **O(N log N)**." },
    { type: 'O(N^2)-1', answer: "O(N^2)", options: ["O(N)", "O(N log N)", "O(N^2)", "O($N^3$)"], explanation: "A standard nested loop where the inner loop runs a full N times for every N iteration of the outer loop, resulting in $N \times N = N^2$ operations." },
    { type: 'O(N^2)-2', answer: "O(N^2)", options: ["O(N^2)", "O(N)", "O(2^N)", "O(N log N)"], explanation: "Even a triangular nested loop ($N + (N-1) + ... + 1$) is still dominated by the $N^2$ term, which simplifies to **O(N^2)**." },
    { type: 'O(N^3)-1', answer: "O($N^3$)", options: ["O(N^2)", "O(N log N)", "O($N^3$)", "O(N!)"], explanation: "A triple nested loop means the operations are $N \times N \times N$, leading to cubic time complexity: **O($N^3$)**." }
];

// Generate 100 unique questions by shuffling and repeating the templates
const MAX_QUESTIONS = 100;
let allQuizData = [];

/**
 * Creates the bank of MAX_QUESTIONS, ensuring each has unique random names.
 * This guarantees 100 uniquely coded questions per cycle.
 */
function createQuizBank() {
    let tempBank = [];
    // Repeat and shuffle the 9 templates until we hit MAX_QUESTIONS
    for (let i = 0; i < MAX_QUESTIONS; i++) {
        const template = baseQuizTemplates[i % baseQuizTemplates.length];
        
        // **KEY CHANGE**: Generate unique names for this specific question object
        const uniqueNames = {
            funcName: generateRandomName(true),
            varName: generateRandomName(false),
            arrName: generateRandomName(false) + "List"
        };
        
        // Create a new question object combining template data and unique names
        tempBank.push({
            ...template,
            names: uniqueNames // Store the unique names with the question
        }); 
    }
    shuffleArray(tempBank);
    allQuizData = tempBank;
}

let filteredQuizData = []; 
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let selectedLanguage = 'java'; // Default language

// DOM Elements (Keep as is)
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

// Function to shuffle an array (Keep as is)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to filter and create the question set (Keep as is, now calls the improved createQuizBank)
function filterQuestions() {
    createQuizBank(); 
    filteredQuizData = allQuizData;
}

// Function to load a question
function loadQuestion() {
    // Infinite loop logic: When index reaches the end (100), reset and reshuffle
    if (currentQuestionIndex >= filteredQuizData.length) {
        currentQuestionIndex = 0; 
        filterQuestions(); // Regenerate a NEW set of 100 unique questions
    }
    
    answered = false;
    feedbackElement.style.display = 'none';
    optionsContainer.innerHTML = '';
    nextButton.style.display = 'none';

    const currentQuestion = filteredQuizData[currentQuestionIndex];
    
    // **KEY CHANGE**: Pass the unique names stored in the question object
    const generatedCode = generateCode(currentQuestion.type, selectedLanguage, currentQuestion.names);
    
    questionNumberElement.textContent = `Question ${currentQuestionIndex + 1} / ${filteredQuizData.length} (Infinite Mode)`;
    
    codeSnippetElement.textContent = generatedCode;
    
    // Update Prism.js classes and highlight
    codeSnippetElement.className = ''; 
    codeSnippetElement.classList.add(`language-${selectedLanguage}`);
    Prism.highlightElement(codeSnippetElement);


    // Create a copy of options and shuffle them
    let shuffledOptions = [...currentQuestion.options];
    shuffleArray(shuffledOptions);

    // Create option buttons
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

// (Keep all other functions: checkAnswer, nextQuestion, handleLanguageChange, showResults, restartQuiz, and all event listeners exactly as they were in the previous response.)

// Function to check the selected answer
function checkAnswer(selectedButton, selectedOption, question) {
    if (answered) return;
    answered = true;

    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
    });

    if (selectedOption === question.answer) {
        score++;
        selectedButton.classList.add('correct');
        feedbackElement.classList.remove('wrong');
        feedbackElement.classList.add('correct');
        feedbackElement.innerHTML = `**Correct!** 🎉 ${question.explanation}`;
    } else {
        selectedButton.classList.add('wrong');
        
        document.querySelectorAll('.option-btn').forEach(btn => {
            if (btn.value === question.answer) {
                btn.classList.add('correct');
            }
        });

        feedbackElement.classList.remove('correct');
        feedbackElement.classList.add('wrong');
        feedbackElement.innerHTML = `**Wrong.** 😔 The correct answer is **${question.answer}**. <div class="explanation">${question.explanation}</div>`;
    }

    feedbackElement.style.display = 'block';
    nextButton.style.display = 'block';
}

// Function to move to the next question
function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

// Function to handle language change
function handleLanguageChange() {
    selectedLanguage = languageSelect.value;
    restartQuiz(); 
}

// Function to show the final results 
function showResults() {
    quizArea.style.display = 'none';
    quizControls.style.display = 'none';
    resultArea.style.display = 'block';
    finalScoreElement.textContent = `You correctly answered ${score} questions out of ${currentQuestionIndex} questions attempted.`;
}

// Function to restart the quiz
function restartQuiz() {
    filterQuestions(); 
    currentQuestionIndex = 0;
    score = 0;
    resultArea.style.display = 'none';
    quizArea.style.display = 'block';
    quizControls.style.display = 'flex'; 
    loadQuestion();
}

// Event Listeners
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', showResults); 
languageSelect.addEventListener('change', handleLanguageChange);

// Initial call to start the quiz
document.addEventListener('DOMContentLoaded', () => {
    filterQuestions();
    loadQuestion();
});