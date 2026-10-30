// Prerendered as 404.html, which GitHub Pages serves for missing URLs.
export default function NotFoundPage() {
  return (
    <main>
      <section className="band">
        <div className="section-head">
          <h1>ページが見つかりませんでした</h1>
        </div>
        <p>お探しのページは、移動したか、なくなったのかもしれません。</p>
        <nav aria-label="関連ページ" className="more-links">
          <a href="/" className="more">
            トップへ →
          </a>
          <a href="/making/" className="more">
            つくることの記録の一覧へ →
          </a>
        </nav>
      </section>
    </main>
  );
}
