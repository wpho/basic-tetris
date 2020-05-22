document.addEventListener('DOMContentLoaded', () => {
    var gridContainer = document.getElementsByClassName('grid')[0];
    for (let i = 0; i < 200; i++) {
        gridContainer.innerHTML += '<div></div>';
    }

    for (let i = 0; i < 10; i++) {
        gridContainer.innerHTML += '<div class="taken"></div>';
    }

    var miniGridContainer = document.getElementsByClassName('mini-grid')[0];
    for (let i = 0; i < 16; i++) {
        miniGridContainer.innerHTML += '<div></div>';
    }

    console.log(document.getElementsByClassName('container')[0].innerHTML);

    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let timerId = null;
    let score = 0;

    // The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2], 
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, width, width + 1], 
        [0, 1, width, width + 1],
        [0, 1, width, width + 1], 
        [0, 1, width, width + 1]
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];

    const theTetrominoes =
        [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

    // randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length);
    let nextRandom = 0;
    let current = theTetrominoes[random][currentRotation];

    // draw the Tetramino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
        });
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
        });
    }

    // make the tetromino move down every second
    // timerId = setInterval(moveDown, 500);

    // assign functions to keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keyup', control)

    // move down function
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // freeze function
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            //start a new tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
        }
    }

    // move the tetrominor left, unless is at the edge or there is a blockage
    function moveLeft() {
        undraw();

        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        
        if (!isAtLeftEdge) {
            currentPosition -=1;
        }

        if (current.some(index => squares[currentPosition +index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw();
    }

    // move the tetrominor right
    function moveRight() {
        undraw();

        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1);

        if (!isAtRightEdge) {
            currentPosition +=1;
        }

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }

        draw();   
    }

    //rotate the tetromino
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    // show up next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    // the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // l-tetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // z-tetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2],  // t-tetromino
        [0, 1, displayWidth, displayWidth + 1],  // o-tetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //i-tetromino
    ];

    // display the shape in the mini-grid display
    function displayShape() {
        // remove any trace of a tetromino form the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
        });
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
        });
    }

    // start / stop button
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
        }
    });

    // add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }


});