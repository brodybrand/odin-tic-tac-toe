function GameBoard() {
    const board = [
                Cell(), Cell(), Cell(),
                Cell(), Cell(), Cell(),
                Cell(), Cell(), Cell()
            ];

    for (i=0; i<board.length; i++) {
        board[i].space = i;
    }
    const getSpaceValue = (cell) => {
        return board[cell].getSpace();
    }

    const getBoard = () => board;

    const takenCell = (cell) => {
        taken = 0
        if (board[cell].getValue() !== 0) {
            taken = 1
        }
        return taken
    }

    const placeMarker = (cell, player) => {
        const availableCells = board.filter((cell) => cell.getValue() === 0)
        if (!availableCells) return;

        if (takenCell(cell)) {
            console.log('Spot is taken');
        }
        board[cell].addMarker(player);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((cell) => cell.getValue())
        console.log(boardWithCellValues.slice(0, 3));
        console.log(boardWithCellValues.slice(3, 6));
        console.log(boardWithCellValues.slice(6, 9));
    }

    const clearBoard = () => {
        for (cell in board) {
            board[cell].clearCell();
        }
    }


    return {getBoard, placeMarker, printBoard, takenCell, clearBoard, getSpaceValue}
}

function Cell() {
    
    let value = 0;

    const addMarker = (player) => {
        value = player;
    }

    const getValue = () => value;

    const getSpace = () => space;

    const clearCell = () => {
        value = 0;
    }

    return {addMarker, getValue, clearCell, getSpace}
}


function GameController(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {
    const board = GameBoard();

    const players = [
        {
            name: playerOneName,
            marker: 'X'
        },
        {
            name: playerTwoName,
            marker: 'O'
        }
    ];

    let status = 0

    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`)
    }

    const checkGameStatus = () => {
        const winConditions = [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, 7, 8],
                    [0, 3, 6],
                    [1, 4, 7],
                    [2, 5, 8],
                    [0, 4, 8],
                    [2, 4, 6]
        ];

        let currentBoard = board.getBoard();
        if ((currentBoard.filter((cell) => cell.getValue() === 0)).length === 0) {
            gameStatus = 2
            console.log('tie');
            status = 1
            printNewRound();
            newGame();
            return;
        }
        for ( i=0 ; i < winConditions.length; i++) {
            let counter = 0
            for (j = 0; j < winConditions[i].length; j++) {
                if (currentBoard[winConditions[i][j]].getValue() === getActivePlayer().marker) {
                    counter += 1
                    if (counter === 3) {
                        console.log(`${getActivePlayer().name} has won`)
                        status = 0
                        printNewRound();
                        newGame();
                        return;
                    }
                }
            }
        }
    }


    const newGame = () => {
        board.clearBoard();
        board.printBoard();
        console.log('Game Reset')
    }

    const playRound = (cell) => {
        if (board.takenCell(cell)) {
            console.log('Spot is taken');
            printNewRound();
            return;
        }

        console.log(`${getActivePlayer().name} places ${getActivePlayer().marker} at ${cell}`)
        board.placeMarker(cell, getActivePlayer().marker)
        
        checkGameStatus();
        switchActivePlayer();
        printNewRound();
    }
    return {playRound, getActivePlayer, switchActivePlayer, checkGameStatus, newGame}
}

const displayController = () => {
    const cells = document.querySelectorAll('.cell')
    const idConvert = {
                    'zero': 0, 'one': 1, 'two': 2,
                    'three': 3, 'four': 4, 'five': 5,
                    'six': 6, 'seven': 7, 'eight': 8
                }

    const clearDisplay = () => {
        cells.forEach((cell) => {
            cell.textContent = '*'
        })
    }
    
    const getCellChoice = () => {
        cells.forEach((cell, id) => {
            cell.addEventListener('click', () => {
                choice = id;
                console.log(choice);
                cell.textContent = (game.getActivePlayer().marker);
                game.playRound(choice);
            })
        })
    }


    let resetBtn = document.querySelector('#reset-btn');
    resetBtn.addEventListener('click', async () => {
        console.log('reset-btn clicked')
        game.newGame();
        clearDisplay();
        getCellChoice();
    })


    return {getCellChoice, clearDisplay}
}


const board = GameBoard();
const display = displayController();
const game = GameController();

displayController().getCellChoice();