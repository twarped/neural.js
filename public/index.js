const board = document.getElementById('board');
const gamesPlayedText = document.getElementById('games-played');
const turn = document.getElementById('turn');
const youSymbol = document.getElementById('you-symbol');
const toebrainSymbol = document.getElementById('toebrain-symbol');
const log = document.getElementById('log');

const symbolFirst = 'X'; // X usually goes first... but in case it doesn't
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
// const playerLossesTrackers = {
//     1: document.getElementById('you-losses'),     // 1 is You
//     2: document.getElementById('toebrain-losses') // 2 is toebrain
// };
const playerLosses = {
    1: 0, // 1 is You
    2: 0  // 2 is toebrain
};

let currentPlayer = 1;
let gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // 
let gameActive = true;
let gamesPlayed = 0;

function gameLog(text, header = 'Log Entry') {
    const newLogWrapper = document.createElement('div');
    newLogWrapper.classList.add('turn-wrapper');
    newLogWrapper.innerHTML = `<p>${header}:</p><divider></divider><div>${text}</div>`;
    log.appendChild(newLogWrapper);
}

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

    if (currentPlayer === 2) { // Check if it's toebrain's turn
        go(); // Start the game
    }
}

/**
 * 
 * @param {number} bitBoard The board to load into the game
 */
