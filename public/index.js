const board = document.getElementById('board');
const gamesPlayedText = document.getElementById('games-played');
const turn = document.getElementById('turn');
const youSymbol = document.getElementById('you-symbol');
const toebrainSymbol = document.getElementById('toebrain-symbol');
const log = document.getElementById('log');

const symbols = {
    0: '',  // blank square
    1: 'X', // 1 is You
    2: 'O', // 2 is toebrain
    3: '',  // blank square
};
const playerNames = {
    1: 'You',      // 1 is You
    2: 'toebrain', // 2 is toebrain
};
const possesives = {
    1: 'Your',        // 1 is You
    2: 'toebrain\'s', // 2 is toebrain
};

const playerWinsTrackers = {
    1: document.getElementById('you-wins'),
    2: document.getElementById('toebrain-wins')
};
const playerWins = {
    1: 0, // 1 is You
    2: 0  // 2 is toebrain
};
const playerLossesTrackers = {
    1: document.getElementById('you-losses'),     // 1 is You
    2: document.getElementById('toebrain-losses') // 2 is toebrain
};
const playerLosses = {
    1: 0, // 1 is You
    2: 0  // 2 is toebrain
};

let currentPlayer = 1;
let gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // 
let gameActive = true;
let gamesPlayed = 0;

/**
 * Creates the game board by creating nine cells and adding them to the board element.
 */
function createBoard() {
    for (let i = 0; i < 9; i++) { // Load in the game board cells
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', cellClick);
        board.appendChild(cell);
    }

    go(); // Start the game by checking if it's toebrain's turn
}

/**
 * Resets the game board and switches players.
 * 
 */
function resetBoard() {
    gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // Reset the game board to blank squares
    for (let i = 0; i < 9; i++) {
        const cell = board.children[i];
        cell.textContent = '';
    }
    currentPlayer = Object.keys(symbols)[Object.values(symbols).indexOf('X')]; // This is how I find who uses the symbol 'X'. X always goes first.
    gameActive = true;
    turn.textContent = possesives[currentPlayer] + ' Turn';
}

/**
 * Switches the players symbols.
 * 
 */
function switchSymbols() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    const lastYouSymbol = symbols[1]; // Store the symbol You (1) last had
    symbols[1] = symbols[2]; // set Your symbol (1) to toebrain's symbol (2)
    symbols[2] = lastYouSymbol; // set toebrain's symbol (2) to Your last symbol
    turn.textContent = possesives[currentPlayer] + ' Turn'; // Update the turn text to show who's turn it is next since we're switching players
    youSymbol.textContent = symbols[1];       // Switch the symbols on the board's s-
    toebrainSymbol.textContent = symbols[2];  // idebars to show who uses what symbol
    go(); // Check if it's toebrain's turn now
}

/**
 * Event listener for when a cell is clicked.
 * 
 * @param {event} event - The event object.
 */
function cellClick(event) {
    console.log('cellClick');
    const i = event.target.getAttribute('data-index');

    console.log('gameBoard', gameBoard);
    console.log('i', i);

    if (!gameBoard[i] && gameActive) {
        gameBoard[i] = currentPlayer;
        event.target.textContent = symbols[currentPlayer];
        if (checkWinner()) {
            gamesPlayed++;
            gamesPlayedText.textContent = 'Games Played: ' + gamesPlayed; // Increment the number of games played
            gameActive = false;
            turn.textContent = playerNames[currentPlayer] + ` Win${playerNames[currentPlayer] == 'toebrain' ? 's' : ''}!`;
            playerWins[currentPlayer]++;

        } else if (gameBoard.every(cell => cell > 0)) {
            gamesPlayed++;
            gamesPlayedText.textContent = 'Games Played: ' + gamesPlayed; // Increment the number of games played
            gameActive = false;
            turn.textContent = 'Draw!';
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            turn.textContent = possesives[currentPlayer] +' Turn'; // Update the turn textContent
        }
    }

    go(); // Check if it's toebrain's turn now
}

/**
 * Clears the contents of the log element.
 */
function clearLog() {
    log.innerHTML = '';
}

/**
 * Checks if the current player has won the game.
 * 
 * @returns {boolean} Whether the current player has won the game.
 */
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] > 0 && gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c];
    });
}

/**
 * Returns the number of bits required to represent the given number.
 *
 * @param {number} num - The number to determine the bit length of.
 * @returns {number} The number of bits required to represent the given number.
 */
function bitLength(num) {
    return Math.ceil(Math.log2(num));
}

/**
 * Convert decimal number to binary string.
 * @param {number} num - The decimal number to convert to binary.
 * @param {number} bitLength - The desired length of the binary string. If not specified, the function will determine the length automatically.
 * @returns {string} The binary string representation of the decimal number.
 */
function decToBinary(num, bitLength) {
    return num.toString(2).padStart(bitLength, '0');
}

/**
 * Cool equation that splices together an array of integers into a single integer.
 * 
 * @param {Array} arr the array of integers to splice together into a single integer.
 * @returns 
 */
function arrayToInt(arr) {
    let int = 0;
    arr.forEach(i => int = i | (int << 2)); // The equation that I came up with. | is a bitwise or operator, ex: 0b0001 | 0b0100 = 0b0101. << is a left shift operator, ex: 0b0001 << 2 = 0b0100
    return int;
}

/**
 * Sends the game board data to the server to be processed by toebrain.
 * 
 * @memberof TicTacToe
 */
function go() {
    if (!gameActive) { // If game isn't active, don't send the game data to toebrain
        return;
    }

    let gameBitBoard = arrayToInt(gameBoard); // Convert the game board array to a bitboard integer;\
    const gameBitBoardString = decToBinary(gameBitBoard, 18); // Convert the bitboard integer to a string
    fetch('/api/go', { // We need to send the game board data to the server so it can go through toebrain's mind
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
        },
        body: new Uint8Array(gameBoard), // Just send the bitboard for now.
    }).then(async data => { 
        return { 
            status: data.status, 
            statusText: data.statusText, 
            body: data.body
        }; 
    }).then(
        /**
         * 
         * @param {{status: number, statusText: string, body: ReadableStream}} data The data returned from our POST to toebrain
         */
        async data => {
            const response = (await data.body.getReader().read()).value;
            const newTurnWrapper = document.createElement('div');
            newTurnWrapper.classList.add('turn-wrapper');
            newTurnWrapper.innerHTML += `<div class="input-wrapper"><p>Input:</p><divider></divider><div class="ellipsis">Uint8Array [${gameBoard}]</div><br><div class="ellipsis">${gameBitBoardString}: ${gameBitBoard}</div></div><div class="output-wrapper"><p>Output:</p><divider></divider><div class="ellipsis">Uint8Array [${response}]</div><br><div class="ellipsis">${decToBinary(arrayToInt(response), 18)}: ${arrayToInt(response)}</div></div>`; // Parse everything into an easy to read format
            log.appendChild(newTurnWrapper);
            if (log.scrollTop + newTurnWrapper.offsetHeight >= log.scrollHeight - log.offsetHeight - 27 - 60) {
                log.scrollTo({
                    top: log.scrollHeight - log.offsetHeight - 27,
                    behavior: 'smooth'
                });
            }
        }
    )
}

createBoard();