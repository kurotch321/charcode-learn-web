import type { EncodeResult } from "../_lib/encoders/types";
import { toCodePointLabel, toDisplayChar, toHex } from "../_lib/format";

type Props = {
  result: EncodeResult;
};

export function ByteTable({ result }: Props) {
  const { chars, prefixBytes, suffixBytes } = result;

  if (chars.length === 0) {
    return (
      <p className="text-xs text-neutral-500 dark:text-neutral-400 italic mt-2">
        (入力なし)
      </p>
    );
  }

  return (
    <table className="w-full font-mono text-xs mt-2 border-collapse">
      <thead>
        <tr className="text-left text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
          <th className="py-1 pr-3 font-normal w-10">Char</th>
          <th className="py-1 pr-3 font-normal w-20">Code&nbsp;Point</th>
          <th className="py-1 pr-3 font-normal">Bytes&nbsp;(hex)</th>
          <th className="py-1 font-normal">Note</th>
        </tr>
      </thead>
      <tbody>
        {prefixBytes && prefixBytes.length > 0 && (
          <tr className="bg-amber-50 dark:bg-amber-950/30 border-b border-neutral-100 dark:border-neutral-900">
            <td className="py-1 pr-3 text-neutral-500">—</td>
            <td className="py-1 pr-3 text-neutral-500">prefix</td>
            <td className="py-1 pr-3 tabular-nums">{toHex(prefixBytes)}</td>
            <td className="py-1 text-neutral-600 dark:text-neutral-400">
              エスケープシーケンス (モード切替)
            </td>
          </tr>
        )}
        {chars.map((c, i) => {
          const nonRepresentable = c.bytes === null;
          return (
            <tr
              key={i}
              className={
                "border-b border-neutral-100 dark:border-neutral-900 " +
                (nonRepresentable ? "bg-red-50 dark:bg-red-950/30" : "")
              }
            >
              <td className="py-1 pr-3 whitespace-nowrap">
                {toDisplayChar(c.codePoint, c.char)}
              </td>
              <td className="py-1 pr-3 text-neutral-600 dark:text-neutral-400 tabular-nums">
                {toCodePointLabel(c.codePoint)}
              </td>
              <td className="py-1 pr-3 tabular-nums break-all">
                {c.bytes ? toHex(c.bytes) : "—"}
              </td>
              <td className="py-1 text-neutral-600 dark:text-neutral-400">
                {c.note ?? ""}
              </td>
            </tr>
          );
        })}
        {suffixBytes && suffixBytes.length > 0 && (
          <tr className="bg-amber-50 dark:bg-amber-950/30">
            <td className="py-1 pr-3 text-neutral-500">—</td>
            <td className="py-1 pr-3 text-neutral-500">suffix</td>
            <td className="py-1 pr-3 tabular-nums">{toHex(suffixBytes)}</td>
            <td className="py-1 text-neutral-600 dark:text-neutral-400">
              ASCII 復帰シーケンス
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
