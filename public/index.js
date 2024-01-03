const board = document.getElementById('board');
const turn = document.getElementById('turn');
const youSymbol = document.getElementById('you-symbol');
const toebrainSymbol = document.getElementById('toebrain-symbol');
const symbols = {
    true: 'X', // true is You
    false: 'O', // false is toebrain
};
const players = {
    true: 'You', // true is You
    false: 'toebrain', // false is toebrain
};
const possesives = {
    true: 'Your', // true is You
    false: 'toebrain\'s', // false is toebrain
};

let currentPlayer = true;
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

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
 * @memberof TicTacToe
 */
function resetBoard() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = Object.keys(symbols)[Object.values(symbols).indexOf('X')];
    gameActive = true;
    turn.textContent = possesives[currentPlayer] + ' Turn';
    for (let i = 0; i < 9; i++) {
        const cell = board.children[i];
        cell.textContent = '';
    }
}

/**
 * Switches the players symbols.
 * 
 * @memberof TicTacToe
 */
function switchPlayers() {
    currentPlayer = !currentPlayer;
    const lastYouSymbol = symbols[true]; // Store the symbol You last had
    symbols[true] = symbols[false]; // true is You, false is toebrain
    symbols[false] = lastYouSymbol;
    turn.textContent = possesives[currentPlayer] + ' Turn'; // Update the turn text to show who's turn it is next since we're switching players
    youSymbol.textContent = symbols[true];       // Switching the symbols on the board's
    toebrainSymbol.textContent = symbols[false]; // sidebars to show who has what symbol
    go(); // Check if it's toebrain's turn now
}

/**
 * Event listener for when a cell is clicked.
 * 
 * @param {Event} event - The event object.
 */
function cellClick(event) {
    const index = event.target.getAttribute('data-index');

    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        event.target.textContent = symbols[currentPlayer];
        if (checkWinner()) {
            gameActive = false;
            turn.textContent = players[currentPlayer] + ` Win${players[currentPlayer] == 'toebrain' ? 's' : ''}!`;
        } else if (gameBoard.every(cell => cell !== '')) {
            gameActive = false;
            turn.textContent = 'Draw!';
        } else {
            currentPlayer = !currentPlayer;
            turn.textContent = possesives[currentPlayer] + ' Turn';
        }
    }

    go(); // Check if it's toebrain's turn now
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
        return gameBoard[a] !== '' && gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c];
    });
}

/**
 * Sends the game board data to the server to be processed by toebrain.
 * 
 * @memberof TicTacToe
 */
function go() {
    if (currentPlayer && gameActive) { // If currentPlayer is true, it's Your turn to move. If not, it's toebrain's turn
        return false;
    }
    fetch('/api/go', { // We need to send the game board data to the server so it can go through toebrain's mind
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: gameBoard // Just 'data' because I want toebrain just to be able to recognize patterns, not be built for just tic tac toe. That would be lame.
        })
    })
}

createBoard();