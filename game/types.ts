export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];
export type GameStatus = "playing" | "won" | "draw";

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  status: GameStatus;
  winningCells: number[];
}

export interface Score {
  X: number;
  O: number;
  draws: number;
}

export type GameMode = "pvp" | "pvc";
export type Difficulty = "easy" | "medium" | "hard";

export interface ComputerPlayer {
  getMove(board: Board, player: Player): number;
}
