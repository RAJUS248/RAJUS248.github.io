// --- Code Generation Helpers ---

// Pool of random words for function and variable names
const namePool = ["calc", "process", "data", "array", "list", "check", "sort", "find", "handle", "value", "count", "idx", "temp", "item", "element"];

/**
 * Generates a unique, descriptive function or variable name.
 */
function generateRandomName(isFunction = false) {
    const part1 = namePool[Math.floor(Math.random() * namePool.length)];
    const part2 = namePool[Math.floor(Math.random() * namePool.length)];
    
    const name = part1 + part2.charAt(0).toUpperCase() + part2.slice(1);
    
    if (isFunction) {
        return (Math.random() > 0.5 ? "get" : "run") + name.charAt(0).toUpperCase() + name.slice(1);
    }
    return name;
}

/**
 * Generates unique internal loop constants for variation.
 */
function generateLoopParams(complexity) {
    if (complexity === 'O(N)') {
        const step = Math.floor(Math.random() * 3) + 1; 
        const multiplier = Math.floor(Math.random() * 3) + 1; 
        return { step, multiplier };
    }
    if (complexity === 'O(log N)') {
        const base = Math.floor(Math.random() * 2) + 2; 
        return { base };
    }
    if (complexity === 'O(N log N)') {
        const base = Math.floor(Math.random() * 2) + 2; 
        return { base };
    }
    return {}; 
}


