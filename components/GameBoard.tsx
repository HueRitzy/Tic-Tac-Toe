"use client";

import { useRef, type KeyboardEvent } from "react";
import type { Board } from "@/game/types";
import BoardCell from "./BoardCell";

interface GameBoardProps {
  board: Board;
  winningCells: number[];
  isInteractive: boolean;
  onCellSelect: (index: number) => void;
}

const KEY_OFFSETS: Record<string, [number, number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

export default function GameBoard({ board, winningCells, isInteractive, onCellSelect }: GameBoardProps) {
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const offset = KEY_OFFSETS[event.key];
    let target: number | null = null;
    if (offset) {
      const row = (Math.floor(index / 3) + offset[0] + 3) % 3;
      const col = ((index % 3) + offset[1] + 3) % 3;
      target = row * 3 + col;
    } else if (event.key === "Home") {
      target = 0;
    } else if (event.key === "End") {
      target = 8;
    }
    if (target !== null) {
      event.preventDefault();
      cellRefs.current[target]?.focus();
    }
  }

  return (
    <div
      role="group"
      aria-label="Tic-tac-toe board"
      className="grid aspect-square w-[min(90vw,420px)] grid-cols-3 grid-rows-3 gap-2 rounded-2xl bg-slate-300 p-2 dark:bg-slate-700"
    >
      {board.map((value, index) => (
        <BoardCell
          key={index}
          ref={(el) => {
            cellRefs.current[index] = el;
          }}
          index={index}
          value={value}
          isWinning={winningCells.includes(index)}
          isDisabled={!isInteractive || value !== null}
          onSelect={onCellSelect}
          onKeyDown={handleKeyDown}
        />
      ))}
    </div>
  );
}
