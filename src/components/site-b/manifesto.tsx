import { usePinProgress } from "./motion-b";

/**
 * The manifesto: one short line, then three giant words that light one by
 * one as the reader scrolls; the last takes the white highlight. Screen
 * readers get it as plain text.
 */
export function Manifesto({ lead, beats }: { lead: string; beats: string[] }) {
  const total = beats.length + 1;
  const ref = usePinProgress<HTMLElement>((p, el) => {
    const last = el.querySelector<HTMLElement>(".b-beat.is-key");
    last?.classList.toggle("is-lit", p * 1.2 * total - (total - 1) >= 1);
  });
  return (
    <section ref={ref} aria-label="What we believe" className="b-manifesto" style={{ ["--n" as string]: total }}>
      <div className="b-manifesto-stage">
        <div className="d-wrap">
          <p className="sr-only">
            {lead} {beats.join(" ")}
          </p>
          <div aria-hidden>
            <p className="b-word b-manifesto-lead d-display" style={{ ["--i" as string]: 0 }}>
              {lead}
            </p>
            <p className="d-display b-manifesto-beats mt-8">
              {beats.map((b, i) => (
                <span key={b} className={`b-word b-beat ${i === beats.length - 1 ? "is-key" : ""}`} style={{ ["--i" as string]: i + 1 }}>
                  {b}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