// Function to generate the code snippets based on complexity type, language, UNIQUE NAMES, and RANDOMIZED PARAMS
function generateCode(type, lang, names, params) {
    const { funcName, varName, arrName } = names;
    let code = {};
    
    // --- O(1) TEMPLATES (Variations in access/arithmetic) ---
    if (type === 'O(1)-1') {
        code.java = `public int ${funcName}(int[] ${arrName}) {
    // Accessing a fixed index
    return ${arrName}[${Math.random() > 0.5 ? 0 : 1}];
}`;
        code.python = `def ${funcName}(${arrName}):
    # Accessing a fixed index
    return ${arrName}[${Math.random() > 0.5 ? 0 : 1}]`;
        code.c = `int ${funcName}(int ${arrName}[], int size) {
    // Accessing a fixed index
    return ${arrName}[${Math.random() > 0.5 ? 0 : 1}];
}`;
    } else if (type === 'O(1)-2') {
        code.java = `public int ${funcName}(int ${varName}, int constant) {
    int sum = ${varName} + constant;
    return sum * ${Math.floor(Math.random() * 5) + 2}; 
}`;
        code.python = `def ${funcName}(${varName}, constant):
    sum_val = ${varName} + constant
    return sum_val * ${Math.floor(Math.random() * 5) + 2}`;
        code.c = `int ${funcName}(int ${varName}, int constant) {
    int sum = ${varName} + constant;
    return sum * ${Math.floor(Math.random() * 5) + 2};
}`;
    }

    // --- O(log N) TEMPLATES (Randomized base) ---
    else if (type === 'O(log N)-1') {
        const base = params.base;
        code.java = `public void ${funcName}(int N) {
    for (int i = 1; i < N; i *= ${base}) { 
        System.out.println("Processing...");
    }
}`;
        code.python = `def ${funcName}(N):
    i = 1
    while i < N:
        print("Processing...")
        i *= ${base}`;
        code.c = `void ${funcName}(int N) {
    for (int i = 1; i < N; i *= ${base}) { 
        printf("Processing...\\n");
    }
}`;
    }

    // --- O(N) TEMPLATES (Randomized step and multiplier) ---
    else if (type === 'O(N)-1') {
        const { step, multiplier } = params;
        code.java = `public int ${funcName}(int[] ${arrName}) {
    int ${varName} = 0;
    for (int i = 0; i < ${arrName}.length * ${multiplier}; i += ${step}) {
        // O(1) operation
    }
    return ${varName};
}`;
        code.python = `def ${funcName}(${arrName}):
    ${varName} = 0
    for i in range(0, len(${arrName}) * ${multiplier}, ${step}): 
        ${varName} += 1
    return ${varName}`;
        code.c = `int ${funcName}(int ${arrName}[], int size) {
    int ${varName} = 0;
    for (int i = 0; i < size * ${multiplier}; i += ${step}) {
        // O(1) operation
    }
    return ${varName};
}`;
    } else if (type === 'O(N)-2') {
        const multiplier1 = Math.floor(Math.random() * 2) + 1;
        const multiplier2 = Math.floor(Math.random() * 3) + 2; 
        code.java = `public void ${funcName}(int N) {
    for (int i = 0; i < N * ${multiplier1}; i++) {
        // O(1) operation
    }
    for (int j = 0; j < N * ${multiplier2}; j++) { 
        // Another O(N) loop
    }
}`;
        code.python = `def ${funcName}(N):
    for i in range(N * ${multiplier1}):
        pass
    for j in range(N * ${multiplier2}):
        pass`;
        code.c = `void ${funcName}(int N) {
    for (int i = 0; i < N * ${multiplier1}; i++) {
        // O(1) operation
    }
    for (int j = 0; j < N * ${multiplier2}; j++) {
        // Another O(N) loop
    }
}`;
    }

    // --- O(N log N) TEMPLATES (Randomized N loop and log base) ---
    else if (type === 'O(N log N)-1') {
        const { base } = params;
        const offset = Math.floor(Math.random() * 5); 
        code.java = `public void ${funcName}(int N) {
    for (int i = ${offset}; i < N; i++) { 
        for (int j = 1; j < N; j *= ${base}) { 
            System.out.println("Iteration: " + i);
        }
    }
}`;
        code.python = `def ${funcName}(N):
    for i in range(${offset}, N):
        j = 1
        while j < N: 
            print("Iteration:", i)
            j *= ${base}`;
        code.c = `void ${funcName}(int N) {
    for (int i = ${offset}; i < N; i++) {
        for (int j = 1; j < N; j *= ${base}) { 
            printf("Iteration: %d,%d\\n", i, j);
        }
    }
}`;
    }
    
    // --- O(N^2) TEMPLATES (Randomized bounds) ---
    else if (type === 'O(N^2)-1') {
        const boundType = Math.floor(Math.random() * 3);
        let innerBound;
        if (boundType === 0) innerBound = 'N'; 
        else if (boundType === 1) innerBound = `N - ${Math.floor(Math.random() * 5) + 1}`; 
        else innerBound = `N / ${Math.floor(Math.random() * 2) + 1}`; 
        
        code.java = `public void ${funcName}(int N) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < ${innerBound}; j++) { 
            // O(1) operation
        }
    }
}`;
        code.python = `def ${funcName}(N):
    for i in range(N):
        for j in range(${innerBound}): 
            pass`;
        code.c = `void ${funcName}(int N) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < ${innerBound}; j++) { 
            // O(1) operation
        }
    }
}`;
    } else if (type === 'O(N^2)-2') {
        const start = Math.random() > 0.5 ? 'i' : `i + ${Math.floor(Math.random() * 3) + 1}`;
        code.java = `public void ${funcName}(int N) {
    for (int i = 0; i < N; i++) {
        for (int j = ${start}; j < N; j++) { 
            System.out.println("Pair: " + i + "," + j);
        }
    }
}`;
        code.python = `def ${funcName}(N):
    for i in range(N):
        for j in range(${start}, N): 
            print(f"Pair: {i},{j}")
`;
        code.c = `void ${funcName}(int N) {
    for (int i = 0; i < N; i++) {
        for (int j = ${start}; j < N; j++) { 
            printf("Pair: %d,%d\\n", i, j);
        }
    }
}`;
    }
    
    // --- O(N^3) TEMPLATES (Randomized bound) ---
    else if (type === 'O(N^3)-1') {
        const innerBound = Math.random() > 0.5 ? 'N' : `N - 1`;
        code.java = `public void ${funcName}(int N) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            for (int k = 0; k < ${innerBound}; k++) { 
                // O(1) operation
            }
        }
    }
}`;
        code.python = `def ${funcName}(N):
    for i in range(N):
        for j in range(N):
            for k in range(${innerBound}): 
                pass`;
        code.c = `void ${funcName}(int N) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            for (int k = 0; k < ${innerBound}; k++) { 
                // O(1) operation
            }
        }
    }
}`;
    }
    
    return code[lang]; 
}

