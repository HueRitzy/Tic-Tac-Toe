import { describe, expect, it } from "vitest";
import { mediumPlayer } from "@/game/ai/medium";
import { minimaxPlayer } from "@/game/ai/minimax";
import { createRandomPlayer, randomPlayer } from "@/game/ai/random";
import { checkWinner, getEmptyCells, otherPlayer } from "@/game/engine";
import type { Board, ComputerPlayer, Player } from "@/game/types";
import { boardFrom } from "../helpers";

const players: [string, ComputerPlayer][] = [
  ["easy", randomPlayer],
  ["medium", mediumPlayer],
  ["hard", minimaxPlayer],
];

describe.each(players)("%s AI", (_name, ai) => {
  it("always returns an empty cell", () => {
    const boards = ["XOX OXO ...", "X.. ... ...", "XOX XOO O.X", "......... "];
    for (const layout of boards) {
      const board = boardFrom(layout);
      for (let i = 0; i < 20; i++) {
        const move = ai.getMove(board, "O");
        expect(board[move]).toBeNull();
      }
    }
  });
});

describe("easy AI", () => {
  it("picks among the empty cells using the random source", () => {
    const board = boardFrom("XOX OX. ..O");
    expect(createRandomPlayer(() => 0).getMove(board, "X")).toBe(5);
    expect(createRandomPlayer(() => 0.999).getMove(board, "X")).toBe(7);
  });
});

describe.each([
  ["medium", mediumPlayer],
  ["hard", minimaxPlayer],
] as const)("%s AI tactics", (_name, ai) => {
  it("takes a winning move", () => {
    expect(ai.getMove(boardFrom("OO. XX. X.."), "O")).toBe(2);
  });

  it("prefers winning over blocking", () => {
    expect(ai.getMove(boardFrom("XX. OO. X.."), "O")).toBe(5);
  });

  it("blocks the opponent", () => {
    expect(ai.getMove(boardFrom("XX. .O. ..."), "O")).toBe(2);
  });
});

describe("medium AI priority", () => {
  it("takes the center when nothing is urgent", () => {
    expect(mediumPlayer.getMove(boardFrom("X.. ... ..."), "O")).toBe(4);
  });

  it("takes a corner when the center is taken", () => {
    expect(mediumPlayer.getMove(boardFrom("... .X. ..."), "O")).toBe(0);
  });

  it("falls back to any empty cell when center and corners are taken", () => {
    expect(mediumPlayer.getMove(boardFrom("XOX .OX OXO"), "X")).toBe(3);
  });
});

/** Explore every possible opponent reply; the minimax player must never lose. */
function assertNeverLoses(board: Board, toMove: Player, ai: Player): number {
  const winner = checkWinner(board);
  if (winner !== null) {
    expect(winner).not.toBe(otherPlayer(ai));
    return 1;
  }
  const empty = getEmptyCells(board);
  if (empty.length === 0) return 1;

  if (toMove === ai) {
    const move = minimaxPlayer.getMove(board, ai);
    expect(board[move]).toBeNull();
    const next = [...board] as Board;
    next[move] = ai;
    return assertNeverLoses(next, otherPlayer(toMove), ai);
  }

  let games = 0;
  for (const move of empty) {
    const next = [...board] as Board;
    next[move] = toMove;
    games += assertNeverLoses(next, otherPlayer(toMove), ai);
  }
  return games;
}

describe("hard AI (minimax)", () => {
  const empty = boardFrom(".........");

  it("never loses playing second as O", () => {
    expect(assertNeverLoses(empty, "X", "O")).toBeGreaterThan(0);
  });

  it("never loses playing first as X", () => {
    expect(assertNeverLoses(empty, "X", "X")).toBeGreaterThan(0);
  });
});
