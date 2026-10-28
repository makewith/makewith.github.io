import Photo from "#src/components/Photo";
import RecordRow from "#src/components/RecordRow";
import RecordText from "#src/components/RecordText";
import { records } from "#src/records";
import { placeImage } from "#src/site";

const [latest, ...others] = records;

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-text">
          <h1>
            つくる人が集まり、
            <br />
            つくり続ける場所。
          </h1>
          <div className="lead">
            <p>何かをつくりたい。少しずつつくっている。</p>
            <p>ときには、つくれない時期もある。</p>
            <p>
              それぞれのペースで、つくることを続けられる場所を
              <br className="wide-only" />
              目指しています。
            </p>
          </div>
        </div>
        <Photo
          className="hero-photo"
          src={placeImage}
          alt="机を囲んで、参加者がそれぞれノートパソコンで作業している様子"
          ratio="4 / 3"
          eager
        />
      </section>

      {latest && (
        <section className="band">
          <div className="section-head">
            <h2>つくることの記録</h2>
            <span className="sub">完成したものだけでなく、つくっている途中のことも。</span>
          </div>
          <div className={latest.image ? "feature" : "feature no-photo"}>
            {latest.image && <Photo src={latest.image} ratio="16 / 9" />}
            <div className="feature-body">
              <RecordText record={latest} heading="h3" />
            </div>
          </div>
          {others.length > 0 && (
            <>
              <div className="rows">
                {others.slice(0, 3).map((record) => (
                  <RecordRow key={record.path} record={record} heading="h3" />
                ))}
              </div>
              <a href="/making/" className="more">
                つくることの記録の一覧へ →
              </a>
            </>
          )}
        </section>
      )}

      <section className="band return">
        <div className="return-body">
          <h2>つくれていないときにも、戻ってこられる。</h2>
          <p>毎日つくり続けなくてもいい。成果を見せられなくてもいい。</p>
          <p>ひとりで続けることも、誰かと出会うことも、ここからまた始められる。</p>
          <p>そんな場所にしていきたいと思っています。</p>
          <a href="/about/" className="more">
            makewith について →
          </a>
        </div>
      </section>
    </main>
  );
}
