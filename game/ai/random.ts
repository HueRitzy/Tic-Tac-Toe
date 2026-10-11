import { getEmptyCells } from "../engine";
import type { Board, ComputerPlayer } from "../types";

export function createRandomPlayer(random: () => number = Math.random): ComputerPlayer {
  return {
    getMove(board: Board): number {
      const empty = getEmptyCells(board);
      if (empty.length === 0) throw new Error("No moves available");
      return empty[Math.floor(random() * empty.length)];
    },
  };
}

export const randomPlayer = createRandomPlayer();
