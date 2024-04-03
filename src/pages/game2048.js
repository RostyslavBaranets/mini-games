import React, { Component } from 'react';
import '../css/game2048.scss';

class Game2048 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.startGame(),
      score: 0,
      gameOver: false,
      touchStartX: 0,
      touchStartY: 0,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  startGame() {
    const board = Array(4).fill(null).map(() => Array(4).fill(null));
    this.addRandomTile(board);
    this.addRandomTile(board);
    return board;
  }

  handleKeyPress = (event) => {
    if (!this.state.gameOver) {
      const key = event.key;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        event.preventDefault();
        const direction = key.replace('Arrow', '').toLowerCase();
        this.moveTiles(direction);
      }
    }
  }

  handleTouchStart = (event) => {
    event.preventDefault();
    if (!this.state.gameOver && event.touches.length === 1) {
      const touch = event.touches[0];
      this.setState({
        touchStartX: touch.clientX,
        touchStartY: touch.clientY,
      });
    }
  }

  handleTouchMove = (event) => {
    event.preventDefault();
    if (!this.state.gameOver && event.touches.length === 1) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - this.state.touchStartX;
      const deltaY = touch.clientY - this.state.touchStartY;
      const threshold = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > threshold) {
          this.moveTiles('right');
        } else if (deltaX < -threshold) {
          this.moveTiles('left');
        }
      } else {
        if (deltaY > threshold) {
          this.moveTiles('down');
        } else if (deltaY < -threshold) {
          this.moveTiles('up');
        }
      }
    }
  }

  addRandomTile(board) {
    const emptyCells = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (!board[i][j]) {
          emptyCells.push([i, j]);
        }
      }
    }
    if (emptyCells.length > 0) {
      const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newBoard = [...board];
      newBoard[x][y] = Math.random() < 0.9 ? 2 : 4; // 90% - 2, 10% - 4
      this.setState({ board: newBoard });
    }
  }

  moveTiles(direction) {
    const { board, score } = this.state;
    const newBoard = [...board];
    let newScore = score;
    let moved = false;
  
    switch (direction) {
      case 'up':
        for (let col = 0; col < 4; col++) {
          for (let row = 1; row < 4; row++) {
            if (newBoard[row][col]) {
              let newRow = row;
              while (newRow > 0) {
                if (newBoard[newRow - 1][col] === null) {
                  newBoard[newRow - 1][col] = newBoard[newRow][col];
                  newBoard[newRow][col] = null;
                  moved = true;
                } else if (newBoard[newRow - 1][col] === newBoard[newRow][col]) {
                  newBoard[newRow - 1][col] *= 2;
                  newScore += newBoard[newRow - 1][col];
                  newBoard[newRow][col] = null;
                  moved = true;
                }
                newRow--;
              }
            }
          }
        }
        break;
      case 'down':
        for (let col = 0; col < 4; col++) {
          for (let row = 2; row >= 0; row--) {
            if (newBoard[row][col]) {
              let newRow = row;
              while (newRow < 3) {
                if (newBoard[newRow + 1][col] === null) {
                  newBoard[newRow + 1][col] = newBoard[newRow][col];
                  newBoard[newRow][col] = null;
                  moved = true;
                } else if (newBoard[newRow + 1][col] === newBoard[newRow][col]) {
                  newBoard[newRow + 1][col] *= 2;
                  newScore += newBoard[newRow + 1][col];
                  newBoard[newRow][col] = null;
                  moved = true;
                }
                newRow++;
              }
            }
          }
        }
        break;
      case 'left':
        for (let row = 0; row < 4; row++) {
          for (let col = 1; col < 4; col++) {
            if (newBoard[row][col] !== null) {
              let newCol = col;
              while (newCol > 0) {
                if (newBoard[row][newCol - 1] === null) {
                  newBoard[row][newCol - 1] = newBoard[row][newCol];
                  newBoard[row][newCol] = null;
                  moved = true;
                } else if (newBoard[row][newCol - 1] === newBoard[row][newCol]) {
                  newBoard[row][newCol - 1] *= 2;
                  newScore += newBoard[row][newCol - 1];
                  newBoard[row][newCol] = null;
                  moved = true;
                  break;
                }
                newCol--;
              }
            }
          }
        }
        break;
      case 'right':
        for (let row = 0; row < 4; row++) {
          for (let col = 2; col >= 0; col--) {
            if (newBoard[row][col] !== null) {
              let newCol = col;
              while (newCol < 3) {
                if (newBoard[row][newCol + 1] === null) {
                  newBoard[row][newCol + 1] = newBoard[row][newCol];
                  newBoard[row][newCol] = null;
                  moved = true;
                } else if (newBoard[row][newCol + 1] === newBoard[row][newCol]) {
                  newBoard[row][newCol + 1] *= 2;
                  newScore += newBoard[row][newCol + 1];
                  newBoard[row][newCol] = null;
                  moved = true;
                  break;
                }
                newCol++;
              }
            }
          }
        }
      break;
      default:
        break;
    }
  
    if (moved) {
      this.setState({ board: newBoard, score: newScore });
      this.addRandomTile(board);
      this.checkGameOver(newBoard);
    }
  }

  checkGameOver(board) {
    let gameOver = true;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === null) {
          gameOver = false;
          break;
        }
        if (j !== board[i].length - 1 && board[i][j] === board[i][j + 1]) {
          gameOver = false;
          break;
        }
        if (i !== board.length - 1 && board[i][j] === board[i + 1][j]) {
          gameOver = false;
          break;
        }
      }
    }
    if (gameOver) {
      this.setState({ gameOver: true });
      document.removeEventListener('keydown', this.handleKeyPress);
    }
  }

  restartGame = () => {
    this.setState({
      board: this.startGame(),
      score: 0,
      gameOver: false
    });
  
    document.addEventListener('keydown', this.handleKeyPress);
  }

  render() {
    const { board, score, gameOver } = this.state;
    return (
      <div className="game2048">
        <h1>2048</h1>
        <div className="g2-header">
          <div className="g2-score">Score: {score}</div>
          <button onClick={this.restartGame}>Restart</button>
        </div>
        {gameOver && <h2 className="g2-game-over">Game Over</h2>}
        <div className="g2-board" onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove}>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="g2-row">
              {row.map((tile, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className={`g2-tile tile-${tile}`}>
                  {tile}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Game2048;