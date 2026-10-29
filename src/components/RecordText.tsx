import type { RecordSummary } from "../records";
import RecordMeta from "./RecordMeta";
import Tags from "./Tags";

// Shared by the home page's latest record and the rows; the caller lays them out.
export default function RecordText({ record, heading: Heading }: { record: RecordSummary; heading: "h2" | "h3" }) {
  return (
    <>
      <RecordMeta date={record.date} author={record.author} />
      <Heading className="record-title">
        <a href={record.path}>{record.title}</a>
      </Heading>
      {record.description && <p>{record.description}</p>}
      <Tags tags={record.tags} />
    </>
  );
}
