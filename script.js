const lTetromino = 'firstShape'
const zTetromino = 'secondShape'
const oTetromino = 'thirdShape'
const iTetromino = 'fourthShape'
const tTetromino = 'fifthShape'

const tetrominoes = [lTetromino, zTetromino, oTetromino, iTetromino, tTetromino];

window.onload() = function() {
    var container = document.getElementsByClassName('grid')[0];
    for (let i=0; i < 200; i++) {
        container.innerHTML += '<div></div>';
    }
}
