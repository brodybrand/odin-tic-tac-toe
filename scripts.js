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
            id: 1,
            name: playerOneName,
            marker: '',
        },
        {
            id: 2,
            name: playerTwoName,
            marker: ''
        }
    ];

    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const getInactivePlayer = () => {
        return players.filter(player => player !== activePlayer)[0];
    }
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
            console.log('tie');
            gameStatus = 1
        }

        for ( i=0 ; i < winConditions.length; i++) {
            let counter = 0

            for (j = 0; j < winConditions[i].length; j++) {

                if (currentBoard[winConditions[i][j]].getValue() === getActivePlayer().marker) {
                    counter += 1
                    
                    if (counter === 3) {
                        gameStatus = 1;
                        // break;
                        // gameStatus = 1
                        // printNewRound();
                        // newGame();
                    }    
                }
            }
        }
        return gameStatus;
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
        console.log(checkGameStatus());
        if (checkGameStatus() === 1) {
            console.log('gameover')
            return gameStatus = 1;
        }
        switchActivePlayer();
        printNewRound();
    }
    return {playRound, getActivePlayer, switchActivePlayer,
         checkGameStatus, newGame, getInactivePlayer, players}
}

const displayController = () => {
    let game = GameController()

    const cells = document.querySelectorAll('.cell')

    const clearDisplay = () => {
        cells.forEach((cell) => {
            cell.textContent = '*'
        })
    }
    
    const getCellChoice = () => {
        cells.forEach((cell, id) => {
            cell.addEventListener('click', () => {
                choice = id;
                
                let op = game.getInactivePlayer();
                console.log(`Opponent: ${op.name}`)

                if (cell.textContent === op.marker) {
                    console.log('op taken')
                    alert('spot taken')
                    game.playRound(choice);
                } 
                
                else {
                    cell.textContent = (game.getActivePlayer().marker);
                    game.playRound(choice);
                    if (game.checkGameStatus() === 1) {
                        alert('game over');
                    }
                }

            })
        })
    }


    let resetBtn = document.querySelector('#reset-btn');
    resetBtn.addEventListener('click', () => {
        console.log('reset-btn clicked')
        game.newGame();
        clearDisplay();
    })

    let cancelBtns = document.querySelectorAll('#cancel')
    let pOne = document.querySelector('#player-one')
    let pTwo = document.querySelector('#player-two')

    let playerOne = game.players.find(player  => player.id === 1);
    let playerTwo = game.players.find(player => player.id === 2);

    const markers = ['X', 'O'];


    pOne.querySelector('#update').addEventListener('click', () => {
        let dialog = pOne.querySelector('dialog');
        console.log(dialog)
        dialog.showModal();
    })

    pTwo.querySelector('#update').addEventListener('click', () => {
        let dialog = pTwo.querySelector('dialog');
        console.log(dialog)
        dialog.showModal();
    })


    cancelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            let dialog = btn.closest('dialog');
            dialog.close();
        })
    })

    pOne.querySelector('form').addEventListener('submit', () => {
        let username = pOne.querySelector('#name').value;
        let marker = pOne.querySelector('#marker').value;

        playerOne.username = username;

        if (marker !== playerTwo['marker']) {
            playerOne['marker'] = marker;
            playerTwo['marker'] = markers.filter(marker => marker !== playerOne['marker'][0])
        } else console.log('marker taken')
    })

    pTwo.querySelector('form').addEventListener('submit', () => {
        let username = pTwo.querySelector('#name').value
        let marker = pTwo.querySelector('#marker').value;

        playerTwo.username = username;
        
        if (marker !== playerOne['marker']) {
            playerTwo['marker'] = marker;
            playerOne['marker'] = markers.filter(marker => marker !== playerTwo['marker'][0])
        } else console.log('marker taken')
    })

    return {getCellChoice, clearDisplay}
}


const board = GameBoard();
const display = displayController();
const game = GameController();

displayController().getCellChoice();