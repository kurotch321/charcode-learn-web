import { countCodePoints } from "../_lib/format";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function InputPane({ value, onChange }: Props) {
  const codePoints = countCodePoints(value);
  const utf16Units = value.length;

  return (
    <div className="flex flex-col gap-2 min-h-0">
      <label
        htmlFor="source-input"
        className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        入力文字列
      </label>
      <textarea
        id="source-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="flex-1 min-h-[10rem] md:min-h-0 resize-none rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3 font-mono text-sm focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
        placeholder="ここに文字列を入力..."
      />
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
        <div className="flex justify-between">
          <dt>コードポイント数</dt>
          <dd className="tabular-nums">{codePoints}</dd>
        </div>
        <div className="flex justify-between">
          <dt>UTF-16 code units</dt>
          <dd className="tabular-nums">{utf16Units}</dd>
        </div>
      </dl>
    </div>
  );
}
