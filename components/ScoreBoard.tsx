import type { Score } from "@/game/types";

interface ScoreBoardProps {
  score: Score;
  xLabel: string;
  oLabel: string;
}

export default function ScoreBoard({ score, xLabel, oLabel }: ScoreBoardProps) {
  const items = [
    { key: "X", label: xLabel, value: score.X, colour: "text-sky-500" },
    { key: "draws", label: "Draws", value: score.draws, colour: "text-slate-500 dark:text-slate-300" },
    { key: "O", label: oLabel, value: score.O, colour: "text-rose-500" },
  ];

  return (
    <section aria-label="Scoreboard" className="w-full">
      <dl className="grid grid-cols-3 gap-2 text-center">
        {items.map((item) => (
          <div key={item.key} className="rounded-xl bg-white px-2 py-3 shadow-sm dark:bg-slate-800">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-300">
              {item.label}
            </dt>
            <dd data-testid={`score-${item.key}`} className={`text-3xl font-bold ${item.colour}`}>
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
