---
title: 末尾のスラッシュと GitHub Pages
date: 2026-11-09
author: honbin
authorUrl: https://honb.in
layout: article
description: Void で書き出したページを GitHub Pages に置くと、スラッシュで終わる URL が 404 になりました。回避策でしのぎつつ issue を出したところ、Void 1.7.0 で設定ひとつで済むようになりました。
tags:
  - サイトづくり
  - Void
  - GitHub Pages
---

前回の記録のあと、GitHub Actions でビルドから公開までを自動化して、新しい makewith\.jp を公開しました。今回は、その準備をしているときに気づいた、URL の末尾のスラッシュの話です。

## スラッシュで終わる URL が 404 になる

このサイトでは、記録の一覧を `/making/`、個々の記録を `/making/rebuilding-makewith/` のように、URL の末尾にスラッシュを付けています。

ところが、Void で書き出したサイトをそのまま GitHub Pages に置くと、スラッシュで終わる URL が 404 になってしまうことがわかりました。

## なぜ 404 になるのか

Void は `output: "static"` のとき、`/making` のページを `making.html` というファイルに書き出します。記録のページは `making/rebuilding-makewith.html` になるので、`making.html` と `making/` フォルダが横に並ぶ形です。

GitHub Pages は、`/making` なら `making.html` を返してくれますが、`/making/` のときに探すのは `making/index.html` です。なので、`making.html` しかないと、スラッシュ付きの URL は 404 になってしまいます。

開発中に気づけなかったのは、開発サーバーが `/about/` を `/about` へリダイレクトしていたからです。スラッシュを付けても付けなくても、ページが開けていました。

実際の GitHub Pages でどうなるのか確かめるため、2 通りのファイル構成を比べられるサンプルを [GitHub](https://github.com/honbin/github-pages-trailing-slash) につくりました。`posts` というページで比べると、こうなります。

| ファイル構成 | `/posts` | `/posts/` |
|---|---|---|
| `posts.html`（Void の既定） | 200 | 404 |
| `posts/index.html` | 301（`/posts/` へ） | 200 |

`posts/index.html` の形なら、スラッシュなしの URL もスラッシュ付きへ転送されるので、どちらでも開けます。

## ひとまずの回避策

URL の形は変えたくなかったので、CI でビルドしたあとに、`index.html` と `404.html` 以外の HTML を、`making.html` なら `making/index.html` のように移すことにしました。

```sh
find dist/client -name '*.html' ! -name index.html ! -name 404.html | while read -r file; do
  mkdir -p "${file%.html}"
  mv "$file" "${file%.html}/index.html"
done
```

これで、公開したサイトはちゃんと動くようになりました。ただ、開発サーバーとの食い違いは残ったままですし、ビルドのあとで出力を書き換えるのは、あまり気持ちのいいものではありません。

## issue を出した

同じ報告は見当たらなかったので、Void のリポジトリに [issue](https://github.com/voidzero-dev/void/issues/638) を出してみました。

提案したのは 2 つです。ページを `posts/index.html` の形で書き出す設定を加えることと、開発サーバーのリダイレクトの向きをその設定に合わせること。上のサンプルの結果も添えておきました。

## Void 1.7.0 で設定ひとつに

そして、11 月 9 日に出た Void 1.7.0 で、`routing.trailingSlash` という設定が入りました。

```ts
export default defineConfig({
  output: "static",
  routing: { trailingSlash: true },
});
```

これだけで、ページが `making/index.html` の形で書き出されます。開発サーバーでも、スラッシュなしの URL からスラッシュ付きの URL へリダイレクトされるようになりました。

issue で提案した 2 つの変更は、どちらも入っています。設定の名前や置き場所は、最終的に `routing` の下に `trailingSlash` を置く形に落ち着きました。

さっそく切り替えて、回避策を入れていたときの出力と比べてみました。726 個のファイルすべてで、ファイル名も内容も同じ。これで CI の回避策も[取り除けました](https://github.com/makewith/makewith.github.io/commit/61ff519c030aab51f9677d7be509875429ce84a0)。公開したサイトでも `/making/` が開けること、`/making` が `/making/` へ転送されることを確認しています。

ビルド後に HTML を移す必要もなくなって、Void 本体の設定だけで済むようになったのはうれしいですね。

このサイトのコードは [GitHub](https://github.com/makewith/makewith.github.io) で公開しています。
