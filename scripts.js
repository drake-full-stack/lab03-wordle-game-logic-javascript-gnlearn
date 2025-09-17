// ===== GAME STATE VARIABLES =====
const TARGET_WORD = "WORDS";  // Our secret word for testing
let currentRow = 0;           // Which row we're filling (0-5)
let currentTile = 0;          // Which tile in the row (0-4)
let gameOver = false;         // Is the game finished?

// DOM element references (set up on page load)
let gameBoard, rows, debugOutput;

// ===== HELPER FUNCTIONS (PROVIDED) =====

// Debug/Testing Functions
function logDebug(message, type = 'info') {
    // Log to browser console
    console.log(message);
    
    // Also log to visual testing area
    if (!debugOutput) {
        debugOutput = document.getElementById('debug-output');
    }
    
    if (debugOutput) {
        const entry = document.createElement('div');
        entry.className = `debug-entry ${type}`;
        entry.innerHTML = `
            <span style="color: #666; font-size: 12px;">${new Date().toLocaleTimeString()}</span> - 
            ${message}
        `;
        
        // Add to top of debug output
        debugOutput.insertBefore(entry, debugOutput.firstChild);
        
        // Keep only last 20 entries for performance
        const entries = debugOutput.querySelectorAll('.debug-entry');
        if (entries.length > 20) {
            entries[entries.length - 1].remove();
        }
    }
}

function clearDebug() {
    const debugOutput = document.getElementById('debug-output');
    if (debugOutput) {
        debugOutput.innerHTML = '<p style="text-align: center; color: #999; font-style: italic;">Debug output cleared - ready for new messages...</p>';
    }
}

// Helper function to get current word being typed
function getCurrentWord() {
    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    let word = '';
    tiles.forEach(tile => word += tile.textContent);
    return word;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    gameBoard = document.querySelector('.game-board');
    rows = document.querySelectorAll('.row');
    debugOutput = document.getElementById('debug-output');
    
    logDebug("🎮 Game initialized successfully!", 'success');
    logDebug(`🎯 Target word: ${TARGET_WORD}`, 'info');
    logDebug("💡 Try typing letters, pressing Backspace, or Enter", 'info');
});

// ===== YOUR CHALLENGE: IMPLEMENT THESE FUNCTIONS =====

//TODO: Add keyboard event listener
document.addEventListener("keydown", (event) => {
    if (gameOver) {
        logDebug(`Game Over!`, 'info');
        return;
    }
    
    const key = event.key.toUpperCase();

    if (key === "BACKSPACE") {
        logDebug(`Letter Deleted!`, 'success');
        deleteLetter();

    } else if (key === "ENTER") {
        logDebug(`submitted guess`, 'success');
        submitGuess();

    } else if (key.length === 1 && key >= 'A' && key <= 'Z') {
        logDebug(`Added key: ${event.key}`, 'info');
        addLetter(key);
        
    } else {
        logDebug(`Ignored key: ${event.key}`, 'info');
    }
});

// TODO: Implement addLetter function
function addLetter(letter) {
    if (currentTile >= 5) {
        logDebug("Row is full!", 'info');
    }

    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    const tile = tiles[currentTile];

    tile.textContent = letter;
    tile.classList.add('filled');
    currentTile++;

    logDebug(`Added letter: ${letter} to row ${currentRow} column ${currentTile}`, 'success');
    logDebug(`Current word: ${getCurrentWord()}`, 'info');
}

// TODO: Implement deleteLetter function  
function deleteLetter() {
    logDebug(`deleteLetter() called`, 'info');
    if (currentTile <= 0) {
    logDebug("No letters to delete!", 'info');
    return;
    }
    currentTile--;
    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    const tile = tiles[currentTile];
    const deletedLetter = tile.textContent;

    tile.textContent = "";
    tile.classList.remove('filled');

    logDebug(`Deleted letter ${deletedLetter} from row ${currentRow}, column ${currentTile}`, 'info')
    logDebug(`Current word: ${getCurrentWord()}`, 'info');
}

// TODO: Implement submitGuess function
function submitGuess() {
    if (currentTile !== 5) {
        alert("Please enter 5 letters!");
        return; // exit early
    }

    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    let guess = '';

    tiles.forEach(tile => {
        guess += tile.textContent;
    });

    logDebug(`Submitted guess: ${guess}`, 'info');

    const result = checkGuess(guess, tiles);
    
    for (i = 0; i < 5; i++) {
        tiles[i].classList.add(result[i]);
    };
    
    currentRow++;
    currentTile = 0;

    if (guess === TARGET_WORD) {
        gameOver = true;
        setTimeout(() => { alert("Correct! You've guessed the word!");}, 500);
        logDebug("Game Over! You've won!", 'success');

    } else if (currentRow >= 6) {
        gameOver = true;
        setTimeout(() => { alert(`Game Over! The correct word was: ${TARGET_WORD}`);}, 500);
        logDebug("Game Over! You've used all attempts!", 'info');

    } else {
        setTimeout(() => { logDebug(`Continuing`, 'info');}, 500);
    }
}

// TODO: Implement checkGuess function (the hardest part!)
function checkGuess(guess, tiles) {
    logDebug(`🔍 Starting analysis for "${guess}"`, 'info');
    
    const target = [];
    const guessArray = [];
    const result = ['absent', 'absent', 'absent', 'absent', 'absent'];
    
    for (i = 0; i < 5; i++) {
        target.push(TARGET_WORD[i]);
        guessArray.push(guess[i]);
    };

    // STEP 1: Find exact matches
    for (let i = 0; i < 5; i++) {
        if (target[i] === guessArray[i]) {
            result[i] = 'correct';
            target[i] = null;
            guessArray[i] = null;
            logDebug(`Tile ${i} is correct: ${tiles[i].textContent}, exact match`, 'success');
        }
    };
    
    // STEP 2: Find wrong position matches  
    for (let i = 0; i < 5; i++) {
        if (guessArray[i] !== null) { // only check unused letters
            if (target.includes(guessArray[i])) {
                result[i] = 'present';
                target[target.indexOf(guessArray[i])] = null;
                logDebug(`Tile ${i} is present: ${tiles[i].textContent}, present in word`, 'info');
            }
        }
    };
    
    // TODO: Apply CSS classes to tiles -- we'll do this in the next step
    logDebug(`result array: ${result}`, 'info');
    return result;

}