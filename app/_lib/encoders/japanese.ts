import Encoding from "encoding-japanese";
import { iterateCodePoints, type EncodeResult, type Encoder } from "./types";

type JpTarget = "SJIS" | "EUCJP" | "JIS";

function convertCodePoints(cps: number[], to: JpTarget): Uint8Array {
  const out = Encoding.convert(cps, {
    to,
    from: "UNICODE",
    type: "array",
  }) as number[];
  return Uint8Array.from(out);
}

function makeStatelessEncoder(to: "SJIS" | "EUCJP", label: string): Encoder {
  return (input: string): EncodeResult => {
    const chars = iterateCodePoints(input).map(({ char, codePoint }) => {
      const bytes = convertCodePoints([codePoint], to);
      const substituted =
        bytes.length === 1 && bytes[0] === 0x3f && codePoint !== 0x3f;
      if (substituted) {
        return {
          char,
          codePoint,
          bytes,
          note: `${label} では表現不可 (0x3F '?' に置換)`,
        };
      }
      return { char, codePoint, bytes };
    });
    const totalBytes = chars.reduce((sum, c) => sum + c.bytes.length, 0);
    return { totalBytes, chars };
  };
}

export const shiftJis: Encoder = makeStatelessEncoder("SJIS", "Shift_JIS");
export const eucJp: Encoder = makeStatelessEncoder("EUCJP", "EUC-JP");

// ISO-2022-JP is stateful: mode-switching escape sequences
//   ESC $ B  (1B 24 42)  -> JIS X 0208 mode
//   ESC ( B  (1B 28 42)  -> ASCII mode
// belong to transitions between characters rather than to a single
// character. We approximate per-character bytes by encoding progressively
// longer prefixes and taking the byte-level delta. Any escape bytes
// emitted at the head of the very first character become `prefixBytes`.
// If the encoder leaves the string in non-ASCII mode, a trailing ASCII
// switch-back sequence is captured as `suffixBytes`.
export const iso2022Jp: Encoder = (input: string): EncodeResult => {
  const codePoints = iterateCodePoints(input);
  if (codePoints.length === 0) {
    return { totalBytes: 0, chars: [] };
  }

  const prefixes: Uint8Array[] = [new Uint8Array(0)];
  for (let i = 1; i <= codePoints.length; i++) {
    const head = codePoints.slice(0, i).map((c) => c.codePoint);
    prefixes.push(convertCodePoints(head, "JIS"));
  }

  const fullBytes = prefixes[prefixes.length - 1];

  const ESC_ASCII = [0x1b, 0x28, 0x42];
  let suffixBytes: Uint8Array | undefined;
  if (
    fullBytes.length >= 3 &&
    fullBytes[fullBytes.length - 3] === ESC_ASCII[0] &&
    fullBytes[fullBytes.length - 2] === ESC_ASCII[1] &&
    fullBytes[fullBytes.length - 1] === ESC_ASCII[2]
  ) {
    suffixBytes = new Uint8Array(ESC_ASCII);
  }
  const effectiveLen = suffixBytes
    ? fullBytes.length - suffixBytes.length
    : fullBytes.length;

  const chars = codePoints.map(({ char, codePoint }, i) => {
    const start = prefixes[i].length;
    const endRaw = prefixes[i + 1].length;
    const end =
      i === codePoints.length - 1 ? effectiveLen : endRaw;
    const bytes = fullBytes.slice(start, end);
    const payload = bytes.filter((b) => b !== 0x1b); // rough detect
    const substituted =
      payload.length === 1 && payload[0] === 0x3f && codePoint !== 0x3f;
    if (substituted) {
      return {
        char,
        codePoint,
        bytes,
        note: "ISO-2022-JP では表現不可 (0x3F '?' に置換)",
      };
    }
    return { char, codePoint, bytes };
  });

  const totalBytes = fullBytes.length;
  return { totalBytes, chars, suffixBytes };
};