function loadBoard(bitBoard) {
    let bitBoardString = bitBoard.toString(2);
    if (bitBoardString.length % 2 === 1) {
        bitBoardString = '0' + bitBoardString; // Add a leading zero if the string length is odd
    }

    let bitBoardArray = bitBoardString.match(/.{1,2}/g).map(bit => {
        return parseInt(bit, 2);
    });
    bitBoardArray.unshift(...Array(9 - gameBoard.length).fill(0));

    gameBoard = bitBoardArray;

    for (i in bitBoardArray.slice(0, 8)) {
        const cell = board.children[i];
        cell.textContent = symbols[bitBoardArray[i]];
    };
    gameLog(`bitBoard: ${bitBoard}<br><br>bitBoardString: ${bitBoardString}<br><br>bitBoardArray: ${bitBoardArray}`, 'Board loaded')
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
    currentPlayer = parseInt(Object.keys(symbols)[Object.values(symbols).indexOf(symbolFirst)]); // This is how I find who uses the symbolFirst...
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
    const i = event.target.getAttribute('data-index');

    if (!gameBoard[i] && gameActive) {
        gameBoard[i] = currentPlayer;
        event.target.textContent = symbols[currentPlayer];
        if (checkWinner()) {
            gamesPlayed++;
            gamesPlayedText.textContent = 'Games Played: ' + gamesPlayed; // Increment the number of games played
            gameActive = false;
            turn.textContent = playerNames[currentPlayer] + ` Win${playerNames[currentPlayer] == 'toebrain' ? 's' : ''}!`;
            playerWins[currentPlayer]++; // Increment the number of wins for the current player
            playerLosses[currentPlayer === 2 ? 1 : 2]++; // Increment the number of losses for the other player
            playerWinsTrackers[currentPlayer].textContent = playerWins[currentPlayer]; // Update the win counter
            // playerLossesTrackers[currentPlayer === 2 ? 1 : 2].textContent = playerLosses[currentPlayer === 2 ? 1 : 2]; // Update the loss counter
        } else if (gameBoard.every(cell => cell > 0)) {
            gamesPlayed++;
            gamesPlayedText.textContent = 'Games Played: ' + gamesPlayed; // Increment the number of games played
            gameActive = false;
            turn.textContent = 'Draw!';
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            turn.textContent = possesives[currentPlayer] + ' Turn'; // Update the turn textContent
        }
        go(); // Check if it's toebrain's turn now
    }
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
 * @returns {number} the spliced integer.
 */
function arrayToInt(arr) {
    let int = 0;
    arr.forEach(i => int = i | (int << 2)); // The equation that I came up with. | is a bitwise or operator, ex: 0b0001 | 0b0100 = 0b0101. << is a left shift operator, ex: 0b0001 << 2 = 0b0100
    return int;
}

/**
 * Is the bitboard a legal tictactoe board? 
 * 
 * @param {number} bitBoard The bitboard to be checked
 */
function legalBitBoard(bitBoard) {
    
}

/**
 * Is the new move/bitboard legal?
 * 
 * @param {number} newBitBoard The bitboard/move to be checked
 * @param {number} firstMove Is X (1) or O (2) going first on this board
 * @param {number} bitBoard The bitboard to have the move checked against
 */
// newBitBoard = 4512
function legalMove(newBitBoard = 156674, firstMove = parseInt(Object.keys(symbols)[Object.values(symbols).indexOf(symbolFirst)]), bitBoard = 156672) {
    console.log('current board:', bitBoard, bitBoard.toString(2));
    console.log('new board/move:', newBitBoard, newBitBoard.toString(2));
    
    // Check if the new board is the same as the current board
    if (bitBoard === newBitBoard) {
        console.log('nope. same board!');
        return false;
    }

    // Does the move resemble the board?
    if (bitBoard | newBitBoard === newBitBoard) { // It at least resembles the board
        console.log(bitBoard | newBitBoard, '===', newBitBoard);

        // Check if only one bit is left after XORing the board and the new board
        let move = bitBoard ^ newBitBoard;
        let remainder = Math.log2(move);
        if (remainder - Math.floor(remainder) === 0) {
            // console.log(remainder / 2, remainder % 2);
            let d = 1024;
            console.log(bitBoard.toString(2));
            console.log('eq', bitBoard, '/', d, ':', bitBoard / d, bitBoard % d);
        } else {
            console.log('proposed more than one move or an invalid symbol representation');
            return false;
        }
    } else { // The move doesn't even resemble the board
        console.log('nope!', bitBoard | newBitBoard, '!==', newBitBoard);
        return false;
    }
}

/**
 * Sends the game board data to the server to be processed by toebrain.
 * 
 * @memberof TicTacToe
 */
function go() {
    let gameBitBoard = arrayToInt(gameBoard); // Convert the game board array to a bitboard integer
    let buffer = new ArrayBuffer(4); // 18 bits / 1 byte = 2 bytes remainder 2 bits. So 4 bytes total
    let bitBoardBuffer = new DataView(buffer);
    bitBoardBuffer.setUint32(0, gameBitBoard, false); // Put the number in the buffer
    const gameBitBoardString = decToBinary(gameBitBoard, 18); // Convert the bitboard integer to a string
    fetch('/api/go', { // We need to send the game board data to the server so it can go through toebrain's mind
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
        },
        body: bitBoardBuffer, // Just send the bitboard for now.
    }).then(async data => {
        return {
            status: data.status,
            statusText: data.statusText,
            headers: data.headers,
            body: data.body
        };
    }).then(
        /**
         * 
         * @param {{status: number, statusText: string, headers: Headers, body: ReadableStream<Uint8Array>}} data The data returned from our POST to toebrain
         */
        async data => {
            const processId = data.headers.get('process-id');

            const response = (await data.body.getReader().read()).value;
            let responseInt = new DataView(response.buffer).getUint32(0); // Convert from bytes to a easily-human readable number

            console.log(legalMove()); // Check if the response is a legal move

            const newTurnWrapper = document.createElement('div');
            newTurnWrapper.classList.add('turn-wrapper');
            newTurnWrapper.innerHTML += `<div class="input-wrapper"><p>Input:</p><divider></divider><div class="ellipsis">ArrayBuffer [${new Uint8Array(bitBoardBuffer.buffer)}]</div><br><div class="ellipsis">${gameBitBoardString}: ${gameBitBoard}</div></div><div class="output-wrapper"><p>Output:</p><divider></divider><div class="ellipsis">Uint8Array [${response}]</div><br><div class="ellipsis">${decToBinary(responseInt, 18)}: ${responseInt}</div></div>`; // Parse everything into an easy to read format
            log.appendChild(newTurnWrapper);
            if (log.scrollTop + newTurnWrapper.offsetHeight >= log.scrollHeight - log.offsetHeight - 27 - 60) {
                log.scrollTo({
                    top: log.scrollHeight - log.offsetHeight + 2,
                    behavior: 'smooth'
                });
            }
        }
    )
}

createBoard();