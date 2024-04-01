import React from 'react';
import Header from './components/header';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navigation from './components/navigation';
import Tetris from './pages/tetris';
import Minesweeper from './pages/minesweeper';
import Match3 from './pages/match3';
import FlappyBird from './pages/flappybird';
import Game2048 from './pages/game2048';
import './css/main.scss'

class App extends React.Component{
  render() {
    return (
      <div className='body'>
        <Header />
        <Router>
          <main>
            <Navigation />
            <Routes>
              <Route path="/mini-games" element={<Navigate to="/mini-games/minesweeper" />} />
              <Route path="/mini-games/minesweeper" element={<Minesweeper />} />
              <Route path="/mini-games/tetris" element={<Tetris />} />
              <Route path="/mini-games/match3" element={<Match3 />} />
              <Route path="/mini-games/flappybird" element={<FlappyBird />} />
              <Route path="/mini-games/game2048" element={<Game2048 />} />
            </Routes>
          </main>
        </Router>
      </div>
    );
  }
}

export default App;