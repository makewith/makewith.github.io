import RecordRow from "#src/components/RecordRow";
import { records } from "#src/records";

export default function RecordsPage() {
  return (
    <main>
      <section className="band">
        <div className="section-head">
          <h1>つくることの記録</h1>
          <span className="sub">完成したものだけでなく、つくっている途中のことも。</span>
        </div>
        {records.length > 0 ? (
          <div className="rows">
            {records.map((record) => (
              <RecordRow key={record.path} record={record} heading="h2" />
            ))}
          </div>
        ) : (
          <p>まだ記録はありません。</p>
        )}
      </section>
    </main>
  );
}
