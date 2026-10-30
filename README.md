# makewith

[makewith.jp](https://makewith.jp) のソースです。
つくる人が集まり、つくり続ける場所として、もくもく会の案内や、つくったもの、つくっている途中の記録を載せています。

サイトは [Void](https://void.cloud) と React で作り、すべてのページをビルド時に HTML として書き出しています。
公開先は GitHub Pages です。

## 手元で動かす

Node のバージョンは `.tool-versions` に書いてあります。
[mise](https://mise.jdx.dev) か [asdf](https://asdf-vm.com) を使っている場合は、次のどちらかのコマンドで同じバージョンが入ります。

```sh
mise install   # mise の場合
asdf install   # asdf の場合
```

依存を入れて、開発サーバーを起動します。

```sh
npm ci
npm run dev
```

http://localhost:5173 で確認できます。

`void.config.ts` を変えたときや、記録を足したり frontmatter を書き換えたりしたときは、開発サーバーを再起動してください。
トップページと一覧ページに反映されないことがあります。

公開されるものと同じ形で確かめるときは、次のコマンドを使います。
型チェック、lint、整形の確認、テスト、ビルドの順で、CI と同じことをします。
整形の確認で引っかかったときは、`npx vp fmt` で直せます。
記録の Markdown(`pages/` の `.md`)は、整形の対象に入っていません。
書き出したファイルは `dist/client/` に入ります。

```sh
npx tsc --noEmit
npx vp lint
npx vp fmt --check
npm test
npm run build
```

## 記録を書く

記録は `pages/making/` に、1 件 1 ファイルの Markdown で書きます。
ファイル名がそのまま URL になります(`pages/making/first-meetup.md` なら `/making/first-meetup/`)。

```markdown
---
title: 第 1 回もくもく会
date: 2026-11-14
layout: article
author: 表示する名前
authorUrl: https://example.com
description: 一覧とトップページに出る 1〜2 文の説明
tags:
  - もくもく会
image: /images/first-meetup.jpg
---

本文。タイトル、日付、名前、タグはレイアウトが出すので、本文には書きません。
```

書くときの決まりは次のとおりです。

- `title`、`date`(`2026-11-14` の形)、`layout: article`、`author` は必ず書きます。書き忘れるとビルドが止まります。
- `author` は、記事に表示される名前です。本名でなくても構いません。`authorUrl` は任意で、書くと名前がそのページへのリンクになります。GitHub やブログ、個人サイトなど、自分を一番よく表すページを選んでください(`http://` か `https://` で始まる URL だけ)。
- `image` は任意です。書くと、一覧ページとトップページに画像が表示され、SNS で共有したときにも OGP 画像として使われます。画像は `public/images/` に置き、`/images/first-meetup.jpg` のように `/images/` から書きます。それ以外の形だとビルドが止まります。外部の画像も、保存してここに置きます。ページから他のサイトへ通信しないようにするためです。本文に画像を入れるときも、同じく `public/images/` に置き、`/images/...` から書きます。
- 日本語の段落は 1 行で書きます。段落の途中で改行すると、改行した所に空白が入ります。
- 本文でドメイン名(`makewith.jp` など)をリンクにせず書くときは、`makewith\.jp` のように `.` の前に `\` を付けます。そのままだと自動でリンクになります。
- 下書きのファイル名は `*.dev.md` にします。開発サーバーでだけ表示され、公開用のビルドには含まれません。ただし、コミットするとリポジトリ上では誰でも読めるので、公開したくない下書きはコミットしないでください。

参加した人のものづくりや活動を載せるのは、本人が希望したときだけです。
PR で記録を送ってもらう場合は、本文に含まれる HTML が意図しない表示や外部コンテンツの読み込みにつながらないかを確かめてからマージします。

## ファイルの置き場所

| 場所                                | 中身                                                                                                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pages/`                            | ページ。`index.island.tsx` がトップ、`(prose)/about.md` が About                                                                                                                            |
| `pages/making/`                     | 一覧ページと記録                                                                                                                                                                            |
| `pages/_layouts/article.island.tsx` | 記録のページのレイアウト                                                                                                                                                                    |
| `pages/style.css`                   | サイト全体の CSS                                                                                                                                                                            |
| `src/`                              | 部品(`components/`)、記録の集め方(`records.ts`)、記録の frontmatter の読み方と確認(`record-frontmatter.ts` とそのテスト)、OGP のタグの作り方(`og.ts` とそのテスト)、サイトの設定(`site.ts`) |
| `middleware/01.og.ts`               | 各ページに OGP と canonical のタグを足す処理(中身は `src/og.ts`)                                                                                                                            |
| `public/`                           | そのまま公開されるファイル(画像、favicon)                                                                                                                                                   |

`pages/` や `middleware/` から `src/` を読み込むときは、`../src/` ではなく `#src/components/Photo` のように `#src/` から書きます(`package.json` の `imports` で設定しています)。

## 公開

`main` に入ると、GitHub Actions がビルドして GitHub Pages に公開します。
公開時は、`/making/` のような末尾スラッシュ付きの URL で開けるよう、CI で各ページの HTML を `x/index.html` の形に移します。
PR では、型チェック、lint、整形の確認、テスト、ビルドだけを行います。

依存の更新は Renovate が PR で届けます。
