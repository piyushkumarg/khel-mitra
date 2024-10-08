import { useCallback, useEffect, useState } from 'react';
import { levelType, turnType } from '../types/level.type';

const initialBoard = () => Array(9).fill(null);

const WINNING_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Custom hook for Tic Tac Toe game.
 * @returns Object containing game state and functions to manipulate it.
 */
const useTicTacToe = () => {
  // Initialize game state
  const [board, setboard] = useState(initialBoard()); // The current state of the game board
  const [turn, setTurn] = useState<turnType>('X'); // The current player's turn
  const [winner, setWinner] = useState<string | null>(null); // The winner of the game
  const [scores, setScores] = useState<{ [key: string]: number }>({
    // The scores of each player
    X: 0,
    O: 0,
  });

  // Checks if the current player has won the game
  const checkWinner = useCallback(
    (board: Array<string | null>): string | null => {
      for (let i = 0; i < WINNING_PATTERNS.length; i++) {
        const [a, b, c] = WINNING_PATTERNS[i];

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }

      if (board.every((cell) => cell !== null)) {
        return 'tie';
      }

      return null;
    },
    [board]
  );

  // Checks if the current player has a winning move [used in medium level]
  const chekWinProbability = useCallback(
    (board: Array<string | null>, turn: string) => {
      return WINNING_PATTERNS.some((pattern) =>
        pattern.every((index) => board[index] === turn)
      );
    },
    []
  );

  // Handles a player's move
  const handleClick = useCallback(
    (index: number, turn: turnType) => {
      // Check for winner or occupied square
      if (winner || board[index]) return;

      const newBoard = [...board];
      newBoard[index] = turn;
      setboard(newBoard);
      setTurn(turn === 'X' ? 'O' : 'X');
    },
    [board, winner]
  );

  // Minimax algorithm for determining the computer's move [used in hard level]
  const minimax = useCallback(
    (
      board: Array<string | null>,
      depth: number,
      isMaximizing: boolean,
      player: string,
      opponent: string
    ): number => {
      let scores = { [player]: 10, [opponent]: -10, tie: 0 };

      const winner = checkWinner(board);

      if (winner !== null) {
        return scores[winner];
      }

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
          if (board[i] === null) {
            board[i] = player;
            let score = minimax(board, depth + 1, false, player, opponent);
            board[i] = null;
            bestScore = Math.max(score, bestScore);
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
          if (board[i] === null) {
            board[i] = opponent;
            let score = minimax(board, depth + 1, true, player, opponent);
            board[i] = null;
            bestScore = Math.min(score, bestScore);
          }
        }
        return bestScore;
      }
    },
    [checkWinner]
  );

  // Functions for determining the computer's move based on different levels of difficulty
  const getEasyMove = useCallback((board: Array<string | null>) => {
    const emptySquares = board.reduce((acc, square, index) => {
      if (square === null) {
        acc.push(index);
      }
      return acc;
    }, [] as number[]);

    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    return emptySquares[randomIndex];
  }, []);

  const getMediumMove = useCallback((board: Array<string | null>) => {
    // Check for a winning move
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        if (chekWinProbability(board, 'O')) {
          // console.log(`move: ${"O"} ${i} winning for me`);
          board[i] = null;
          return i;
        }
        board[i] = null;
      }
    }

    // Check for a blocking move
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        if (chekWinProbability(board, 'X')) {
          // console.log(`move: ${"X"} ${i} block win`);
          board[i] = null;
          return i;
        }
        board[i] = null;
      }
    }

    // Pick a random available index
    return getEasyMove(board);
  }, []);

  const getHardMove = useCallback(
    (board: Array<string | null>) => {
      const player = 'O'; // Assume computer is 'O'
      const opponent = 'X';
      let bestScore = -Infinity;

      let move = -1;

      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = player;
          let score = minimax(board, 0, false, player, opponent);
          board[i] = null;
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        }
      }

      if (move === -1) {
        move = getEasyMove(board);
      }

      return move;
    },
    [getEasyMove]
  );

  // Function for determining the computer's move based on the current level of difficulty
  const getComputerMove = useCallback(
    (board: Array<string | null>, level: levelType): number => {
      if (winner) return -1;
      switch (level) {
        case 'easy':
          return getEasyMove(board);
        case 'medium':
          return getMediumMove(board);
        case 'hard':
          return getHardMove(board);
        default:
          return -1; // should never happen
      }
    },
    [getEasyMove, getMediumMove, getHardMove]
  );

  // Function for updating the score of each player based on the winner of the game
  const handleScore = useCallback((winner: string | null) => {
    if (winner) {
      setScores((prevScores) => ({
        ...prevScores,
        [winner]: prevScores[winner] + 5,
      }));
    }
  }, []);

  useEffect(() => {
    handleScore(winner);
  }, [winner]);

  // Update the winner based on the current state of the game board
  useEffect(() => {
    const winner = checkWinner(board);
    if (winner && winner !== 'tie') {
      setWinner(winner);
    }
  }, [checkWinner]);

  // Function for retrieving the current status of the game
  const getStatusMessage = useCallback((): {
    winner: string | null;
    draw: boolean;
    turn: turnType;
    score: { [key: string]: number };
  } => {
    if (winner) {
      return {
        winner,
        draw: false,
        turn,
        score: scores,
      };
    }

    if (!board.includes(null))
      return {
        winner: null,
        draw: true,
        turn,
        score: scores,
      };

    return {
      winner: null,
      draw: false,
      turn,
      score: scores,
    };
  }, [winner, board, scores, turn]);

  const resetGame = () => {
    setboard(initialBoard());
    setWinner(null);
    setTurn('X');
  };

  return {
    board,
    turn,
    setboard,
    handleClick,
    getStatusMessage,
    resetGame,
    getComputerMove,
    winner,
    setScores,
  };
};

export default useTicTacToe;
