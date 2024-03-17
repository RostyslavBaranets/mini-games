import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/navigation';
import Tetris from './pages/tetris';
import Minesweeper from './pages/minesweeper';

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
            </Routes>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;