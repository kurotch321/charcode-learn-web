import { iterateCodePoints, type EncodeResult, type Encoder } from "./types";

export const latin1: Encoder = (input: string): EncodeResult => {
  const chars = iterateCodePoints(input).map(({ char, codePoint }) => {
    if (codePoint <= 0xff) {
      return { char, codePoint, bytes: new Uint8Array([codePoint]) };
    }
    return {
      char,
      codePoint,
      bytes: null,
      note: "ISO-8859-1 では表現不可",
    };
  });
  const totalBytes = chars.reduce(
    (sum, c) => sum + (c.bytes?.length ?? 0),
    0,
  );
  return { totalBytes, chars };
};
