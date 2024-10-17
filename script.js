// DOM Elements
const customTextInput = document.getElementById('custom-text-input');
const startTestButton = document.getElementById('start-test');
const textToType = document.getElementById('text-to-type');
const userInput = document.getElementById('user-input');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const errorsDisplay = document.getElementById('errors');
const correctDisplay = document.getElementById('correct');
const restartButton = document.getElementById('restart');
const timeSelect = document.getElementById('time-select');
const originalTextDisplay = document.getElementById('original-text');
const userTextDisplay = document.getElementById('user-text');
const typingTestSection = document.getElementById('typing-test-section');
const customTextSection = document.getElementById('custom-text-section');
const resultSection = document.getElementById('result-section');

// Variables
let timer = 60;
let interval = null;
let errors = 0;
let correctKeystrokes = 0;
let charIndex = 0;
let started = false;

// Start Test Button Click Event
startTestButton.addEventListener('click', () => {
    const text = customTextInput.value.trim();
    if (text.length === 0) {
        alert('Please enter some text to begin the test.');
        return;
    }

    // Set timer based on user selection
    timer = parseInt(timeSelect.value);
    timerDisplay.textContent = timer;

    // Display the text and switch to typing section
    textToType.innerText = text;
    customTextSection.style.display = 'none';
    typingTestSection.style.display = 'block';

    // Enable the user input and set focus
    userInput.disabled = false;
    userInput.focus();
});

// Handle User Input
userInput.addEventListener('input', () => {
    if (!started) {
        // Start the timer when user starts typing
        interval = setInterval(updateTimer, 1000);
        started = true;
    }

    const inputText = userInput.value;
    const text = textToType.innerText;

    // Check the current character for correctness
    if (inputText[charIndex] === text[charIndex]) {
        correctKeystrokes++;
        correctDisplay.textContent = correctKeystrokes;
    } else {
        errors++;
        errorsDisplay.textContent = errors;
    }

    charIndex++;

    // If input length matches the original text length, end the test early
    if (inputText.length === text.length) {
        clearInterval(interval);
        endTest();
    }
});

// Timer Function
function updateTimer() {
    if (timer > 0) {
        timer--;
        timerDisplay.textContent = timer;
    } else {
        // If timer runs out, stop the test
        clearInterval(interval);
        endTest();
    }
}

// End Test and Display Results
function endTest() {
    userInput.disabled = true;
    calculateResults();
    typingTestSection.style.display = 'none';
    resultSection.style.display = 'block';
}

// Calculate WPM, Accuracy, and Display Results
function calculateResults() {
    const text = textToType.innerText;
    const input = userInput.value;

    // Calculate WPM and accuracy
    const wordsTyped = correctKeystrokes / 5;
    const wpm = Math.round((wordsTyped / (parseInt(timeSelect.value) / 60)));
    const accuracy = Math.round((correctKeystrokes / charIndex) * 100);

    // Update the stats in the results section
    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy;
    originalTextDisplay.textContent = text;

    // Display user input with mistakes highlighted in red
    userTextDisplay.innerHTML = highlightMistakes(text, input);
}

// Highlight Mistakes in User Input
function highlightMistakes(original, input) {
    let result = '';
    for (let i = 0; i < original.length; i++) {
        const char = input[i] || ''; // Handle missing characters
        if (char === original[i]) {
            result += `<span>${char}</span>`; // Correct character
        } else {
            result += `<span style="color: red;">${char || '_'}</span>`; // Incorrect or missing character
        }
    }
    return result;
}

// Restart Button Click Event
restartButton.addEventListener('click', () => {
    // Reload the page to reset everything
    location.reload();
});
