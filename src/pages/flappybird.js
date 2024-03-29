import React from 'react';
import '../css/flappybird.scss';

class FlappyBird extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      birdPosition: 250,
      gravity: 0.5,
      velocity: 0,
      gameStarted: false,
      score: 0,
      gameOver: false,
      pipes: [],
    };
    this.gameInterval = null;
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
    clearInterval(this.gameInterval);
  }

  handleClick = () => {
    if (!this.state.gameOver) {
      this.setState({
        velocity: -8
      });
    }
  };

  startGame = () => {
    if (!this.state.gameStarted) {
      this.setState({
        gameStarted: true
      });
      this.generatePipe();
      this.gameInterval = setInterval(this.updateGame, 15);
    }
  };

  generatePipe = () => {
    const pipeHeight = Math.floor(Math.random() * 250) + 100;
    const newPipes = this.state.pipes.slice();
    newPipes.push({
      topHeight: pipeHeight,
      bottomHeight: 600 - pipeHeight - 200,
      position: 500
    });
    this.setState({
      pipes: newPipes
    });
  };

  updateGame = () => {
    if (this.state.gameOver) {
      clearInterval(this.gameInterval);
      return;
    }

    const newVelocity = this.state.velocity + this.state.gravity;
    const newPosition = this.state.birdPosition + newVelocity;
    let newScore = this.state.score;

    if (newPosition >= 600) {
      this.gameOver();
      return;
    }

    const newPipes = this.state.pipes.map(pipe => {
      const newPosition = pipe.position - 2.5;
      if (pipe.position === 25) {
        newScore++;
      }
      return {
        ...pipe,
        position: newPosition
      };
    });

    newPipes.forEach(pipe => {
      if (
        pipe.position < 150 && pipe.position + 75 > 100 &&
        (newPosition < pipe.topHeight || newPosition > 550 - pipe.bottomHeight)
        ) {
        this.gameOver();
        return;
      }
    });

    const filteredPipes = newPipes.filter(pipe => pipe.position > -100);

    this.setState({
      birdPosition: newPosition,
      velocity: newVelocity,
      pipes: filteredPipes,
      score: newScore
    });

    if (newPipes.length > 0 && newPipes[newPipes.length - 1].position < 250) {
      this.generatePipe();
    }
  };

  gameOver = () => {
    this.setState({
      gameOver: true
    });
  };

  restartGame = () => {
    this.setState({
      birdPosition: 250,
      velocity: 0,
      gameStarted: false,
      score: 0,
      gameOver: false,
      pipes: [],
    });

    this.startGame();
  };

  render() {
    return (
      <div className='flappybird'>
        <h1>Flappy Bird</h1>
        <div onClick={this.startGame} className='flappybird-game'>
          <div className='bird' style={{ top: `${this.state.birdPosition}px` }} />
          {this.state.pipes.map((pipe, index) => (
            <React.Fragment key={index}>
              <div className='pipe' style={{ height: `${pipe.topHeight}px`, left: `${pipe.position}px` }} />
              <div className='pipe' style={{ height: `${pipe.bottomHeight}px`, left: `${pipe.position}px`, top: `${pipe.topHeight + 200}px` }} />
            </React.Fragment>
          ))}
          {!this.state.gameOver && <div className='fb-score'>Score: {this.state.score}</div>}
          {this.state.gameOver && 
          <div className='fb-gameover'>
            <h2>Game Over</h2>
            <h3>Score: {this.state.score}</h3>
            <button onClick={this.restartGame}>Restart</button>
          </div>}
        </div>
      </div>
    );
  }
}

export default FlappyBird;