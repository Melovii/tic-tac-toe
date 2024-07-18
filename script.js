// Gameboard module made using a factory function
const Gameboard = (() => {
    let board = [];
    let gameboardBoxes = null;

    const init = () => {
        for (let i = 0; i < 9; i++) {
            board[i] = null;
        }
        // Initialise boxes and add eventListeners
        gameboardBoxes = document.querySelectorAll('.box');
        gameboardBoxes.forEach((box) => {
            box.addEventListener('click', handleBoxClick);
        });
    };

    const handleBoxClick = (event) => {
        // get box ID on click
        const boxIndex = event.target.dataset.index;
        console.log(`testing ${boxIndex}`);
        Game.playRound(boxIndex);
    };

    // Return board array with a getter
    const getBoard = () => board;

    // Update board array with a setter
    const setBoard = (newBoard) => (board = newBoard);

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

    const p1Name = document.querySelector('.p1-scoreholder');
    const p2Name = document.querySelector('.p2-scoreholder');
    const p1Score = document.querySelector('.p1-score');
    const p2Score = document.querySelector('.p2-score');
    const draws = document.querySelector('.draws-score');

    const disableGameInteraction = () => {
        const mainContent = document.querySelector('.main-content');
        mainContent.classList.add('disabled');
    };

    const enableGameInteraction = () => {
        const mainContent = document.querySelector('.main-content');
        mainContent.classList.remove('disabled');
    };

    const init = (gameboardObject) => {
        gameboard = gameboardObject;
        gameboard.init();
        players = [Player('Player 1', 1), Player('Player 0', 0)];
        p1Name.textContent = `${players[0].name}'s Score:`;
        p2Name.textContent = `${players[1].name}'s Score:`;
        currentPlayer = players[0];
        document.querySelector('.turn').textContent = `${currentPlayer.name}'s Turn`;
    };

    const getCurrentPlayer = () => currentPlayer;

    const nextTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        document.querySelector('.turn').textContent = `${currentPlayer.name}'s Turn`;
    };

    const playRound = (choice) => {
        updateGameboard(choice);
    };

    const startGame = () => {
        console.log('testing startGame()');
        playRound();
    };

    const checkWinner = () => {
        let currentBoard = Gameboard.getBoard();

        const winningPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], // Rows
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8], // Columns
            [0, 4, 8],
            [2, 4, 6], // Diagonals
        ];

        const winningPattern = (pattern) => {
            let [a, b, c] = pattern;
            return currentBoard[a] !== null && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c];
            // assumes only one pattern is winning
        };

        return winningPatterns.some(winningPattern); // returns whether a winner is found or not (true/false)
    };

    const updateGameboard = (choice) => {
        console.log('testing updateGameboard()');
        let currentBoard = gameboard.getBoard();
        let player = Game.getCurrentPlayer();
        const box = document.querySelector(`.box[data-index="${choice}"]`);

        if (currentBoard[choice - 1] === null) {
            currentBoard[choice - 1] = player.number;
            box.textContent = currentPlayer.number === 1 ? '1' : '0';

            let state = checkWinner();
            console.log(`Winning state: ${state}`);
            if (state) {
                let winner = currentPlayer.number === 1 ? '1' : '0';
                winner === '1' ? addScore(p1Score) : addScore(p2Score);
                console.log(`${winner} wins....`);

                const winnerAnnouncement = document.querySelector('.winner-announcement');
                winnerAnnouncement.style.display = 'flex';
                const winnerText = document.querySelector('.winner-text');
                let winnerIndex = winner === '1' ? 0 : 1;
                let winnerPlayer = players[winnerIndex];
                winnerText.textContent = `${winnerPlayer.name} wins!`;

                disableGameInteraction();

                setTimeout(() => {
                    winnerAnnouncement.style.display = 'none';
                    enableGameInteraction();
                }, 5000);

                const boxes = document.querySelectorAll('.box');
                setTimeout(() => {
                    boxes.forEach((box) => {
                        box.textContent = '';
                    });
                    Game.reset();
                }, 2000);
                return;
            }

            if (!currentBoard.includes(null)) {
                const winnerAnnouncement = document.querySelector('.winner-announcement');
                winnerAnnouncement.style.display = 'flex';
                const winnerText = document.querySelector('.winner-text');
                winnerText.textContent = `It's a tie!`;

                disableGameInteraction();

                setTimeout(() => {
                    winnerAnnouncement.style.display = 'none';
                    enableGameInteraction();
                }, 5000);

                addScore(draws);
                console.log(`no one wins?....`);
                const boxes = document.querySelectorAll('.box');
                setTimeout(() => {
                    boxes.forEach((box) => {
                        box.textContent = '';
                    });
                    Game.reset();
                }, 2000);
                return;
            }

            Game.nextTurn();
        } else {
            // TODO: shaky animation (invalid/red)
            console.log('Invalid move, please try again!');
        }
    };

    const addScore = (score) => {
        score.textContent = (parseInt(score.textContent) + 1).toString();
    };

    const resetScore = () => {
        p1Score.textContent = '0';
        p2Score.textContent = '0';
        draws.textContent = '0';
    };

    const reset = () => {
        console.log('testing RESET button');
        document.querySelector('.turn').textContent = `${currentPlayer.name}'s Turn`;
        const boxes = document.querySelectorAll('.box');
        boxes.forEach((box) => {
            box.disabled = false;
            box.textContent = '';
        });
        gameboard.init();
    };

    return { init, startGame, getCurrentPlayer, nextTurn, playRound, reset, resetScore };
})();

const buttons = () => {
    const resetBtn = document.querySelector('.reset');
    resetBtn.addEventListener('click', () => {
        Game.resetScore();
        Game.reset();
        Game.init(Gameboard);
    });
};

// Initialize button functionality and game
buttons();
Game.init(Gameboard);
