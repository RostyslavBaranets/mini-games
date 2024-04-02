import React from 'react';
import '../css/minesweeper.scss';

const numRows = 10;
const numCols = 10;
const numMines = 10;

class Minesweeper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      grid: [],
      gameOver: false,
      win: false,
      timer: 0,
      timerInterval: null,
      started: false,
      flags: numMines,
      flagMode: false,
    };
  }

  componentDidMount() {
    this.initializeGame();
  }

  componentWillUnmount() {
    clearInterval(this.state.timerInterval);
  }

  initializeGame() {
    const newGrid = this.createGrid();
    const gridWithMines = this.plantMines(newGrid);
    const finalGrid = this.calculateNeighbors(gridWithMines);

    this.setState({
      grid: finalGrid,
      gameOver: false,
      win: false,
      timer: 0,
      timerInterval: null,
      started: false,
      flags: numMines,
      flagMode: false,
    });
  }

  createGrid() {
    const newGrid = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push({ x: i, y: j, isMine: false, revealed: false, neighbors: 0 });
      }
      newGrid.push(row);
    }
    return newGrid;
  }

  plantMines(grid) {
    let minesPlanted = 0;
    while (minesPlanted < numMines) {
      const randX = Math.floor(Math.random() * numRows);
      const randY = Math.floor(Math.random() * numCols);
      if (!grid[randX][randY].isMine) {
        grid[randX][randY].isMine = true;
        minesPlanted++;
      }
    }
    return grid;
  }

  calculateNeighbors(grid) {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        if (!grid[i][j].isMine) {
          let count = 0;
          directions.forEach(([x, y]) => {
            const newX = i + x;
            const newY = j + y;
            if (newX >= 0 && newX < numRows && newY >= 0 && newY < numCols) {
              if (grid[newX][newY].isMine) {
                count++;
              }
            }
          });
          grid[i][j].neighbors = count;
        }
      }
    }
    return grid;
  }

  handleClick(e, x, y) {
    const { gameOver, win, grid, started, flagMode } = this.state;
    if (gameOver || win || grid[x][y].revealed || grid[x][y].flagged) return;
    
    if (flagMode) {
      this.handleRightClick(e, x, y);
      return;
    }

    let newGrid = [...grid];
    
    newGrid[x][y].revealed = true;

    if (newGrid[x][y].isMine) {
      this.handleGameOver();
      return;
    }
    
    if (!started) {
      this.setState({ started: true }, () => {
        this.startTimer();
      })
    }

    if (newGrid[x][y].neighbors === 0) {
      this.handleRevealEmpty(x, y, newGrid);
    }

    this.checkFlags(newGrid);

    this.checkWin(newGrid);
    
    this.setState({ grid: newGrid });
  }

  handleRightClick(e, x, y) {
    e.preventDefault();
    const { gameOver, win, grid, started, flags } = this.state;
    const newGrid = [...grid];
    const cell = newGrid[x][y];

    if (!cell.revealed && !gameOver && !win && started) {
      if (flags > 0) {
        cell.flagged = !cell.flagged;

        this.setState(prevState => ({
        grid: newGrid,
        flags: cell.flagged ? prevState.flags - 1 : prevState.flags + 1,
        }));
      } else if (cell.flagged) {
        cell.flagged = !cell.flagged;

        this.setState(prevState => ({
        grid: newGrid,
        flags: prevState.flags + 1,
        }));
      }
    }
  }

  handleRevealEmpty(x, y, newGrid) {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    directions.forEach(([dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;
      if (newX >= 0 && newX < numRows && newY >= 0 && newY < numCols && !newGrid[newX][newY].revealed) {
        if (newGrid[newX][newY].flagged) {
          newGrid[newX][newY].flagged = !newGrid[newX][newY].flagged;
        }
        newGrid[newX][newY].revealed = true;
        if (newGrid[newX][newY].neighbors === 0) {
          this.handleRevealEmpty(newX, newY, newGrid);
        }
      }
    });
  }

  handleGameOver() {
    clearInterval(this.state.timerInterval);
    const { grid } = this.state;
    const newGrid = grid.map(row =>
      row.map(cell => ({
        ...cell,
        revealed: cell.isMine ? true : cell.revealed,
      }))
    );
    this.setState({ gameOver: true, grid: newGrid });
  }

  checkWin(newGrid) {
    let countRevealed = 0;
    let countSafeCells = 0;
    newGrid.forEach(row => {
      row.forEach(cell => {
        if (cell.revealed) countRevealed++;
        if (!cell.isMine) countSafeCells++;
      });
    });
    if (countRevealed === countSafeCells) {
      clearInterval(this.state.timerInterval);
      this.setState({ win: true }); 
    }
  }

  checkFlags(newGrid) {
    let countFlagged = 0;
    newGrid.forEach(row => {
      row.forEach(cell => {
        if (cell.flagged) countFlagged++;
      });
    });
    this.setState({ flags: numMines - countFlagged });
  }

  startTimer() {
    const timerInterval = setInterval(() => {
      this.setState(prevState => ({
        timer: prevState.timer + 1,
      }));
    }, 1000);
    this.setState({ timerInterval });
  }

  resetGame() {
    clearInterval(this.state.timerInterval);
    this.initializeGame();
  }

  renderCell(cell) {
    let content = '';
    if (cell.revealed) {
      if (cell.isMine) {
        content = '💣';
      } else if (cell.neighbors > 0) {
        content = cell.neighbors;
      }
    } else if (cell.flagged) {
      content = '🚩';
    }

    return (
      <div
        key={`${cell.x}-${cell.y}`}
        className={`ms-cell ${cell.revealed ? 'revealed' : ''}`}
        onClick={(e) => this.handleClick(e, cell.x, cell.y)}
        onContextMenu={(e) => this.handleRightClick(e, cell.x, cell.y)}
      >
        {content}
      </div>
    );
  }

  toggleFlagMode = () => {
    this.setState(prevState => ({
      flagMode: !prevState.flagMode,
    }));
  }

  render() {
    const { grid, gameOver, win, timer, flags, flagMode } = this.state;

    return (
      <div className="minesweeper">
        <h1>Minesweeper</h1>
        <div className="ms-header">
          <div className="ms-timer">Time: {timer}</div>
          <div className="ms-flags">
            <button className={`ms-flag-btn ${flagMode ? 'active' : ''}`} onClick={this.toggleFlagMode}>🚩</button>
            : {flags}
            </div>
          <button onClick={() => this.resetGame()}>New Game</button>
        </div>
        <div className="ms-grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="ms-row">
              {row.map((cell) => this.renderCell(cell))}
            </div>
          ))}
        </div>
        {gameOver && <h2 className="ms-message">Game Over</h2>}
        {win && <h2 className="ms-message">You Win!</h2>}
      </div>
    );
  }
}

export default Minesweeper;