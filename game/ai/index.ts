import type { ComputerPlayer, Difficulty } from "../types";
import { mediumPlayer } from "./medium";
import { minimaxPlayer } from "./minimax";
import { randomPlayer } from "./random";

export const computerPlayers: Record<Difficulty, ComputerPlayer> = {
  easy: randomPlayer,
  medium: mediumPlayer,
  hard: minimaxPlayer,
};
