import { iterateCodePoints, type EncodeResult, type Encoder } from "./types";

// Windows-1252 differs from ISO-8859-1 only in 0x80..0x9F, where these
// 27 code points (+ 5 undefined slots) replace the C1 control block.
// Table index 0 == 0x80, index 31 == 0x9F. `null` marks undefined slots
// (0x81, 0x8D, 0x8F, 0x90, 0x9D).
const HIGH_RANGE_FROM_BYTE: (number | null)[] = [
  0x20ac, null,   0x201a, 0x0192, 0x201e, 0x2026, 0x2020, 0x2021,
  0x02c6, 0x2030, 0x0160, 0x2039, 0x0152, null,   0x017d, null,
  null,   0x2018, 0x2019, 0x201c, 0x201d, 0x2022, 0x2013, 0x2014,
  0x02dc, 0x2122, 0x0161, 0x203a, 0x0153, null,   0x017e, 0x0178,
];

const CP_TO_BYTE = (() => {
  const map = new Map<number, number>();
  HIGH_RANGE_FROM_BYTE.forEach((cp, i) => {
    if (cp !== null) map.set(cp, 0x80 + i);
  });
  return map;
})();

export const windows1252: Encoder = (input: string): EncodeResult => {
  const chars = iterateCodePoints(input).map(({ char, codePoint }) => {
    if (codePoint <= 0x7f || (codePoint >= 0xa0 && codePoint <= 0xff)) {
      return { char, codePoint, bytes: new Uint8Array([codePoint]) };
    }
    const mapped = CP_TO_BYTE.get(codePoint);
    if (mapped !== undefined) {
      return { char, codePoint, bytes: new Uint8Array([mapped]) };
    }
    return {
      char,
      codePoint,
      bytes: null,
      note: "Windows-1252 では表現不可",
    };
  });
  const totalBytes = chars.reduce(
    (sum, c) => sum + (c.bytes?.length ?? 0),
    0,
  );
  return { totalBytes, chars };
};
