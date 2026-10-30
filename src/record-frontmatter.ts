// Reading and checking one record, shared by records.ts and the article
// layout. Kept apart from records.ts so the article layout does not load
// Void's page list, and so these can run under the unit tests.

export interface RecordAuthor {
  name: string;
  url?: string;
}

// What the list and the article page both show for a record.
export interface RecordFields {
  title: string;
  date: string;
  author: RecordAuthor;
  description: string;
  tags: string[];
  image?: string;
}

// YAML reads an unquoted `date: 2026-11-10` as a timestamp, which reaches
// pages as an ISO string (or a Date), so keep only the YYYY-MM-DD part.
function formatRecordDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === "string" ? value.slice(0, 10) : "";
}

const toText = (value: unknown) => (typeof value === "string" ? value : "");

function toTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  return typeof value === "string" && value !== "" ? [value] : [];
}

export function readRecord(frontmatter: Record<string, unknown>): RecordFields {
  const { authorUrl, image } = frontmatter;
  return {
    title: toText(frontmatter.title),
    date: formatRecordDate(frontmatter.date),
    author: { name: toText(frontmatter.author), url: typeof authorUrl === "string" ? authorUrl : undefined },
    description: toText(frontmatter.description),
    tags: toTags(frontmatter.tags),
    image: typeof image === "string" ? image : undefined,
  };
}

// Checks the raw value, not only the formatted one, since formatting cuts
// "2026-11-14xyz" down to a valid date. "2026-02-30" parses as March 2, so the
// date must also read back as the same day.
function isRecordDate(value: unknown): boolean {
  if (!(value instanceof Date || typeof value === "string") || Number.isNaN(new Date(value).getTime())) return false;
  const date = formatRecordDate(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && new Date(date).toISOString().startsWith(date);
}

// Without these the record renders without its title, date, and author, or
// links somewhere unexpected; records.ts fails the build when any are found.
// An empty "description:", "authorUrl:", or "image:" reads as null and counts
// as not written.
export function frontmatterProblems(frontmatter: Record<string, unknown>): string[] {
  const problems = [];
  if (frontmatter.layout !== "article") problems.push('"layout: article"');
  if (typeof frontmatter.title !== "string" || frontmatter.title === "") problems.push('"title"');
  if (!isRecordDate(frontmatter.date)) problems.push('a "date" as YYYY-MM-DD');
  if (typeof frontmatter.author !== "string" || frontmatter.author === "") problems.push('"author"');
  const { description, authorUrl, image } = frontmatter;
  // A number or list would otherwise show up as its string form, such as "2026" or "a,b".
  if (description != null && typeof description !== "string") problems.push('a text "description"');
  if (authorUrl != null && (typeof authorUrl !== "string" || !/^https?:\/\//.test(authorUrl))) {
    problems.push('an http(s) "authorUrl"');
  }
  // Images are served from this site so pages make no requests to other hosts.
  if (image != null && (typeof image !== "string" || !image.startsWith("/images/"))) {
    problems.push('an "image" under /images/');
  }
  return problems;
}
