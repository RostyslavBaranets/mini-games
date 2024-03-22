import React from "react";
import { Link } from "react-router-dom";

class Navigation extends React.Component {
  render() {
    return (
      <nav>
        <ul>
          <li><Link to="/minesweeper">Minesweeper</Link></li>
          <li><Link to="/tetris">Tetris</Link></li>
          <li><Link to="/match3">Match3</Link></li>
          <li><Link to="/flappybird">Flappy Bird</Link></li>
        </ul>
      </nav>
    )
  }
}

export default Navigation;