import { describe, expect, it } from "vitest";
import { checkDraw, checkWinner, createGame, getWinningCells, isValidMove, makeMove } from "@/game/engine";
import type { GameState } from "@/game/types";
import { boardFrom } from "../helpers";

function play(moves: number[], state: GameState = createGame()): GameState {
  return moves.reduce(makeMove, state);
}

describe("engine", () => {
  it("creates an empty initial state with X to move", () => {
    const game = createGame();
    expect(game.board).toEqual(Array(9).fill(null));
    expect(game.currentPlayer).toBe("X");
    expect(game.status).toBe("playing");
    expect(game.winner).toBeNull();
    expect(game.winningCells).toEqual([]);
  });

  it("switches turns after each valid move", () => {
    let game = makeMove(createGame(), 0);
    expect(game.board[0]).toBe("X");
    expect(game.currentPlayer).toBe("O");
    game = makeMove(game, 1);
    expect(game.board[1]).toBe("O");
    expect(game.currentPlayer).toBe("X");
  });

  it("detects an X horizontal win", () => {
    const game = play([0, 3, 1, 4, 2]);
    expect(game.status).toBe("won");
    expect(game.winner).toBe("X");
    expect(game.winningCells).toEqual([0, 1, 2]);
  });

  it("detects an X vertical win", () => {
    const game = play([1, 0, 4, 2, 7]);
    expect(game.winner).toBe("X");
    expect(game.winningCells).toEqual([1, 4, 7]);
  });

  it("detects an X diagonal win", () => {
    const game = play([0, 1, 4, 2, 8]);
    expect(game.winner).toBe("X");
    expect(game.winningCells).toEqual([0, 4, 8]);
  });

  it("detects an O win", () => {
    const game = play([0, 2, 1, 4, 8, 6]);
    expect(game.status).toBe("won");
    expect(game.winner).toBe("O");
    expect(game.winningCells).toEqual([2, 4, 6]);
  });

  it("detects a draw", () => {
    // X O X / X O O / O X X
    const game = play([0, 1, 2, 4, 3, 5, 7, 6, 8]);
    expect(game.status).toBe("draw");
    expect(game.winner).toBeNull();
    expect(checkDraw(game.board)).toBe(true);
  });

  it("rejects out-of-range and non-integer positions", () => {
    const game = createGame();
    for (const position of [-1, 9, 1.5, Number.NaN]) {
      expect(isValidMove(game, position)).toBe(false);
      expect(makeMove(game, position)).toBe(game);
    }
  });

  it("rejects moves on occupied cells", () => {
    const game = makeMove(createGame(), 4);
    expect(isValidMove(game, 4)).toBe(false);
    expect(makeMove(game, 4)).toBe(game);
  });

  it("ignores moves after the game is over", () => {
    const won = play([0, 3, 1, 4, 2]);
    expect(isValidMove(won, 5)).toBe(false);
    expect(makeMove(won, 5)).toBe(won);

    const drawn = play([0, 1, 2, 4, 3, 5, 7, 6, 8]);
    expect(makeMove(drawn, 0)).toBe(drawn);
  });

  it("returns winning cells for every line and none otherwise", () => {
    expect(getWinningCells(boardFrom("... OOO ...")).sort()).toEqual([3, 4, 5]);
    expect(getWinningCells(boardFrom("..X .X. X..")).sort()).toEqual([2, 4, 6]);
    expect(getWinningCells(boardFrom("X.. X.. X..")).sort()).toEqual([0, 3, 6]);
    expect(getWinningCells(boardFrom("XO. OX. ...")).length).toBe(0);
    expect(checkWinner(boardFrom("XO. OX. ..."))).toBeNull();
  });

  it("does not mutate the previous state", () => {
    const game = createGame();
    makeMove(game, 0);
    expect(game.board[0]).toBeNull();
  });
});
