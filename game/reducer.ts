import { ZERO_SCORE } from "./constants";
import { createGame, makeMove } from "./engine";
import type { GameState, Score } from "./types";

export type GameAction =
  | { type: "MAKE_MOVE"; position: number }
  | { type: "NEW_GAME" }
  | { type: "RESET_SCORE" }
  | { type: "LOAD_SCORE"; score: Score };

export interface AppState {
  game: GameState;
  score: Score;
}

export function createInitialState(score: Score = ZERO_SCORE): AppState {
  return { game: createGame(), score: { ...score } };
}

export function gameReducer(state: AppState, action: GameAction): AppState {
  switch (action.type) {
    case "MAKE_MOVE": {
      const game = makeMove(state.game, action.position);
      if (game === state.game) return state;

      let score = state.score;
      if (game.status === "won" && game.winner) {
        score = { ...score, [game.winner]: score[game.winner] + 1 };
      } else if (game.status === "draw") {
        score = { ...score, draws: score.draws + 1 };
      }
      return { game, score };
    }
    case "NEW_GAME":
      return { ...state, game: createGame() };
    case "RESET_SCORE":
      return { ...state, score: { ...ZERO_SCORE } };
    case "LOAD_SCORE":
      return { ...state, score: { ...action.score } };
    default:
      return state;
  }
}
