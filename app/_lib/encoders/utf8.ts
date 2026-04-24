import { iterateCodePoints, type EncodeResult, type Encoder } from "./types";

// UTF-8 rules (RFC 3629):
//   U+0000..U+007F    -> 0xxxxxxx                                (1 byte)
//   U+0080..U+07FF    -> 110xxxxx 10xxxxxx                       (2 bytes)
//   U+0800..U+FFFF    -> 1110xxxx 10xxxxxx 10xxxxxx              (3 bytes)
//   U+10000..U+10FFFF -> 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx     (4 bytes)
function encodeCodePoint(cp: number): Uint8Array {
  if (cp <= 0x7f) {
    return new Uint8Array([cp]);
  }
  if (cp <= 0x7ff) {
    return new Uint8Array([
      0xc0 | (cp >> 6),
      0x80 | (cp & 0x3f),
    ]);
  }
  if (cp <= 0xffff) {
    return new Uint8Array([
      0xe0 | (cp >> 12),
      0x80 | ((cp >> 6) & 0x3f),
      0x80 | (cp & 0x3f),
    ]);
  }
  return new Uint8Array([
    0xf0 | (cp >> 18),
    0x80 | ((cp >> 12) & 0x3f),
    0x80 | ((cp >> 6) & 0x3f),
    0x80 | (cp & 0x3f),
  ]);
}

export const utf8: Encoder = (input: string): EncodeResult => {
  const chars = iterateCodePoints(input).map(({ char, codePoint }) => {
    const bytes = encodeCodePoint(codePoint);
    return { char, codePoint, bytes };
  });
  const totalBytes = chars.reduce((sum, c) => sum + (c.bytes?.length ?? 0), 0);
  return { totalBytes, chars };
};
