import { CENTER, CORNERS, WINNING_LINES } from "../constants";
import { getEmptyCells, otherPlayer } from "../engine";
import type { Board, ComputerPlayer, Player } from "../types";

export function findWinningMove(board: Board, player: Player): number | null {
  for (const line of WINNING_LINES) {
    const owned = line.filter((i) => board[i] === player).length;
    const empty = line.filter((i) => board[i] === null);
    if (owned === 2 && empty.length === 1) return empty[0];
  }
  return null;
}

export const mediumPlayer: ComputerPlayer = {
  getMove(board: Board, player: Player): number {
    const empty = getEmptyCells(board);
    if (empty.length === 0) throw new Error("No moves available");

    const win = findWinningMove(board, player);
    if (win !== null) return win;

    const block = findWinningMove(board, otherPlayer(player));
    if (block !== null) return block;

    if (board[CENTER] === null) return CENTER;

    const corner = CORNERS.find((i) => board[i] === null);
    if (corner !== undefined) return corner;

    return empty[0];
  },
};
