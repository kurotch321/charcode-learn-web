import type { EncodeResult, EncodingEntry } from "../_lib/encoders/types";
import { ByteTable } from "./ByteTable";

type Props = {
  entry: EncodingEntry;
  result: EncodeResult;
};

export function EncodingCard({ entry, result }: Props) {
  return (
    <section className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3">
      <header className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold text-sm">{entry.label}</h2>
          {entry.description && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {entry.description}
            </p>
          )}
        </div>
        <span className="text-sm font-mono tabular-nums whitespace-nowrap">
          {result.totalBytes}{" "}
          <span className="text-neutral-500 dark:text-neutral-400">bytes</span>
        </span>
      </header>
      <ByteTable result={result} />
    </section>
  );
}
