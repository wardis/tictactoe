import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => (
  <button
    className={'square' + (props.isWinning ? ' winning' : '')}
    onClick={props.onClick}
  >
    {props.value}
  </button>
);

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        isWinning={this.props.winningSquares.includes(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    );
  }

  renderRow(i) {
    const cols = [];
    for (let col = i; col < i + 3; col++) {
      cols.push(this.renderSquare(col));
    }

    return (
      <div className='board-row' key={i}>
        {cols}
      </div>
    );
  }

  render() {
    const rows = [];
    for (let row = 0; row < 3; row++) {
      rows.push(this.renderRow(row * 3));
    }

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          location: null,
        },
      ],
      stepNumber: 0,
      reverseHist: false,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: calculateLocation(i),
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  toggleSort() {
    this.setState({
      reverseHist: !this.state.reverseHist,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? `Move #${move} | →${history[move].location[0]} ↓${history[move].location[1]}`
        : 'Game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    if (this.state.reverseHist) {
      moves.reverse();
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner.player;
    } else if (!winner && this.state.stepNumber > 8) {
      status = 'Draw, nobody wins';
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            winningSquares={winner ? winner.line : []}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <button onClick={() => this.toggleSort()}>history ↑↓</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function calculateLocation(i) {
  // line, col
  const locations = [
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 1],
    [2, 2],
    [2, 3],
    [3, 1],
    [3, 2],
    [3, 3],
  ];

  return locations[i];
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
