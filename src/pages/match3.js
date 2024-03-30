import React from 'react';
import '../css/match3.scss';

const ROWS = 8;
const COLS = 8;
const CELL_SIZE = 50;
const GAME_DURATION = 3 * 60 * 1000;

class Match3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.createBoard(),
      selectedCell: null,
      isAnimating: false,
      score: 0,
      timeLeft: GAME_DURATION,
      gameOver: false,
      
    };
    this.isMatched = false;
    this.restartGame = this.restartGame.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(),1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState(prevState => ({ timeLeft: prevState.timeLeft - 1000 }), () => {
      if (this.state.timeLeft <= 0) {
        clearInterval(this.timerID);
        this.setState({ gameOver: true });
      }
    });
  }

  createBoard() {
    const board = [];
    for (let row = 0; row < ROWS; row++) {
      const newRow = [];
      let prevCell = null;
      let prevPrevCell = null;
      for (let col = 0; col < COLS; col++) {
        let newCell = this.randomUniqueCell(prevCell, prevPrevCell, board, row, col);
        newRow.push(newCell);
        prevPrevCell = prevCell;
        prevCell = newCell;
      }
      board.push(newRow);
    }
    return board;
  }

  randomUniqueCell(prevCell, prevPrevCell, board, row, col) {
    let newCell = this.randomCell();
    while (newCell === prevCell && newCell === prevPrevCell) {
      newCell = this.randomCell();
    }
    while (
      row >= 2 &&
      newCell === board[row - 1][col] &&
      newCell === board[row - 2][col]
    ) {
      newCell = this.randomCell();
    }
    return newCell;
}

  randomCell() {
    const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  handleClick(row, col) {
    if (this.state.isAnimating || this.state.gameOver) return;

    this.isMatched = false;
    const { selectedCell } = this.state;

    if (selectedCell) {
      if (this.areNeighbors(selectedCell, { row, col })) {
        const newBoard = this.swapCells(selectedCell, { row, col });
        this.setState({ board: newBoard, isAnimating: true });

        setTimeout(() => {
          this.matches();
        }, 300);

        setTimeout(() => {
          if (this.isMatched === false) {
            const newBoard = this.swapCells({ row, col}, selectedCell );
            this.setState({ board: newBoard });
          }
        }, 300);
        this.setState({ selectedCell: null });
      } else {
        this.setState({ selectedCell: { row, col } });
      }
    } else {
      this.setState({ selectedCell: { row, col } });
    }
  }

  removeCellsInRow(row, startCol, endCol, board) {
    for (let col = startCol; col <= endCol; col++) {
      board[row][col] = null;
    }
  };

  removeCellsInCol(col, startRow, endRow, board) {
    for (let row = startRow; row <= endRow; row++) {
      board[row][col] = null;
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

  matches() {
    const { board, score } = this.state;
    let newBoard = [...board];
    let foundMatch = false;
    let newScore = score;
  
    for (let row = 0; row < ROWS; row++) {
      let matchCount = 1;
      for (let col = 0; col < COLS - 1; col++) {
        if (board[row][col] && board[row][col] === board[row][col + 1]) {
          matchCount++;
          if (matchCount >= 3 && (col === COLS - 2 || board[row][col] !== board[row][col + 2])) {
            this.removeCellsInRow(row, col - matchCount + 2, col + 1, newBoard);
            newScore += this.calculateScore(matchCount);
            foundMatch = true;
            matchCount = 1;
          }
        } else {
          if (matchCount >= 3) {
            this.removeCellsInRow(row, col - matchCount + 1, col, newBoard);
            foundMatch = true;
            newScore += this.calculateScore(matchCount);
          }
          matchCount = 1;
        }
      }
    }
  
    for (let col = 0; col < COLS; col++) {
      let matchCount = 1;
      for (let row = 0; row < ROWS - 1; row++) {
        if (board[row][col] && board[row][col] === board[row + 1][col]) {
          matchCount++;
          if (matchCount >= 3 && (row === ROWS - 2 || board[row][col] !== board[row + 2][col])) {
            this.removeCellsInCol(col, row - matchCount + 2, row + 1, newBoard);
            foundMatch = true;
            newScore += this.calculateScore(matchCount);
            matchCount = 1;
          }
        } else {
          if (matchCount >= 3) {
            this.removeCellsInCol(col, row - matchCount + 1, row, board);
            foundMatch = true;
            newScore += this.calculateScore(matchCount);
          }
          matchCount = 1;
        }
      }
    }

    if (foundMatch) {
      this.isMatched = foundMatch;
      console.log(this.isMatched, foundMatch)
      setTimeout(() => {
        this.setState({ board: newBoard, score: newScore });
        this.fallingCell();
      }, 300);
    } else {
      this.setState({ isAnimating: false });
    }
  }

  calculateScore(matchCount) {
    return (matchCount % 3 + 1) * 10;
  }

  fallingCell() {
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
        this.fallingCell();
      } else {
        this.matches();
      }
    }, 300);
  }

  restartGame() {
    clearInterval(this.timerID);
    this.setState({
      board: this.createBoard(),
      selectedCell: null,
      isAnimating: false,
      score: 0,
      timeLeft: GAME_DURATION,
      gameOver: false
    }, () => {
      this.timerID = setInterval(() => this.tick(), 1000);
    });
  }

  render() {
    const { board, score, timeLeft, gameOver } = this.state;
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
      <div className="match3-game">
        <h1>Match3</h1>
        <div className="m3-header">
          <div className="m3-score">Score: {score}</div>
          <div className="m3-time">Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</div>
          <button onClick={this.restartGame}>Restart</button>
        </div>
        <div className="m3-board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="m3-row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`m3-cell ${cell}`}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    lineHeight: `${CELL_SIZE}px`
                  }}
                  onClick={() => this.handleClick(rowIndex, colIndex)}
                >
                </div>
              ))}
            </div>
          ))}
        </div>
        {gameOver && <h2 className="m3-game-over">Game Over</h2>}
      </div>
    );
  }
}

export default Match3;