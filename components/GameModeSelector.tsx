import type { GameMode } from "@/game/types";
import SegmentedControl from "./SegmentedControl";

const OPTIONS = [
  { value: "pvp", label: "Player vs Player" },
  { value: "pvc", label: "Player vs Computer" },
] as const;

interface GameModeSelectorProps {
  mode: GameMode;
  onChange: (mode: GameMode) => void;
}

export default function GameModeSelector({ mode, onChange }: GameModeSelectorProps) {
  return <SegmentedControl legend="Mode" name="mode" options={OPTIONS} value={mode} onChange={onChange} />;
}
