import React, { Component } from 'react';
import '../css/tetris.css';

const numRows = 20;
const numCols = 10;
const blockSize = 30;

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

class Tetris extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.createBoard(),
      currentShape: this.createShape(),
      currentX: Math.floor(numCols / 2) - 1,
      currentY: 0,
      intervalId: null,
      gameOver: false,
    };
  }

  componentDidMount() {
    this.startGame();
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
    document.removeEventListener('keydown', this.handleKeyPress);
  }

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

  drawBlock(ctx, x, y) {
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
  }

  drawBoard(ctx) {
    ctx.clearRect(0, 0, numCols * blockSize, numRows * blockSize);
    ctx.strokeStyle = 'black';

    const { board } = this.state;
    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < numCols; x++) {
        if (board[y][x]) {
          ctx.fillStyle = 'blue';
          this.drawBlock(ctx, x, y);
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
      this.mergeShapeWithBoard();
      this.setState({ currentShape: this.createShape(), currentX: Math.floor(numCols / 2) - 1, currentY: 0 });
    }

    if (this.state.currentY + this.state.currentShape.length >= numRows) {
      this.mergeShapeWithBoard();
      this.setState({ currentShape: this.createShape(), currentX: Math.floor(numCols / 2) - 1, currentY: 0 });
    }
  }

  mergeShapeWithBoard() {
    const { currentShape, currentX, currentY, board } = this.state;
    for (let y = 0; y < currentShape.length; y++) {
      for (let x = 0; x < currentShape[y].length; x++) {
        if (currentShape[y][x]) {
          board[currentY + y][currentX + x] = 2;
        }
      }
    }
    this.removeFilledRows();
  }

  removeFilledRows() {
    const { board } = this.state;
    let newBoard = board.filter((row) => row.includes(0));
    while (newBoard.length < numRows) {
      newBoard.unshift(Array(numCols).fill(0));
    }
    this.setState({ board: newBoard });
  }

  startGame() {
    const intervalId = setInterval(() => {
      this.moveShapeDown();
    }, 500);
    this.setState({ intervalId });
  }

  handleKeyPress = (event) => {
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
    if (this.isValidMove(dx)) {
      this.setState((prevState) => ({
        currentX: prevState.currentX + dx,
      }));
    }
  }

  rotateShape() {
    const { currentShape } = this.state;
    const rotatedShape = currentShape[0].map((_, index) => currentShape.map((row) => row[index])).reverse();
    if (this.isValidMove(0, rotatedShape)) {
      this.setState({ currentShape: rotatedShape });
    }
  }

  render() {
    const { gameOver } = this.state;

    return (
      <div className="container">
        <h1>Tetris</h1>
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
        ></canvas>
        {gameOver && <div className="game-over">Game Over</div>}
      </div>
    );
  }
}

export default Tetris;