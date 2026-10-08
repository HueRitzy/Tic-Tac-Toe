import { checkWinner, getEmptyCells, otherPlayer } from "../engine";
import type { Board, ComputerPlayer, Player } from "../types";

const cache = new Map<string, number>();

/** Score from `player`'s perspective (player is to move). Faster wins / slower losses score higher. */
function negamax(board: Board, player: Player): number {
  const key = board.map((c) => c ?? "-").join("") + player;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  const empty = getEmptyCells(board);
  let best = -Infinity;

  for (const index of empty) {
    board[index] = player;
    const score =
      checkWinner(board) === player
        ? 10 + empty.length
        : empty.length === 1
          ? 0
          : -negamax(board, otherPlayer(player));
    board[index] = null;
    if (score > best) best = score;
  }

  const result = empty.length === 0 ? 0 : best;
  cache.set(key, result);
  return result;
}

export const minimaxPlayer: ComputerPlayer = {
  getMove(board: Board, player: Player): number {
    const empty = getEmptyCells(board);
    if (empty.length === 0) throw new Error("No moves available");
    if (checkWinner(board) !== null) throw new Error("Game is already over");

    const work = [...board] as Board;
    let bestMove = empty[0];
    let bestScore = -Infinity;

    for (const index of empty) {
      work[index] = player;
      const score =
        checkWinner(work) === player
          ? 10 + empty.length
          : empty.length === 1
            ? 0
            : -negamax(work, otherPlayer(player));
      work[index] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = index;
      }
    }

    return bestMove;
  },
};
