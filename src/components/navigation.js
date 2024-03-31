import React from "react";
import { Link } from "react-router-dom";
import '../css/main.scss'

class Navigation extends React.Component {
  render() {
    return (
      <nav>
        <ul className="list">
          <li><Link className="list-item" to="/mini-games/minesweeper"><h2>Minesweeper</h2></Link></li>
          <li>
            <Link className="list-item" to="/mini-games/tetris">
              <h2>Tetris</h2>
            </Link>
          </li>
          <li><Link className="list-item" to="/mini-games/match3"><h2>Match3</h2></Link></li>
          <li>
            <Link className="list-item" to="/mini-games/flappybird">
              <h2>Flappy Bird</h2>
            </Link>
          </li>
          <li><Link className="list-item" to="/mini-games/game2048"><h2>2048</h2></Link></li>
        </ul>
      </nav>
    )
  }
}

export default Navigation;