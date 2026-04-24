"use client";

import { useMemo, useState } from "react";
import { encoders } from "../_lib/encoders";
import { EncodingCard } from "./EncodingCard";
import { InputPane } from "./InputPane";

const DEFAULT_INPUT = "Hello 世界 🎉";

export function EncoderApp() {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const results = useMemo(
    () => encoders.map((e) => ({ entry: e, result: e.encoder(input) })),
    [input],
  );

  return (
    <main className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-4 p-4 md:h-dvh">
      <div className="md:h-full md:min-h-0 md:sticky md:top-0 flex flex-col gap-3">
        <header>
          <h1 className="text-lg font-semibold">文字コード学習ツール</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            入力した文字列の Unicode コードポイントと、主要な 10 種の文字コードによるバイト列を表示します。
          </p>
        </header>
        <InputPane value={input} onChange={setInput} />
      </div>
      <div className="md:h-full md:min-h-0 md:overflow-y-auto flex flex-col gap-3">
        {results.map(({ entry, result }) => (
          <EncodingCard key={entry.id} entry={entry} result={result} />
        ))}
      </div>
    </main>
  );
}
