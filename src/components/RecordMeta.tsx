import type { RecordAuthor } from "../record-frontmatter";

export default function RecordMeta({ date, author }: { date: string; author: RecordAuthor }) {
  return (
    <div className="record-meta">
      <time dateTime={date}>{date.replaceAll("-", ".")}</time>
      <span>
        {author.url ? (
          <a href={author.url} target="_blank" rel="noreferrer">
            {author.name}
          </a>
        ) : (
          author.name
        )}
      </span>
    </div>
  );
}
