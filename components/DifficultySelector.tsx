import type { Difficulty } from "@/game/types";
import SegmentedControl from "./SegmentedControl";

const OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
] as const;

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

export default function DifficultySelector({ difficulty, onChange }: DifficultySelectorProps) {
  return (
    <SegmentedControl
      legend="Difficulty"
      name="difficulty"
      options={OPTIONS}
      value={difficulty}
      onChange={onChange}
    />
  );
}
