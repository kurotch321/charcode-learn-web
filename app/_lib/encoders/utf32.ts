import { iterateCodePoints, type EncodeResult, type Encoder } from "./types";

function encodeCodePoint(cp: number): Uint8Array {
  return new Uint8Array([
    (cp >>> 24) & 0xff,
    (cp >>> 16) & 0xff,
    (cp >>> 8) & 0xff,
    cp & 0xff,
  ]);
}

export const utf32be: Encoder = (input: string): EncodeResult => {
  const chars = iterateCodePoints(input).map(({ char, codePoint }) => ({
    char,
    codePoint,
    bytes: encodeCodePoint(codePoint),
  }));
  const totalBytes = chars.reduce((sum, c) => sum + c.bytes.length, 0);
  return { totalBytes, chars };
};
