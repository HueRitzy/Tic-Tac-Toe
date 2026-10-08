# Tic-Tac-Toe

Responsive, accessible Tic-Tac-Toe built with Next.js, React, TypeScript and Tailwind CSS.

- Player vs Player, or Player vs Computer (you are X) with Easy / Medium / Hard AI
- Hard AI uses minimax and never loses
- Win/draw detection with highlighted winning cells
- Scores persist in `localStorage` (`tic-tac-toe-score`)
- Keyboard play: Tab into the board, arrow keys / Home / End to move, Enter or Space to place

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server at http://localhost:3000 |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (strict) |
| `npm test` | Unit + component tests (Vitest, React Testing Library) |
| `npm run test:e2e` | End-to-end tests (Playwright; run `npx playwright install chromium` once) |

## Layout

- `game/` — framework-independent engine (`engine.ts`), reducer, and AI (`ai/random.ts`, `ai/medium.ts`, `ai/minimax.ts`)
- `components/` — UI components; `TicTacToe.tsx` wires state via `useReducer`
- `lib/storage.ts` — score persistence with corrupt/missing-data fallback
- `tests/unit`, `tests/e2e` — Vitest and Playwright suites
