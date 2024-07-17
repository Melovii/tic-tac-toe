// Gameboard module made using a factory function
const Gameboard = (() => {
    let board = [];

    const init = () => {
        for (let i = 0; i < 9; i++) {
            board[i] = null;
        }
    };

    // Return board array with a getter
    const getBoard = () => board;

    // Update board array with a setter
    const setBoard = (newBoard) => board = newBoard;

    return { init, getBoard, setBoard };
})();


// Function to create player object
const Player = (name, number) => {
    return { name, number };
};

// Game module made using a factory function
const Game = (() => {
    let currentPlayer;
    let gameboard; // store reference to Gameboard object
    let players;

    const init = (gameboardObject) => {
        gameboard = gameboardObject;
        gameboard.init();
        players = [Player('Melovi', 1), Player('PC', 0)];
        currentPlayer = players[0];
    };

    const startGame = () => {
        console.log('testing startGame()')
        // TODO: implement game logic (IN PROGRESS)
        while (1) { // game loop
            playRound();
            if (checkWinner()) {
                break; // game over
            }
        }
    };

    const playRound = () => {
        let userChoice = getUserMove('Which box do you want to play?'); // returns user input (1-9) //
        let computerChoice = getComputerMove(userChoice); // returns a random number between 1-9
        console.log(`User: ${userChoice}`);
        console.log(`PC: ${computerChoice}`);
        updateGameboard(userChoice, computerChoice);
    };

    const checkWinner = () => {
        let currentBoard = Gameboard.getBoard();

        const winningPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        const winningPattern = pattern => {
            let [a, b, c] = pattern;
            return currentBoard[a] !== null && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c];
        }

        if (winningPatterns.some(winningPattern)) {
            // determine the winner
            let winner = currentBoard[winningPatterns.find(winningPattern)[0]]; // assumes only one pattern is winning
            console.log('Player ${winner} wins!');
            return true;
        }

        if (!currentBoard.includes(null)) {
            console.log('it\'s a tie!');
            return true;
        }

        return false;
    };

    const getUserMove = (message) => {
        let userInput = prompt(message);
        console.log(userInput);
        if (!userInput) {
            getUserMove('Please enter a number.')
        } else if (userInput <= 0 || userInput >= 10) {
            getUserMove('Please enter a number between 1 and 9 (inclusive).');
        }
        return userInput;
    };

    const getComputerMove = (userChoice) => {
        let number;
        let currentBoard = gameboard.getBoard();
        do {
            number = Math.floor((Math.random() * 9)) + 1;
        } while (currentBoard[number - 1] !== null || number === userChoice);
        return number;
    };

    const updateGameboard = (userChoice, computerChoice) => {
        console.log('testing updateGameboard()')
        // TODO: implement gameboard placement logic (IN PROGRESS)
        let currentBoard = gameboard.getBoard();
        if (currentBoard[computerChoice - 1] === null && currentBoard[userChoice-1] === null) {
            currentBoard[userChoice - 1] = players[0].number;
            currentBoard[computerChoice - 1] = players[1].number;
            console.log(currentBoard);
        } else {
            console.log('Invalid move, please try again!');
            playRound();
        }
    };

    const resetGame = () => {
        gameboard.init();
        currentPlayer = players[0];
    };

    return { init, startGame };
})();

const startGameBtn = document.querySelector('.start-game');
startGameBtn.addEventListener('click', () => {
    Game.init(Gameboard);
    Game.startGame();
});