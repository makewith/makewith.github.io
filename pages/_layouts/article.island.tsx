import type { ReactNode } from "react";
import { useFrontmatter } from "@void/md";
import SiteFrame from "#src/components/SiteFrame";
import RecordMeta from "#src/components/RecordMeta";
import Tags from "#src/components/Tags";
import { readRecord } from "#src/record-frontmatter";
import "../style.css";

// A named layout replaces the root layout, so it brings its own SiteFrame and styles.
export default function ArticleLayout({ children }: { children: ReactNode }) {
  const record = readRecord(useFrontmatter());
  return (
    <SiteFrame>
      <main>
        <article className="prose">
          <header className="article-head">
            <h1>{record.title}</h1>
            <RecordMeta date={record.date} author={record.author} />
            <Tags tags={record.tags} />
          </header>
          {children}
          <a href="/making/" className="more">
            ← つくることの記録の一覧へ
          </a>
        </article>
      </main>
    </SiteFrame>
  );
}
