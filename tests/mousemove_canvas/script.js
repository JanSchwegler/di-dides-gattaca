document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');
    const squareSize = 25;
    const squares = [];

    // Draw squares on the canvas
    for (let y = 0; y < canvas.height; y += squareSize) {
        for (let x = 0; x < canvas.width; x += squareSize) {
            context.strokeRect(x, y, squareSize, squareSize);
            squares.push({x, y, color: 'transparent'});
        }
    }

    // Hover effect
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Redraw squares with hover effect
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let square of squares) {
            if (mouseX > square.x && mouseX < square.x + squareSize &&
                mouseY > square.y && mouseY < square.y + squareSize) {
                square.color = 'yellow';
                setTimeout(() => {
                    square.color = 'transparent';
                    drawSquares();
                }, 300);
            }
            context.fillStyle = square.color;
            context.fillRect(square.x, square.y, squareSize, squareSize);
            context.strokeRect(square.x, square.y, squareSize, squareSize);
        }
    });

    // Function to draw all squares
    function drawSquares() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let square of squares) {
            context.fillStyle = square.color;
            context.fillRect(square.x, square.y, squareSize, squareSize);
            context.strokeRect(square.x, square.y, squareSize, squareSize);
        }
    }
});
