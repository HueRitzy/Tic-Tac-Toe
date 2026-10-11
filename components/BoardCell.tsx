import { forwardRef, type KeyboardEvent } from "react";
import type { Cell } from "@/game/types";

interface BoardCellProps {
  index: number;
  value: Cell;
  isWinning: boolean;
  isDisabled: boolean;
  onSelect: (index: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void;
}

const BoardCell = forwardRef<HTMLButtonElement, BoardCellProps>(function BoardCell(
  { index, value, isWinning, isDisabled, onSelect, onKeyDown },
  ref,
) {
  const row = Math.floor(index / 3) + 1;
  const column = (index % 3) + 1;
  const label = `Row ${row}, Column ${column}, ${value ?? "empty"}`;

  const colour = value === "X" ? "text-sky-500" : "text-rose-500";
  const surface = isWinning
    ? "bg-amber-300 dark:bg-amber-400 ring-4 ring-amber-500"
    : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700";

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-disabled={isDisabled || undefined}
      data-winning={isWinning || undefined}
      data-testid={`cell-${index}`}
      onClick={() => {
        if (!isDisabled) onSelect(index);
      }}
      onKeyDown={(event) => onKeyDown(event, index)}
      className={`flex items-center justify-center rounded-xl text-5xl font-extrabold shadow-sm sm:text-6xl motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${surface} ${
        isDisabled ? "cursor-default" : "cursor-pointer"
      }`}
    >
      {value && (
        <span aria-hidden="true" className={isWinning ? "text-slate-900" : colour}>
          {value}
        </span>
      )}
    </button>
  );
});

export default BoardCell;
