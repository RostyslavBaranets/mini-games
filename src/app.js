import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/navigation';
import Tetris from './pages/tetris';
import Minesweeper from './pages/minesweeper';
import Match3 from './pages/match3';

class App extends React.Component{
  render() {
    return (
      <div>
        <Router>
          <div>
            <Navigation />
            <Routes>
              <Route path="/minesweeper" element={<Minesweeper />} />
              <Route path="/tetris" element={<Tetris />} />
              <Route path="/match3" element={<Match3 />} />
            </Routes>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;