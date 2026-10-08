import type { GameState } from "@/game/types";

export function getStatusMessage(game: GameState): string {
  if (game.status === "won" && game.winner) return `Player ${game.winner} wins!`;
  if (game.status === "draw") return "Draw!";
  return `Player ${game.currentPlayer}'s turn`;
}

export default function GameStatus({ game }: { game: GameState }) {
  return (
    <p
      role="status"
      aria-live="polite"
      data-testid="game-status"
      className="text-center text-2xl font-semibold"
    >
      {getStatusMessage(game)}
    </p>
  );
}
