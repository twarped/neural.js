const board = document.getElementById('board');
const gamesPlayed = document.getElementById('games-played');
const turn = document.getElementById('turn');
const youSymbol = document.getElementById('you-symbol');
const toebrainSymbol = document.getElementById('toebrain-symbol');
const log = document.getElementById('log');

const symbols = {
    0: '',  // blank square
    1: 'X', // true is You
    2: 'O', // false is toebrain
    3: '',  // blank square
};
const players = {
    1: 'You', // true is You
    2: 'toebrain', // false is toebrain
};
const possesives = {
    1: 'Your', // true is You
    2: 'toebrain\'s', // false is toebrain
};

let currentPlayer = 1;
let gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // 
let gameActive = true;
let games = 0;

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
    gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // Reset the game board to blank squares
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
    currentPlayer = 1 ? 2 : 1;
    const lastYouSymbol = symbols[1]; // Store the symbol You last had
    symbols[1] = symbols[2]; // true is You, false is toebrain
    symbols[2] = lastYouSymbol;
    turn.textContent = possesives[currentPlayer] + ' Turn'; // Update the turn text to show who's turn it is next since we're switching players
    youSymbol.textContent = symbols[1];       // Switching the symbols on the board's
    toebrainSymbol.textContent = symbols[2]; // sidebars to show who has what symbol
    go(); // Check if it's toebrain's turn now
}

/**
 * Event listener for when a cell is clicked.
 * 
 * @param {event} event - The event object.
 */
function cellClick(event) {
    const index = event.target.getAttribute('data-index');

    if (!gameBoard[index] && gameActive) {
        gameBoard[index] = currentPlayer;
        event.target.textContent = symbols[currentPlayer];
        if (checkWinner()) {
            games++;
            gamesPlayed.textContent = 'Games Played: ' + games; // Increment the number of games played
            gameActive = false;
            turn.textContent = players[currentPlayer] + ` Win${players[currentPlayer] == 'toebrain' ? 's' : ''}!`;
        } else if (gameBoard.every(cell => cell > 0)) {
            games++;
            gamesPlayed.textContent = 'Games Played: ' + games; // Increment the number of games played
            gameActive = false;
            turn.textContent = 'Draw!';
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
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
        return gameBoard[a] > 0 && gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c];
    });
}

/**
 * Sends the game board data to the server to be processed by toebrain.
 * 
 * @memberof TicTacToe
 */
function go() {
    if (!gameActive) { // If currentPlayer is true, it's Your turn to move. If not, it's toebrain's turn
        return;
    }

    console.log(currentPlayer, gameActive);

    let gameBitBoard = 0;
    gameBoard.forEach(i => gameBitBoard = i | (gameBitBoard << 2));
    console.log(gameBitBoard, gameBitBoard.toString(2));
    fetch('/api/go', { // We need to send the game board data to the server so it can go through toebrain's mind
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameBoard)
    }).then(data => data.json()).then(data => {
        console.log(data);
        log.innerHTML += `<b>Input:</b> ${JSON.stringify(gameBoard)} <b>Output:</b> ${data}<br/>`;
    })
}

createBoard();