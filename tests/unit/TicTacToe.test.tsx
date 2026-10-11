import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import TicTacToe from "@/components/TicTacToe";
import { SCORE_STORAGE_KEY } from "@/lib/storage";

function cell(index: number) {
  return screen.getByTestId(`cell-${index}`);
}

async function playMoves(user: ReturnType<typeof userEvent.setup>, moves: number[]) {
  for (const move of moves) await user.click(cell(move));
}

function status() {
  return screen.getByTestId("game-status");
}

describe("TicTacToe UI", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders 9 accessible cells", () => {
    render(<TicTacToe />);
    const board = screen.getByRole("group", { name: "Tic-tac-toe board" });
    expect(within(board).getAllByRole("button")).toHaveLength(9);
    expect(screen.getByRole("button", { name: "Row 1, Column 1, empty" })).toBeInTheDocument();
    expect(status()).toHaveTextContent("Player X's turn");
  });

  it("clicking an empty cell makes a move", async () => {
    render(<TicTacToe />);
    await user.click(cell(1));
    expect(screen.getByRole("button", { name: "Row 1, Column 2, X" })).toBeInTheDocument();
    expect(status()).toHaveTextContent("Player O's turn");
  });

  it("an occupied cell cannot be changed", async () => {
    render(<TicTacToe />);
    await playMoves(user, [4, 4]);
    expect(cell(4)).toHaveAccessibleName("Row 2, Column 2, X");
    expect(status()).toHaveTextContent("Player O's turn");
  });

  it("displays the winner, highlights winning cells and increments the score", async () => {
    render(<TicTacToe />);
    await playMoves(user, [0, 3, 1, 4, 2]);
    expect(status()).toHaveTextContent("Player X wins!");
    for (const i of [0, 1, 2]) expect(cell(i)).toHaveAttribute("data-winning", "true");
    for (const i of [3, 4, 5, 6, 7, 8]) expect(cell(i)).not.toHaveAttribute("data-winning");
    expect(screen.getByTestId("score-X")).toHaveTextContent("1");
    expect(screen.getByRole("dialog", { name: "Game over" })).toBeInTheDocument();

    await user.click(cell(8));
    expect(cell(8)).toHaveAccessibleName("Row 3, Column 3, empty");
  });

  it("displays a draw and counts it", async () => {
    render(<TicTacToe />);
    await playMoves(user, [0, 1, 2, 4, 3, 5, 7, 6, 8]);
    expect(status()).toHaveTextContent("Draw!");
    expect(screen.getByTestId("score-draws")).toHaveTextContent("1");
  });

  it("New Game resets the board but keeps the score", async () => {
    render(<TicTacToe />);
    await playMoves(user, [0, 3, 1, 4, 2]);
    await user.click(screen.getByRole("button", { name: "New Game" }));
    for (let i = 0; i < 9; i++) expect(cell(i)).toHaveAccessibleName(/empty$/);
    expect(status()).toHaveTextContent("Player X's turn");
    expect(screen.getByTestId("score-X")).toHaveTextContent("1");
  });

  it("Reset Score zeroes the scoreboard and storage", async () => {
    render(<TicTacToe />);
    await playMoves(user, [0, 3, 1, 4, 2]);
    await user.click(screen.getByRole("button", { name: "Reset Score" }));
    expect(screen.getByTestId("score-X")).toHaveTextContent("0");
    expect(JSON.parse(window.localStorage.getItem(SCORE_STORAGE_KEY) ?? "{}")).toEqual({ X: 0, O: 0, draws: 0 });
  });

  it("persists scores and restores them on reload", async () => {
    const { unmount } = render(<TicTacToe />);
    await playMoves(user, [0, 3, 1, 4, 2]);
    expect(JSON.parse(window.localStorage.getItem(SCORE_STORAGE_KEY) ?? "{}")).toEqual({ X: 1, O: 0, draws: 0 });
    unmount();
    render(<TicTacToe />);
    expect(screen.getByTestId("score-X")).toHaveTextContent("1");
  });

  it("falls back to zero scores when storage is corrupt", () => {
    window.localStorage.setItem(SCORE_STORAGE_KEY, "{not json");
    render(<TicTacToe />);
    expect(screen.getByTestId("score-X")).toHaveTextContent("0");
    expect(screen.getByTestId("score-O")).toHaveTextContent("0");
    expect(screen.getByTestId("score-draws")).toHaveTextContent("0");
  });

  it("PvC triggers a computer move after the human moves", async () => {
    render(<TicTacToe />);
    await user.click(screen.getByRole("radio", { name: "Player vs Computer" }));
    expect(screen.getByRole("radio", { name: "Hard" })).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Hard" }));
    await user.click(cell(0));
    expect(cell(0)).toHaveAccessibleName("Row 1, Column 1, X");
    expect(cell(4)).toHaveAccessibleName("Row 2, Column 2, O");
    expect(status()).toHaveTextContent("Player X's turn");
  });

  it("supports arrow-key navigation and keyboard moves", async () => {
    render(<TicTacToe />);
    cell(0).focus();
    await user.keyboard("{ArrowRight}{ArrowDown}");
    expect(cell(4)).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(cell(4)).toHaveAccessibleName("Row 2, Column 2, X");
    await user.keyboard("{ArrowUp}{ArrowUp}");
    expect(cell(7)).toHaveFocus();
  });
});
