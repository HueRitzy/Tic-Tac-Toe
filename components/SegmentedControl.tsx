interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  legend: string;
  name: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export default function SegmentedControl<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <fieldset className="flex flex-col items-center gap-1">
      <legend className="mb-1 w-full text-center text-sm font-medium text-slate-600 dark:text-slate-300">{legend}</legend>
      <div className="flex rounded-xl bg-slate-200 p-1 dark:bg-slate-800">
        {options.map((option) => (
          <label
            key={option.value}
            className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium has-[:checked]:bg-white has-[:checked]:shadow has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500 dark:has-[:checked]:bg-slate-600"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
