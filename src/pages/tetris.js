import React from 'react';
import '../css/tetris.scss';

const numRows = 25;
const numCols = 15;
const blockSize = window.innerWidth > 600? 25 : 22;

const shapes = [
  [
    [1, 1, 1, 1], // I-Shape
  ],
  [
    [1, 1, 1],
    [0, 1, 0], // T-Shape
  ],
  [
    [1, 1, 1],
    [1, 0, 0], // L-Shape
  ],
  [
    [1, 1, 1],
    [0, 0, 1], // J-Shape
  ],
  [
    [1, 1],
    [1, 1], // O-Shape
  ],
  [
    [1, 1, 0],
    [0, 1, 1], // Z-Shape
  ],
  [
    [0, 1, 1],
    [1, 1, 0], // S-Shape
  ],
];

class Tetris extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.createBoard(),
      currentShape: this.createShape(),
      currentX: Math.floor(numCols / 2) - 1,
      currentY: 0,
      interval: null,
      gameOver: false,
      score: 0,
      shapesGenerated: 0,
      speed: 500,
    };

    this.restartGame = this.restartGame.bind(this);
  }

  componentDidMount() {
    this.startGame();
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleTouchStart = (event) => {
    event.preventDefault();
  
  const { id } = event.target;

  switch (id) {
    case 'left-btn':
      this.moveShapeHorizontally(-1);
      break;
    case 'right-btn':
      this.moveShapeHorizontally(1);
      break;
    case 'rotate-btn':
      this.rotateShape();
      break;
    case 'down-btn':
      this.moveShapeDown();
      break;
    default:
      break;
    }
  };

  createBoard() {
    const board = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(0);
      }
      board.push(row);
    }
    return board;
  }

  createShape() {
    const index = Math.floor(Math.random() * shapes.length);
    return shapes[index];
  }

  drawBlock(ctx, x, y, color = '#c54a8a') {
    const borderWidth = 3;
    ctx.fillStyle = '#da5672';
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, borderWidth);
    ctx.fillRect(x * blockSize, y * blockSize, borderWidth, blockSize);

    ctx.fillStyle = '#7e1fdc';
    ctx.fillRect(x * blockSize, (y + 1) * blockSize - borderWidth, blockSize, borderWidth);
    ctx.fillRect((x + 1) * blockSize - borderWidth, y * blockSize, borderWidth, blockSize);

    ctx.fillStyle = color;
    ctx.fillRect(x * blockSize + borderWidth, y * blockSize + borderWidth, blockSize - 2 * borderWidth, blockSize - 2 * borderWidth); // Заполнение блока без контура
  }

  drawBoard(ctx) {
    ctx.clearRect(0, 0, numCols * blockSize, numRows * blockSize);
    ctx.strokeStyle = 'black';
  
    const { board, currentShape, currentX, currentY } = this.state;
    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < numCols; x++) {
        if (board[y][x] || 
          (y >= currentY && y < currentY + currentShape.length 
          && x >= currentX && x < currentX + currentShape[0].length 
          && currentShape[y - currentY][x - currentX]
          )) {
          this.drawBlock(ctx, x, y, '#0f15ad');
        }
      }
    }
  }

  drawShape(ctx) {
    ctx.fillStyle = 'red';
    const { currentShape, currentX, currentY } = this.state;
    for (let y = 0; y < currentShape.length; y++) {
      for (let x = 0; x < currentShape[y].length; x++) {
        if (currentShape[y][x]) {
          this.drawBlock(ctx, currentX + x, currentY + y);
        }
      }
    }
  }

  isValidMove(dx = 0, rotatedShape = this.state.currentShape) {
    const { currentX, currentY, board } = this.state;
    for (let y = 0; y < rotatedShape.length; y++) {
      for (let x = 0; x < rotatedShape[y].length; x++) {
        if (
          rotatedShape[y][x] &&
          ((currentY + y + 1 >= numRows) ||
          (currentY + y >= 0 && board[currentY + y + 1][currentX + x + dx]))
        ) {
          return false;
        }
      }
    }
    return true;
  }

  moveShapeDown() {
    if (this.isValidMove()) {
      this.setState((prevState) => ({
        currentY: prevState.currentY + 1,
      }));
    } else {
      if (this.state.currentY === 0) {
        this.setState({ gameOver: true });
        clearInterval(this.state.interval);
      } else if (this.state.currentY + this.state.currentShape.length >= numRows) {
        this.mergeShapeWithBoard();
        this.setState({ currentShape: this.createShape(), currentX: Math.floor(numCols / 2) - 1, currentY: 0 });
      } else {
        this.mergeShapeWithBoard();
        this.setState({ currentShape: this.createShape(), currentX: Math.floor(numCols / 2) - 1, currentY: 0 });
      }
    }


  }

  mergeShapeWithBoard() {
    const { currentShape, currentX, currentY, board, shapesGenerated, speed } = this.state;
    for (let y = 0; y < currentShape.length; y++) {
      for (let x = 0; x < currentShape[y].length; x++) {
        if (currentShape[y][x]) {
          board[currentY + y][currentX + x] = 2;
        }
      }
    }
  
    this.setState((prevState) => ({ shapesGenerated: prevState.shapesGenerated + 1 }));

    if ((shapesGenerated + 1) % 10 === 0 && shapesGenerated !== 0 && speed > 200) {
      const newSpeed = speed - 25;
      this.setState({ speed: newSpeed });
      
      clearInterval(this.state.interval);
      const newIntervalId = setInterval(() => {
        this.moveShapeDown();
      }, newSpeed);
      this.setState({ interval: newIntervalId });
    }
    console.log(speed);
    this.removeFilledRows();
  }

  removeFilledRows() {
    const { board, score } = this.state;
    let newBoard = board.filter((row) => row.includes(0));
    const numRowsRemoved = numRows - newBoard.length;
    while (newBoard.length < numRows) {
      newBoard.unshift(Array(numCols).fill(0));
    }

    let newScore = 0;
    if (numRowsRemoved) {
      newScore = score + Math.pow(2, numRowsRemoved - 1) * 100;
    } else {
      newScore = score + 10;
    }
    
    this.setState({ board: newBoard, score: newScore });
  }

  startGame() {
    const intervalId = setInterval(() => {
      this.moveShapeDown();
    }, this.state.speed);
    this.setState({ interval: intervalId });
  }

  handleKeyPress = (event) => {
    event.preventDefault();
    if (!this.state.gameOver) {
      if (event.key === 'ArrowLeft') {
        this.moveShapeHorizontally(-1);
      } else if (event.key === 'ArrowRight') {
        this.moveShapeHorizontally(1);
      } else if (event.key === 'ArrowDown') {
        this.moveShapeDown();
      } else if (event.key === 'ArrowUp') {
        this.rotateShape();
      }
    }
  };

  moveShapeHorizontally(dx) {
    const { currentX, currentShape, currentY, board } = this.state;
    const shapeWidth = currentShape[0].length;
    const maxRight = numCols - shapeWidth;
    const newPosX = currentX + dx;

    let newX;
    if (newPosX < 0) {
      newX = maxRight;
    } else if (newPosX > maxRight) {
      newX = 0;
    } else {
      newX = newPosX;
    }

    let canMove = true;
    for (let y = 0; y < currentShape.length; y++) {
      for (let x = 0; x < currentShape[y].length; x++) {
        if (currentShape[y][x]) {
          const targetX = newX + x;
          const targetY = currentY + y;
          if (board[targetY] && board[targetY][targetX]) {
            canMove = false;
            break;
          }
        }
      }
      if (!canMove) break;
    }

    if (canMove) {
      this.setState({ currentX: newX });
    }
  }

  rotateShape() {
    const { currentShape, currentX } = this.state;
    const rotatedShape = currentShape[0].map((_, index) => currentShape.map((row) => row[index])).reverse();
    let newX = currentX;
    
    if (currentX + rotatedShape[0].length > numCols) {
      newX = numCols - rotatedShape[0].length;
    }
    if (newX < 0) {
      newX = 0;
    }
    if (newX !== currentX) {
      this.setState({ currentX: newX });
    }
    if (this.isValidMove(0, rotatedShape)) {
      this.setState({ currentShape: rotatedShape });
    }
  }

  restartGame() {
    clearInterval(this.state.interval);
    this.setState({
      board: this.createBoard(),
      currentShape: this.createShape(),
      currentX: Math.floor(numCols / 2) - 1,
      currentY: 0,
      interval: null,
      gameOver: false,
      score: 0,
      shapesGenerated: 0,
      speed: 500,
    });
    this.startGame();
  }

  render() {
    const { gameOver, score } = this.state;

    return (
      <div className="tetris">
        <h1>Tetris</h1>
        <div className="t-header">
          <div>Score: {score}</div>
          <button onClick={this.restartGame}>Restart</button>
        </div>
        {gameOver && <h2 className="t-game-over">Game Over</h2>}
        <canvas
          ref={(canvas) => {
            this.canvas = canvas;
            if (canvas) {
              const ctx = canvas.getContext('2d');
              this.drawBoard(ctx);
              this.drawShape(ctx);
            }
          }}
          width={numCols * blockSize}
          height={numRows * blockSize}
        >
        </canvas>
        {blockSize === 22 && <div className="t-btn-block">
          <div className="t-btn-block-left">
            <button id="left-btn" className="t-btn t-btn-left" onTouchStart={this.handleTouchStart}>◄</button>
            <button id="right-btn" className="t-btn t-btn-right" onTouchStart={this.handleTouchStart}>►</button>
          </div>
          <div className="t-btn-block-right">
            <button id="rotate-btn" className="t-btn t-btn-rotate" onTouchStart={this.handleTouchStart}>⟲</button>
            <button id="down-btn" className="t-btn t-btn-down" onTouchStart={this.handleTouchStart}>▼</button>
          </div>
        </div>}
      </div>
    );
  }
}

export default Tetris;