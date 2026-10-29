import type { RecordSummary } from "../records";
import Photo from "./Photo";
import RecordText from "./RecordText";

// The photo sits in its own column, so the text lines up the same way
// whether or not a record has an image. Only the title links to the record.
// The list page puts rows right under its h1, the home page under an h2.
export default function RecordRow({
  record,
  heading,
}: {
  record: RecordSummary;
  heading: "h2" | "h3";
}) {
  return (
    <article className="row">
      <div>
        <RecordText record={record} heading={heading} />
      </div>
      {record.image && <Photo src={record.image} ratio="16 / 10" />}
    </article>
  );
}