// The base set of 9 complexity templates (without code, just type and answer)
const baseQuizTemplates = [
    { type: 'O(1)-1', answer: "O(1)", complexity: 'O(1)', options: ["O(N)", "O(1)", "O(log N)", "O(N^2)"], explanation: "Array access at a fixed index is a single, constant-time operation (**O(1)**)." },
    { type: 'O(1)-2', answer: "O(1)", complexity: 'O(1)', options: ["O(N log N)", "O(N^2)", "O(1)", "O(N)"], explanation: "Basic arithmetic operations take a fixed amount of time, resulting in **O(1)** constant complexity." },
    { type: 'O(log N)-1', answer: "O(log N)", complexity: 'O(log N)', options: ["O(N)", "O(N log N)", "O(N^2)", "O(log N)"], explanation: "The loop variable is multiplied by a constant, causing the number of iterations to scale logarithmically, resulting in **O(log N)**." },
    { type: 'O(N)-1', answer: "O(N)", complexity: 'O(N)', options: ["O(N)", "O(1)", "O($N^3$)", "O(N log N)"], explanation: "A single loop where the number of iterations is directly proportional to N, resulting in **O(N)** linear time." },
    { type: 'O(N)-2', answer: "O(N)", complexity: 'O(N)', options: ["O(N^2)", "O(N)", "O(log N)", "O(1)"], explanation: "Sequential O(N) loops are additive ($O(N)+O(N)$), which simplifies to **O(N)**." },
    { type: 'O(N log N)-1', answer: "O(N log N)", complexity: 'O(N log N)', options: ["O(N^2)", "O(N log N)", "O(N)", "O(log N)"], explanation: "The outer $O(N)$ loop multiplied by the inner $O(\log N)$ loop yields the total complexity: **O(N log N)**." },
    { type: 'O(N^2)-1', answer: "O(N^2)", complexity: 'O(N^2)', options: ["O(N)", "O(N log N)", "O(N^2)", "O($N^3$)"], explanation: "A nested loop where both run proportional to N results in **O(N^2)** (quadratic) time." },
    { type: 'O(N^2)-2', answer: "O(N^2)", complexity: 'O(N^2)', options: ["O(N^2)", "O(N)", "O(2^N)", "O(N log N)"], explanation: "Even a triangular nested loop ($N + (N-1) + ... + 1$) is still dominated by the $N^2$ term, which simplifies to **O(N^2)**." },
    { type: 'O(N^3)-1', answer: "O($N^3$)", complexity: 'O(N^3)', options: ["O(N^2)", "O(N log N)", "O($N^3$)", "O(N!)"], explanation: "A triple nested loop means $N \times N \times N$ operations, leading to cubic time complexity: **O($N^3$)**." }
];

const MAX_QUESTIONS = 100;
let allQuizData = [];

/**
 * Creates the bank of MAX_QUESTIONS, guaranteeing 100 unique code snippets 
 * with a completely randomized order of complexity types.
 */
