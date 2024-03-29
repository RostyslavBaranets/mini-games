import React from "react";
import { Link } from "react-router-dom";

class Navigation extends React.Component {
  render() {
    return (
      <nav>
        <ul>
          <li><Link to="/mini-games/minesweeper">Minesweeper</Link></li>
          <li><Link to="/mini-games/tetris">Tetris</Link></li>
          <li><Link to="/mini-games/match3">Match3</Link></li>
          <li><Link to="/mini-games/flappybird">Flappy Bird</Link></li>
          <li><Link to="/mini-games/game2048">2048</Link></li>
        </ul>
      </nav>
    )
  }
}

export default Navigation;