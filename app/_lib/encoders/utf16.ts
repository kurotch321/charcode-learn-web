import { iterateCodePoints, type EncodeResult, type Encoder } from "./types";

function encodeCodePoint(cp: number, littleEndian: boolean): Uint8Array {
  if (cp <= 0xffff) {
    const hi = (cp >> 8) & 0xff;
    const lo = cp & 0xff;
    return littleEndian ? new Uint8Array([lo, hi]) : new Uint8Array([hi, lo]);
  }
  const v = cp - 0x10000;
  const high = 0xd800 | (v >> 10);
  const low = 0xdc00 | (v & 0x3ff);
  const hh = (high >> 8) & 0xff;
  const hl = high & 0xff;
  const lh = (low >> 8) & 0xff;
  const ll = low & 0xff;
  return littleEndian
    ? new Uint8Array([hl, hh, ll, lh])
    : new Uint8Array([hh, hl, lh, ll]);
}

function makeEncoder(littleEndian: boolean): Encoder {
  return (input: string): EncodeResult => {
    const chars = iterateCodePoints(input).map(({ char, codePoint }) => ({
      char,
      codePoint,
      bytes: encodeCodePoint(codePoint, littleEndian),
    }));
    const totalBytes = chars.reduce((sum, c) => sum + c.bytes.length, 0);
    return { totalBytes, chars };
  };
}

export const utf16le: Encoder = makeEncoder(true);
export const utf16be: Encoder = makeEncoder(false);
