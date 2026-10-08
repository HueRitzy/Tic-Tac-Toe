import { EMPTY_BOARD, WINNING_LINES } from "./constants";
import type { Board, GameState, Player } from "./types";

export function createGame(): GameState {
  return {
    board: [...EMPTY_BOARD],
    currentPlayer: "X",
    winner: null,
    status: "playing",
    winningCells: [],
  };
}

export function otherPlayer(player: Player): Player {
  return player === "X" ? "O" : "X";
}

export function getEmptyCells(board: Board): number[] {
  const empty: number[] = [];
  board.forEach((cell, index) => {
    if (cell === null) empty.push(index);
  });
  return empty;
}

export function getWinningCells(board: Board): number[] {
  for (const [a, b, c] of WINNING_LINES) {
    const cell = board[a];
    if (cell !== null && cell === board[b] && cell === board[c]) {
      return [a, b, c];
    }
  }
  return [];
}

export function checkWinner(board: Board): Player | null {
  const cells = getWinningCells(board);
  return cells.length > 0 ? board[cells[0]] : null;
}

export function checkDraw(board: Board): boolean {
  return board.every((cell) => cell !== null) && checkWinner(board) === null;
}

export function isValidMove(state: GameState, position: number): boolean {
  return (
    state.status === "playing" &&
    Number.isInteger(position) &&
    position >= 0 &&
    position < state.board.length &&
    state.board[position] === null
  );
}

export function makeMove(state: GameState, position: number): GameState {
  if (!isValidMove(state, position)) return state;

  const board = [...state.board] as Board;
  board[position] = state.currentPlayer;

  const winningCells = getWinningCells(board);
  if (winningCells.length > 0) {
    return {
      board,
      currentPlayer: state.currentPlayer,
      winner: state.currentPlayer,
      status: "won",
      winningCells,
    };
  }

  if (checkDraw(board)) {
    return {
      board,
      currentPlayer: state.currentPlayer,
      winner: null,
      status: "draw",
      winningCells: [],
    };
  }

  return {
    board,
    currentPlayer: otherPlayer(state.currentPlayer),
    winner: null,
    status: "playing",
    winningCells: [],
  };
}
