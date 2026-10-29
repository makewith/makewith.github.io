import pages from "@void/md/pages";
import { frontmatterProblems, readRecord, type RecordFields } from "./record-frontmatter";

export interface RecordSummary extends RecordFields {
  path: string;
}

const recordPages = pages.filter((page) => page.path.startsWith("/making/"));

const problems = recordPages.flatMap((page) => {
  const found = frontmatterProblems(page.frontmatter);
  return found.length > 0 ? [`${page.path}: ${found.join(", ")}`] : [];
});
if (problems.length > 0) {
  throw new Error(`Fix the frontmatter of these records:\n${problems.join("\n")}`);
}

export const records: RecordSummary[] = recordPages
  .map((page) => ({ path: `${page.path}/`, ...readRecord(page.frontmatter) }))
  .sort((a, b) => b.date.localeCompare(a.date));
