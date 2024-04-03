document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let grid = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));

    // Generate a new number (2 or 4) in a random empty cell
    function generateNumber() {
        const availableCells = [];
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 0) {
                    availableCells.push({ row: rowIndex, col: colIndex });
                }
            });
        });

        if (availableCells.length > 0) {
            const { row, col } = availableCells[Math.floor(Math.random() * availableCells.length)];
            grid[row][col] = Math.random() < 0.9 ? 2 : 4;
            updateBoard();
        } else {
            // Game over logic
            console.log("Game Over!");
        }
    }

    // Update the game board with current grid state
    function updateBoard() {
        board.innerHTML = '';
        grid.forEach(row => {
            row.forEach(cell => {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.textContent = cell !== 0 ? cell : '';
                if (cell === 0) tile.classList.add('tile-empty');
                board.appendChild(tile);
            });
        });
        scoreDisplay.textContent = score;
    }

    // Reset the game to initial state
    function resetGame() {
        grid = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
        score = 0;
        updateBoard();
        generateNumber();
        generateNumber();
    }

    // Handle keyboard inputs for moving tiles
    document.addEventListener('keydown', (event) => {
        if (!isGameOver()) {
            let moved = false;
            switch (event.key) {
                case 'ArrowLeft':
                    moved = moveLeft();
                    break;
                case 'ArrowRight':
                    moved = moveRight();
                    break;
                case 'ArrowUp':
                    moved = moveUp();
                    break;
                case 'ArrowDown':
                    moved = moveDown();
                    break;
            }
            if (moved) {
                generateNumber();
                updateBoard();
                if (isGameOver()) {
                    console.log("Game Over!");
                }
            }
        }
    });

    // Move tiles to the left and merge adjacent identical tiles
    function moveLeft() {
        let moved = false;
        grid.forEach(row => {
            for (let i = 0; i < row.length - 1; i++) {
                for (let j = i + 1; j < row.length; j++) {
                    if (row[j] !== 0) {
                        if (row[i] === 0) {
                            row[i] = row[j];
                            row[j] = 0;
                            moved = true;
                        } else if (row[i] === row[j]) {
                            row[i] *= 2;
                            score += row[i];
                            row[j] = 0;
                            moved = true;
                            break;
                        } else {
                            break;
                        }
                    }
                }
            }
        });
        return moved;
    }

    // Move tiles to the right
    function moveRight() {
        reverseGrid();
        const moved = moveLeft();
        reverseGrid();
        return moved;
    }

    // Move tiles upwards
    function moveUp() {
        transposeGrid();
        const moved = moveLeft();
        transposeGrid();
        return moved;
    }

    // Move tiles downwards
    function moveDown() {
        transposeGrid();
        const moved = moveRight();
        transposeGrid();
        return moved;
    }

    // Reverse the grid
    function reverseGrid() {
        grid.forEach(row => row.reverse());
    }

    // Transpose the grid (swap rows and columns)
    function transposeGrid() {
        grid = grid[0].map((col, i) => grid.map(row => row[i]));
    }

    // Check if the game is over
    function isGameOver() {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === 0) {
                    return false;
                }
                if (j !== grid[i].length - 1 && grid[i][j] === grid[i][j + 1]) {
                    return false;
                }
                if (i !== grid.length - 1 && grid[i][j] === grid[i + 1][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    // Initialize the game
    function init() {
        resetGame();
    }

    // Start the game
    init();
});
