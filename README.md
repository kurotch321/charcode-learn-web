# 文字コード学習ツール

入力した文字列を **Unicode コードポイント** と **10 種の文字コードによるバイト列** に変換して可視化する、学習用サイト。

## できること

左ペインのテキストエリアに文字を入力すると、右ペインの各カードが 1 文字ずつのコードポイントとバイト列 (hex) を並べて表示します。表現できない文字は赤背景で注記、ISO-2022-JP のエスケープシーケンスは琥珀色の prefix/suffix 行として分離表示。

対応する文字コード (カード表示順):

| # | 文字コード | 概要 |
| --- | --- | --- |
| 1 | UTF-8 | 1〜4バイト可変長。Unicode 全域 |
| 2 | UTF-16 LE | 2 or 4バイト (サロゲートペア)。BOM なし |
| 3 | UTF-16 BE | UTF-16 LE のバイトオーダー逆 |
| 4 | UTF-32 BE | 常に 4バイト (コードポイントをそのまま) |
| 5 | ASCII (7-bit) | U+0000..U+007F のみ |
| 6 | Latin-1 (ISO-8859-1) | U+0000..U+00FF を 1バイトに |
| 7 | Windows-1252 | Latin-1 + 0x80-0x9F に €・"" 等 27文字 |
| 8 | Shift_JIS | JIS X 0208 を詰めた日本語エンコード |
| 9 | EUC-JP | JIS X 0208 / 0201 カナ / 0212 補助 |
| 10 | ISO-2022-JP | ESC でモード切替する 7-bit エンコード |

Unicode / ASCII / Latin-1 / Windows-1252 系は純 TypeScript で手書き (`app/_lib/encoders/`)。日本語 3 種は [`encoding-japanese`](https://github.com/polygonplanet/encoding.js) に委譲しつつ、1 コードポイントずつ呼び分けて文字単位の内訳を得ています。

## 技術スタック

- [Next.js 16](https://nextjs.org) App Router (Turbopack)
- React 19
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- TypeScript 5
- pnpm 10
- `encoding-japanese` (日本語文字コードの変換)

## ローカル開発

```bash
pnpm install
pnpm dev
# http://localhost:3000/
```

```bash
pnpm lint          # ESLint
pnpm build         # 静的エクスポート → out/
```

本番ビルドをローカルで確認する場合:

```bash
pnpm build
pnpm dlx serve out -l 3001
# http://localhost:3001/charcode-learn-web/  (basePath 付き)
```

## ファイル構成

```
app/
├── layout.tsx               メタデータ (title, description, lang=ja)
├── page.tsx                 Server Component。<EncoderApp /> を描画
├── globals.css              Tailwind + CSS 変数
├── _components/             'use client' 境界以下の UI
│   ├── EncoderApp.tsx       入力 state とレイアウト (左右 grid)
│   ├── InputPane.tsx        textarea + コードポイント数カウンタ
│   ├── EncodingCard.tsx     1 文字コード分のカード
│   └── ByteTable.tsx        1 文字ごとの行 (Char/CP/Hex/Note)
└── _lib/
    ├── format.ts            hex / U+XXXX / 制御文字表示
    └── encoders/
        ├── types.ts         共有型 (EncodeResult, EncodingEntry …)
        ├── index.ts         UI が map する順序付き配列
        ├── utf8.ts / utf16.ts / utf32.ts
        ├── ascii.ts / latin1.ts / windows1252.ts
        └── japanese.ts      SJIS / EUC-JP / ISO-2022-JP
```

## 既知の制約

- **ISO-2022-JP のバイト帰属**: エスケープシーケンス (`1B 24 42` など) はモード遷移に属し、単一文字との 1:1 対応を持ちません。prefix 差分法で近似し、直前の文字の行に含めています。`prefixBytes` / `suffixBytes` として別行化する場合もあります。
- **UTF-16 BOM**: 出力に BOM は付与しません (各文字のバイト列のみ)。
- **表示できない文字**: ASCII / Latin-1 / Windows-1252 では `bytes: null` + 赤背景。Shift_JIS / EUC-JP / ISO-2022-JP は `encoding-japanese` が `0x3F` (`?`) に置換するため、それを検知して注記を付けます。
