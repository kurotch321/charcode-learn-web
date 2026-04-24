export type EncodedChar = {
  char: string;
  codePoint: number;
  bytes: Uint8Array | null;
  note?: string;
};

export type EncodeResult = {
  totalBytes: number;
  chars: EncodedChar[];
  prefixBytes?: Uint8Array;
  suffixBytes?: Uint8Array;
};

export type Encoder = (input: string) => EncodeResult;

export type EncodingEntry = {
  id: string;
  label: string;
  description?: string;
  encoder: Encoder;
};

export function iterateCodePoints(input: string): { char: string; codePoint: number }[] {
  const out: { char: string; codePoint: number }[] = [];
  for (const ch of input) {
    out.push({ char: ch, codePoint: ch.codePointAt(0)! });
  }
  return out;
}
