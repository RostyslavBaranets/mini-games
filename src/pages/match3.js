import React, { Component } from 'react';
import '../css/match3.css';

const ROWS = 8;
const COLS = 8;
const CELL_SIZE = 50;

class Match3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.createBoard(),
      selectedCell: null,
      isAnimating: false
    };
  }

  createBoard() {
    const board = [];
    for (let row = 0; row < ROWS; row++) {
      const newRow = [];
      for (let col = 0; col < COLS; col++) {
        newRow.push(this.randomCell());
      }
      board.push(newRow);
    }
    return board;
  }

  randomCell() {
    const colors = ['red', 'green', 'blue', 'yellow'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  handleClick = (row, col) => {
    if (this.state.isAnimating) return;

    const { selectedCell } = this.state;
    if (selectedCell) {
      if (this.areNeighbors(selectedCell, { row, col })) {
        const newBoard = this.swapCells(selectedCell, { row, col });
        this.setState({ board: newBoard, selectedCell: null, isAnimating: true });
        setTimeout(() => {
          this.handleMatches();
        }, 300);
      } else {
        this.setState({ selectedCell: { row, col } });
      }
    } else {
      this.setState({ selectedCell: { row, col } });
    }
  };

  areNeighbors(cell1, cell2) {
    const { row: row1, col: col1 } = cell1;
    const { row: row2, col: col2 } = cell2;
    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
  }

  swapCells(cell1, cell2) {
    const { board } = this.state;
    const newBoard = [...board];
    const temp = newBoard[cell1.row][cell1.col];
    newBoard[cell1.row][cell1.col] = newBoard[cell2.row][cell2.col];
    newBoard[cell2.row][cell2.col] = temp;
    return newBoard;
  }

  handleMatches() {
    const { board } = this.state;
    let newBoard = [...board];
    let foundMatch = false;
  
    const removeNeighbors = (row, col, color) => {
      if (
        row < 0 || row >= ROWS || col < 0 || col >= COLS ||
        newBoard[row][col] !== color || newBoard[row][col] === null
      ) {
        return;
      }
      newBoard[row][col] = null;

      removeNeighbors(row + 1, col, color);
      removeNeighbors(row - 1, col, color);
      removeNeighbors(row, col + 1, color);
      removeNeighbors(row, col - 1, color);
    };
  
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS - 2; col++) {
        if (
          board[row][col] &&
          board[row][col] === board[row][col + 1] &&
          board[row][col] === board[row][col + 2]
        ) {
          removeNeighbors(row, col, board[row][col]);
          foundMatch = true;
        }
      }
    }
  
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS - 2; row++) {
        if (
          board[row][col] &&
          board[row][col] === board[row + 1][col] &&
          board[row][col] === board[row + 2][col]
        ) {
          removeNeighbors(row, col, board[row][col]);
          foundMatch = true;
        }
      }
    }
  
    if (foundMatch) {
      this.setState({ board: newBoard });
      setTimeout(() => {
        this.handleFalling();
      }, 300);
    } else {
      this.setState({ isAnimating: false });
    }
  }

  handleFalling() {
    const { board } = this.state;
    let newBoard = [...board];
    let emptyCells = 0;

    for (let col = 0; col < COLS; col++) {
      for (let row = ROWS - 1; row >= 0; row--) {
        if (!newBoard[row][col] && row > 0 && newBoard[row - 1][col]) {
          newBoard[row][col] = newBoard[row - 1][col];
          newBoard[row - 1][col] = null;
        } else if (!newBoard[row][col] && row === 0) {
          newBoard[row][col] = this.randomCell();
        }
      }
    }

    for (let col = 0; col < COLS; col++) {
      for (let row = ROWS - 1; row >= 0; row--) {
        if (!newBoard[row][col]) {
          emptyCells++;
        }
      }
    }
    
    setTimeout(() => {
      this.setState({ board: newBoard });
      if (emptyCells > 0) {
        this.handleFalling()
      } else {
        this.handleMatches();
      }
    }, 300);
  }

  render() {
    const { board } = this.state;

    return (
      <div className="match3-game">
        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`cell ${cell}`}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    lineHeight: `${CELL_SIZE}px`
                  }}
                  onClick={() => this.handleClick(rowIndex, colIndex)}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Match3;