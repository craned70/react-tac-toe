import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Game extends React.Component {
  //boilerplate class component syntax
  constructor(props) {
    super(props);
    // set state to include history -- an array of objects, each object contains an array of the board state at a certain point in the game
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      // set state to determine who's turn it is
      xIsNext: true,
    };
  }

  // handleClick function - this is called when a square is clicked
  handleClick(i) {
    // bind history to a var
    const history = this.state.history;
    // define the current board state
    const current = history[history.length - 1];
    // makes a copy of the board
    const currentSquares = current.squares.slice();
    // check if there's a winner, or the square clicked is already filled, if either is true, return early
    if (calculateWinner(currentSquares) || currentSquares[i]) {
      return;
    }
    // fill the square that is clicked with X or O depending on who's turn it is
    currentSquares[i] = this.state.xIsNext ? 'X' : 'O';
    // store this board in history (in the tutorial they write in setState - squares: squares, which is really confusing IMO so I renamed the variable to currentSquares)
    this.setState({
      history: history.concat([{
        squares: currentSquares,
      }]),
      // flip to the next person's turn
      xIsNext: !this.state.xIsNext,
    });
  }

  // render describes the view to be rendered in the browser window
  render() {
    // bind history to a var
    const history = this.state.history;
    // define the current board state
    const current = history[history.length - 1];
    // check for a winner
    const winner = calculateWinner(current.squares);

    // mapping the history array of past boards - step is the element value and move refers to the indice
    const moves = history.map((step, move) => {
      // ternary to check if move (the indice) is truthy, if not that means we have no board history (0), so desc will say to go to the board start, if it is then it will say to go to that move in the board's history.
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })

    // declare a status var
    let status;
    // check if there is a winner and then display who it is, if true. otherwise display who's turn is next
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            //display current board state, we're passing squares as props to the board child component
            squares={current.squares}
            // onClick call the handleClick function, we're passing this function as props to the board child component
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      // as stated earlier, squares & the onClick function were passed down from the Game component to the Board component - here they are used to pass value and onClick down to the square component
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// Square component
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  // list of all winning lines - an X or O existing in all 3 of any of these indices indicates a win
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3 ,6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // loop through each winning line, checking if there is an X or an O in every location, return which one is the winner, if no winner return null
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}



// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
