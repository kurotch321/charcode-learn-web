export function toHex(bytes: Uint8Array | null | undefined): string {
  if (!bytes || bytes.length === 0) return "";
  return Array.from(bytes)
    .map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
    .join(" ");
}

export function toCodePointLabel(cp: number): string {
  return "U+" + cp.toString(16).toUpperCase().padStart(4, "0");
}

const CONTROL_NAMES: Record<number, string> = {
  0x00: "NUL",
  0x07: "BEL",
  0x08: "BS",
  0x09: "TAB",
  0x0a: "LF",
  0x0b: "VT",
  0x0c: "FF",
  0x0d: "CR",
  0x1b: "ESC",
  0x7f: "DEL",
};

// Render a single code point safely for inline display. Control characters
// and spaces become angle-bracketed mnemonics so rows keep a constant height
// and whitespace doesn't visually collapse.
export function toDisplayChar(cp: number, char: string): string {
  if (CONTROL_NAMES[cp]) return `<${CONTROL_NAMES[cp]}>`;
  if (cp < 0x20) return `<U+${cp.toString(16).toUpperCase().padStart(4, "0")}>`;
  if (cp === 0x20) return "␠";
  if (cp >= 0x80 && cp <= 0x9f) {
    return `<U+${cp.toString(16).toUpperCase().padStart(4, "0")}>`;
  }
  return char;
}

export function countCodePoints(input: string): number {
  return Array.from(input).length;
}
