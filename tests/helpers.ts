import type { Board, Cell } from "@/game/types";

/** Build a board from a 9-char string: "X", "O", or "." for empty. */
export function boardFrom(layout: string): Board {
  const cells = layout.replace(/\s/g, "").split("");
  if (cells.length !== 9) throw new Error(`Expected 9 cells, got ${cells.length}`);
  return cells.map((c): Cell => (c === "X" || c === "O" ? c : null)) as Board;
}
