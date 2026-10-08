"use client";

import { useEffect, useRef } from "react";
import type { GameMode, GameState } from "@/game/types";

interface ResultDialogProps {
  game: GameState;
  mode: GameMode;
  onPlayAgain: () => void;
}

function getResultMessage(game: GameState, mode: GameMode): string {
  if (game.status === "draw") return "Nobody wins this round.";
  if (mode === "pvc") return game.winner === "X" ? "You beat the computer!" : "The computer wins this round.";
  return `Player ${game.winner} takes the round.`;
}

export default function ResultDialog({ game, mode, onPlayAgain }: ResultDialogProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isOver = game.status !== "playing";

  useEffect(() => {
    if (isOver) buttonRef.current?.focus();
  }, [isOver]);

  if (!isOver) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="result-title"
      aria-describedby="result-message"
      className="flex w-full flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-md motion-safe:animate-[fade-in_150ms_ease-out] dark:border-slate-700 dark:bg-slate-800"
    >
      <h2 id="result-title" className="text-lg font-bold">
        Game over
      </h2>
      <p id="result-message" data-testid="result-message">
        {getResultMessage(game, mode)}
      </p>
      <button
        ref={buttonRef}
        type="button"
        onClick={onPlayAgain}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400"
      >
        Play again
      </button>
    </div>
  );
}
