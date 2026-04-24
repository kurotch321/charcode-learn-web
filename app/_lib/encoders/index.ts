import { ascii } from "./ascii";
import { eucJp, iso2022Jp, shiftJis } from "./japanese";
import { latin1 } from "./latin1";
import type { EncodingEntry } from "./types";
import { utf16be, utf16le } from "./utf16";
import { utf32be } from "./utf32";
import { utf8 } from "./utf8";
import { windows1252 } from "./windows1252";

export const encoders: EncodingEntry[] = [
  {
    id: "utf-8",
    label: "UTF-8",
    description: "1〜4バイトの可変長。Unicode 全コードポイントを表現可能",
    encoder: utf8,
  },
  {
    id: "utf-16-le",
    label: "UTF-16 LE",
    description: "2 or 4バイト固定幅。BMP外はサロゲートペア。BOM なし",
    encoder: utf16le,
  },
  {
    id: "utf-16-be",
    label: "UTF-16 BE",
    description: "UTF-16 LE のバイトオーダー逆。BOM なし",
    encoder: utf16be,
  },
  {
    id: "utf-32-be",
    label: "UTF-32 BE",
    description: "常に 4バイト。コードポイントをそのまま big-endian で格納",
    encoder: utf32be,
  },
  {
    id: "ascii",
    label: "ASCII (7-bit)",
    description: "U+0000..U+007F のみ。範囲外は表現不可",
    encoder: ascii,
  },
  {
    id: "latin-1",
    label: "Latin-1 (ISO-8859-1)",
    description: "U+0000..U+00FF を 1バイトに。西欧向け",
    encoder: latin1,
  },
  {
    id: "windows-1252",
    label: "Windows-1252",
    description: "Latin-1 拡張。0x80-0x9F に €・“” 等 27文字を追加",
    encoder: windows1252,
  },
  {
    id: "shift-jis",
    label: "Shift_JIS",
    description: "JIS X 0208 を ASCII と干渉なく1〜2バイトに詰めた日本語エンコード",
    encoder: shiftJis,
  },
  {
    id: "euc-jp",
    label: "EUC-JP",
    description: "JIS X 0208 を 2バイト、JIS X 0201 カナを 2バイト(0x8E+字形)",
    encoder: eucJp,
  },
  {
    id: "iso-2022-jp",
    label: "ISO-2022-JP",
    description: "ESC で ASCII / JIS X 0208 モードを切り替える 7-bit エンコード",
    encoder: iso2022Jp,
  },
];
