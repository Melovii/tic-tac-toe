// Gameboard module made using a factory function
const Gameboard = (() => {
    let board = [];

    // Initialise the game board as a 3x3 array
    const init = () => {
        for (let i = 0; i < 3; i++) {
            board[i] = [];
            for (let j = 0; j < 3; j++) {
                board[i][j] = null;
            }
        }
    };

    // Return board array with a getter
    const getBoard = () => board;

    return { init, getBoard };
})();


// Function to create player object
const Player = (name, number) => {
    return { name, number };
};

// Game module made using a factory function
const Game = (() => {
    let currentPlayer;
    let gameboard; // store reference to Gameboard object

    const init = (gameboard) => {
        gameboard.init();
        currentPlayer = null;
    };

    const startGame = () => {
        // TODO: implement game logic
    };

    return { init, startGame };
})();

Game.init(Gameboard);
