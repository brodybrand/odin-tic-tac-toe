function GameBoard() {
    const board = [
                Cell(), Cell(), Cell(),
                Cell(), Cell(), Cell(),
                Cell(), Cell(), Cell()
            ];

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

    return {getBoard, placeMarker, printBoard, takenCell}
}

function Cell() {
    let value = 0;

    const addMarker = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {addMarker, getValue}
}


function GameController(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {
    const board = GameBoard();

    const players = [
        {
            name: playerOneName,
            marker: 1
        },
        {
            name: playerTwoName,
            marker: 2
        }
    ];

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

        let gameStatus = 0;

        let currentBoard = board.getBoard();
        if ((currentBoard.filter((cell) => cell.getValue() === 0)).length === 0) {
            gameStatus = 2
            console.log('tie');
            return;
        }
        for ( i=0 ; i < winConditions.length; i++) {
            let counter = 0
            for (j = 0; j < winConditions[i].length; j++) {
                if (currentBoard[winConditions[i][j]].getValue() === getActivePlayer().marker) {
                    counter += 1
                    if (counter === 3) {
                        console.log(`${getActivePlayer().name} has won`)
                        gameStatus = 1
                        return;
                    }
                }
            }
        }
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
    return {playRound, getActivePlayer, switchActivePlayer, checkGameStatus}
}

const game = GameController();