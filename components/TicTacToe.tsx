"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { computerPlayers } from "@/game/ai";
import { COMPUTER_PLAYER } from "@/game/constants";
import { createInitialState, gameReducer } from "@/game/reducer";
import type { Difficulty, GameMode } from "@/game/types";
import { loadScore, saveScore } from "@/lib/storage";
import DifficultySelector from "./DifficultySelector";
import GameBoard from "./GameBoard";
import GameModeSelector from "./GameModeSelector";
import GameStatus from "./GameStatus";
import ResultDialog from "./ResultDialog";
import ScoreBoard from "./ScoreBoard";

const buttonClass =
  "rounded-lg px-4 py-2 font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400";

export default function TicTacToe() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialState());
  const [mode, setMode] = useState<GameMode>("pvp");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const scoreLoaded = useRef(false);
  const { game, score } = state;

  const isComputerTurn = mode === "pvc" && game.status === "playing" && game.currentPlayer === COMPUTER_PLAYER;

  // Declared before the load effect so the initial zeroed score never overwrites storage.
  useEffect(() => {
    if (scoreLoaded.current) saveScore(score);
  }, [score]);

  useEffect(() => {
    dispatch({ type: "LOAD_SCORE", score: loadScore() });
    scoreLoaded.current = true;
  }, []);

  useEffect(() => {
    if (!isComputerTurn) return;
    const position = computerPlayers[difficulty].getMove(game.board, COMPUTER_PLAYER);
    dispatch({ type: "MAKE_MOVE", position });
  }, [isComputerTurn, difficulty, game.board]);

  function changeMode(next: GameMode) {
    setMode(next);
    dispatch({ type: "NEW_GAME" });
  }

  function changeDifficulty(next: Difficulty) {
    setDifficulty(next);
    dispatch({ type: "NEW_GAME" });
  }

  const newGame = () => dispatch({ type: "NEW_GAME" });

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center gap-5 px-4 py-8">
      <h1 className="text-4xl font-extrabold tracking-tight">Tic-Tac-Toe</h1>

      <div className="flex flex-wrap items-start justify-center gap-4">
        <GameModeSelector mode={mode} onChange={changeMode} />
        {mode === "pvc" && <DifficultySelector difficulty={difficulty} onChange={changeDifficulty} />}
      </div>

      <GameStatus game={game} />

      <GameBoard
        board={game.board}
        winningCells={game.winningCells}
        isInteractive={game.status === "playing" && !isComputerTurn}
        onCellSelect={(position) => dispatch({ type: "MAKE_MOVE", position })}
      />

      <ResultDialog game={game} mode={mode} onPlayAgain={newGame} />

      <ScoreBoard
        score={score}
        xLabel={mode === "pvc" ? "You (X)" : "Player X"}
        oLabel={mode === "pvc" ? "Computer (O)" : "Player O"}
      />

      <div className="flex gap-3">
        <button type="button" onClick={newGame} className={`${buttonClass} bg-indigo-600 text-white hover:bg-indigo-700`}>
          New Game
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "RESET_SCORE" })}
          className={`${buttonClass} bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600`}
        >
          Reset Score
        </button>
      </div>
    </main>
  );
}
