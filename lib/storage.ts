import { ZERO_SCORE } from "@/game/constants";
import type { Score } from "@/game/types";

export const SCORE_STORAGE_KEY = "tic-tac-toe-score";

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

export function parseScore(raw: string | null): Score {
  if (!raw) return { ...ZERO_SCORE };
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data === "object" && data !== null) {
      const { X, O, draws } = data as Record<string, unknown>;
      if (isCount(X) && isCount(O) && isCount(draws)) return { X, O, draws };
    }
  } catch {
    // fall through to zeroed score
  }
  return { ...ZERO_SCORE };
}

export function loadScore(): Score {
  try {
    return parseScore(window.localStorage.getItem(SCORE_STORAGE_KEY));
  } catch {
    return { ...ZERO_SCORE };
  }
}

export function saveScore(score: Score): void {
  try {
    window.localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(score));
  } catch {
    // storage unavailable (private mode, quota); scores stay in memory only
  }
}