function createQuizBank() {
    let tempBank = [];
    
    // Create a list of 100 template indices, then shuffle that list.
    let templateIndices = [];
    for (let i = 0; i < MAX_QUESTIONS; i++) {
        templateIndices.push(i % baseQuizTemplates.length);
    }
    shuffleArray(templateIndices); 

    for (let i = 0; i < MAX_QUESTIONS; i++) {
        // Use the randomized index to pick the base template
        const template = baseQuizTemplates[templateIndices[i]];
        
        // 1. Generate unique names
        const uniqueNames = {
            funcName: generateRandomName(true),
            varName: generateRandomName(false),
            arrName: generateRandomName(false) + "List"
        };
        
        // 2. Generate unique loop parameters
        const uniqueParams = generateLoopParams(template.complexity);
        
        // 3. Create the final unique question object
        tempBank.push({
            ...template,
            names: uniqueNames, 
            params: uniqueParams 
        }); 
    }
    
    shuffleArray(tempBank); 
    allQuizData = tempBank;
}

let filteredQuizData = []; 
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let selectedLanguage = 'java'; 

// DOM Elements (Updated)
const languageSelect = document.getElementById('language-select');

// NEW DOM elements for Notes Area
const notesArea = document.getElementById('notes-area');
const startQuizButton = document.getElementById('start-quiz-button');

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

function filterQuestions() {
    createQuizBank(); 
    filteredQuizData = allQuizData;
}

// Function to load a question
function loadQuestion() {
    if (currentQuestionIndex >= filteredQuizData.length) {
        currentQuestionIndex = 0; 
        filterQuestions(); 
    }
    
    answered = false;
    feedbackElement.style.display = 'none';
    optionsContainer.innerHTML = '';
    nextButton.style.display = 'none';

    const currentQuestion = filteredQuizData[currentQuestionIndex];
    
    const generatedCode = generateCode(currentQuestion.type, selectedLanguage, currentQuestion.names, currentQuestion.params);
    
    questionNumberElement.textContent = `Question ${currentQuestionIndex + 1} / ${filteredQuizData.length} (Infinite Mode)`;
    
    codeSnippetElement.textContent = generatedCode;
    
    codeSnippetElement.className = ''; 
    codeSnippetElement.classList.add(`language-${selectedLanguage}`);
    // Check for Prism.js existence before use
    if (typeof Prism !== 'undefined') {
        Prism.highlightElement(codeSnippetElement);
    }


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
    
    // Ensure quiz elements are visible
    quizArea.style.display = 'block';
    resultArea.style.display = 'none';
    quizControls.style.display = 'flex';
    notesArea.style.display = 'none';
}

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

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

/**
 * Initializes the quiz and moves from the notes screen to the first question.
 */
function startQuiz() {
    filterQuestions(); 
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion(); 
}


function handleLanguageChange() {
    selectedLanguage = languageSelect.value;
    restartQuiz(); // Reset state and return to notes screen
}

function showResults() {
    quizArea.style.display = 'none';
    quizControls.style.display = 'none';
    resultArea.style.display = 'block';
    notesArea.style.display = 'none';
    finalScoreElement.textContent = `You correctly answered ${score} questions out of ${currentQuestionIndex} questions attempted.`;
}

/**
 * Resets the state and returns to the notes screen (used by restart button).
 */
function restartQuiz() {
    // Show notes, hide everything else
    notesArea.style.display = 'block'; 
    quizArea.style.display = 'none';
    quizControls.style.display = 'none';
    resultArea.style.display = 'none';
    
    // Reset state variables
    currentQuestionIndex = 0;
    score = 0;
}

// Event Listeners (Updated)
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', restartQuiz); 
languageSelect.addEventListener('change', handleLanguageChange);
startQuizButton.addEventListener('click', startQuiz);


// Initial call to set up the display
document.addEventListener('DOMContentLoaded', () => {
    // Initial display state: show notes, hide quiz area/controls/results
    notesArea.style.display = 'block';
    quizArea.style.display = 'none';
    quizControls.style.display = 'none';
    resultArea.style.display = 'none';
    
    // Initialize the quiz bank once on load
    filterQuestions(); 
});