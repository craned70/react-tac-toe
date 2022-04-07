import React from 'react';
import { Board } from "./board.js";
import { calculateWinner } from "./squares.js"
import './index.css';

export class Game extends React.Component {
    constructor(props) { //boilerplate class component syntax
      super(props);

      this.state = { // set state to include history -- an array of objects, each object contains an array of the board state at a certain point in the game
        history: [{
          squares: Array(9).fill(null),
        }],
        xIsNext: true, // state to determine who's turn it is
        moveNumber: 0, // state to track how many moves have happened
      };
    }

    jumpTo(step) {
        this.setState({
            moveNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.moveNumber + 1); // store the previous move in the history variable, I.E. after move 1 it will store move 0 (an empty board)
      const current = history[this.state.moveNumber]; // current move is the moveNumber index of the history array
      console.log("history is ", history);
      console.log("current is ", current);
      const currentSquares = current.squares.slice(); // this makes a copy of the board, cuz mutatin' data be bad

      if (calculateWinner(currentSquares) || currentSquares[i]) { // check if there's a winner, or the square clicked is already filled, if either is true, return early
        return;
      }

      currentSquares[i] = this.state.xIsNext ? 'X' : 'O'; // fill the square that is clicked with X or O depending on who's turn it is

      this.setState({ 
        history: history.concat([{ // store this board in history
          squares: currentSquares, // note: in the tutorial the code here is squares: squares, which is really confusing IMO so I renamed the variable to currentSquares
        }]),
        xIsNext: !this.state.xIsNext, // flip to the next person's turn
        moveNumber: history.length,
      });
    }
  

    render() {
      const history = this.state.history;
      const current = history[this.state.moveNumber];
      const winner = calculateWinner(current.squares);
  
      // mapping the history (array of past boards) - "step" is the value of each element and "move" refers to the indice
      const moves = history.map((step, move) => {
        const desc = move ? 'Go to move #' + move : 'Go to game start';  // ternary - if we're at the 0 indice that means we have no board history thus the button being rendered should be to go to the start, if move is > 0 is then it will say to go to that move in the board's history.
        return (
          <li key={move}>
            <button className="history-button" onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      })
  
      let status;
      if (winner) { // check if there is a winner and then display who it is, if true. otherwise display who's turn is next
        status = 'Winner: ' + winner;
       } else if (history.length === 10) {
        status = 'Tie Game'
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares} //display current board state, we're passing squares as props to the "Board" child component
              onClick={(i) => this.handleClick(i)} // onClick call the handleClick function, we're passing this function as props to the "Board" child component
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ul>{moves}</ul>
          </div>
        </div>
      );
    }
  }