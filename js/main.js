'use strict'
var FLAG = '🚩'
var MINES = '💣'
var WIN = ' 😎'
var LOSE = '🤯'
var NORMAL = '🤩'
var gMinesCounter = 0
var gStartGame = false
var firstClick = false
var GAMEOVER = false
var timeInterval;
var gTime;

var gBoard = {

}

var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isWin: false
}


function initGame() {
    GAMEOVER = false
    gGame.isOn = true
    gBoard = buildBoard();
    renderBoard(gBoard);
    stop()
    // var elHappy=document.querySelector('.Start');
    // elHappy.innerText=NORMAL;

}

function startGame() {
    if (GAMEOVER) return
    gGame.isOn = true
    stop()
    gTime = Date.now();
    timeInterval = setInterval(gameTimer, 10);
}


// Builds the board   Set mines at random locations Call setMinesNegsCount() Return the created board 
function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {

            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    gBoard = board;
    return board;
}

// Render the board as a <table> to the page
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>\n';

        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = board[i][j]
            var id = `${'r' + i + 'c' + j}`
            strHTML += `\t<td id=${id}  onmousedown="cellMarked(${i},${j})" onclick="cellClicked(${id}, ${i},${j})">${renderCellContent(currCell)} </td>
            \n`;
        }
        strHTML += '</tr>\n';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function getCellMinesCount(cellI, cellJ, board) {
    var startIdxI = cellI - 1;
    var endIdxI = cellI + 1;
    var startIdxJ = cellJ - 1;
    var endIdxJ = cellJ + 1;
    var countMines = 0;
    if (cellI === 0) startIdxI = cellI;

    else if (cellI === gLevel.SIZE - 1) endIdxI = cellI;
    if (cellJ === 0) startIdxJ = cellJ;
    else if (cellJ === gLevel.SIZE - 1) endIdxJ = cellJ;
  
    for (var i = startIdxI; i <= endIdxI; i++) {

        for (var j = startIdxJ; j <= endIdxJ; j++) {
            if (i !== cellI || j !== cellJ) {

                if (board[i][j].isMine) {
                    countMines++;
                   

                }
            }

        }
    }
    return countMines;
}


// Count mines around each cell and set the cell's minesAroundCount. 

function setMinesNegsCount(board) {

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (board[i][j] !== MINES) {
                board[i][j].minesAroundCount = getCellMinesCount(i, j, board);
            }
        }
    }
    renderBoard(board);
}


// Called when a cell (td) is clicked 
function cellClicked(i, j) {
    if (GAMEOVER) return
    var cell;
    if (gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true;
        renderBoard(gBoard);


        checkGameOver()

    }

    if (gBoard[i][j] !== MINES && !GAMEOVER) {
        gBoard[i][j].isShown = true;
        renderBoard(gBoard);
        cell = gBoard[i][j];
    }
    else if (gBoard[i][j].isMine === true) {
        gBoard[i][j].isShown = false;
        gGame.isOn = false
        gGame.isWin = false
    }
    if (!firstClick) {
        expandShown(gBoard, cell, i, j)
        setMines()
        setMinesNegsCount(gBoard)
        startGame()
    }

    firstClick = true
    renderBoard(gBoard)
}



function setMines() {

    switch (gLevel.SIZE) {
        case gLevel.SIZE === 4:
            gLevel.MINES = 2;
            break;
        case gLevel.SIZE === 8:
            gLevel.MINES = 12;
            break;
        case gLevel.SIZE === 12:
            gLevel.MINES = 30
            break;
    }
    var cnt = 0
    for (var i = 0; i < gLevel.MINES; i++) {
        var posI = getRandomInteger(0, gLevel.SIZE);
        var posJ = getRandomInteger(0, gLevel.SIZE);
        if (gBoard[posI][posJ].isShown === false) {
            if (cnt < gLevel.MINES) {
                gBoard[posI][posJ].isMine = true
                cnt++
            }

        } else {
            while (gBoard[posI][posJ].isShown === true) {

                posI = getRandomInteger(0, gLevel.SIZE);
                posJ = getRandomInteger(0, gLevel.SIZE);
                if (gBoard[posI][posJ].isShown === false) {
                    if (cnt < gLevel.MINES) {
                        gBoard[posI][posJ].isMine = true
                        cnt++
                    }
                }
            }
        }

    }
    
    renderBoard(gBoard)
}

function renderCellContent(cell) {
    if (cell.isShown) {
        if (cell.isMine) return MINES;
        if (cell.minesAroundCount === 0) {
           
            return '-'
        }

        else {
            return cell.minesAroundCount
        }
    }
    if (cell.isMarked) return FLAG

    return ''
}

function cellMarked(i, j) {
    checkWin()

    //prevent menu apear on right click event
    document.addEventListener('contextmenu', event => event.preventDefault())
    var e = window.event;
    var rightClick = e.button == 2

    if (rightClick)
        gBoard[i][j].isMarked = true
    else {
        cellClicked(i, j)
    }

    renderBoard(gBoard)

}



function expandShown(board, cell, i, j) {
    getNeighbors(cell, i, j, board)
}


function getNeighbors(currCell, cellI, cellJ, board) {
    var startIdxI = cellI - 1;
    var endIdxI = cellI + 1;
    var startIdxJ = cellJ - 1;
    var endIdxJ = cellJ + 1;

    if (cellI === 0) startIdxI = cellI;
    else if (cellI === gLevel.SIZE - 1) endIdxI = cellI;
    if (cellJ === 0) startIdxJ = cellJ
    else if (cellJ === gLevel.SIZE - 1) endIdxJ = cellJ;

    for (var i = startIdxI; i <= endIdxI; i++) {
        for (var j = startIdxJ; j <= endIdxJ; j++) {
            board[i][j].isShown = true;
        }
    }
}
// Game ends when all mines are marked, and all the other cells are shown
function checkGameOver() {
    GAMEOVER = true;
    gGame.isWin = false;
    gGame.isOn = false;
    firstClick = false;
    stop()

    alert("Game over!");

}

function checkWin() {
    var cnt = 1;
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isShown === true || gBoard[i][j].isMarked) {
                cnt++
            }
        }
    }
    if (cnt === gLevel.SIZE * gLevel.SIZE) {
        alert('You Won!');
        stop()


    }
}

function setLevel(elBtn) {
    var btnClassName = elBtn.className
    if (btnClassName === 'levels easy-level') {
        gLevel.SIZE = 4;
    } else if (btnClassName === 'levels medium-level') {
        gLevel.SIZE = 8;
    } else if (btnClassName === 'levels hard-level') {
        gLevel.SIZE = 12;
    }

    stop()
    initGame()

}


function gameTimer() {
    var currTime = Date.now();
    var elLogTime = document.querySelector('.time-log');
    var timePassed = currTime - gTime;
    var timePassedSec = (timePassed / 1000).toFixed(3)
    elLogTime.innerText = `Time:${timePassedSec}`
}

function stop() {
    firstClick = false;
    gGame.isOn = false;
    clearInterval(timeInterval);

}

