import type { Board, Score } from "./types";

export const BOARD_SIZE = 3;

export const WINNING_LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const CENTER = 4;
export const CORNERS: readonly number[] = [0, 2, 6, 8];

export const EMPTY_BOARD: Board = [null, null, null, null, null, null, null, null, null];

export const ZERO_SCORE: Score = { X: 0, O: 0, draws: 0 };

export const HUMAN_PLAYER = "X";
export const COMPUTER_PLAYER = "O";
