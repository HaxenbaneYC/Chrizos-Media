import { Fragment } from "react";

import { usePinProgress } from "./motion-b";

/**
 * The manifesto: one giant statement on Deep Navy that charges up word by
 * word as the reader scrolls, with the key words taking the white highlight
 * as they light. Screen readers get the sentence as plain text.
 */
export function Manifesto({ text, charged }: { text: string; charged: string[] }) {
  const words = text.split(" ");
  // a key word takes the highlight once it has fully lit
  const ref = usePinProgress<HTMLElement>((p, el) => {
    el.querySelectorAll<HTMLElement>(".b-word.is-key").forEach((w) => {
      const i = Number(w.style.getPropertyValue("--i"));
      w.classList.toggle("is-lit", p * 1.25 * words.length - i >= 1.4);
    });
  });
  const keep = new Set(charged.map((w) => w.toLowerCase()));
  return (
    <section ref={ref} aria-label="What we believe" className="b-manifesto" style={{ ["--n" as string]: words.length }}>
      <div className="b-manifesto-stage">
        <div className="d-wrap">
          <p className="text-sm font-semibold uppercase tracking-[0.14em]">What we believe</p>
          <p className="sr-only">{text}</p>
          <p aria-hidden className="d-display b-manifesto-text mt-6">
            {words.map((w, i) => (
              <Fragment key={i}>
                <span className={`b-word ${keep.has(w.replace(/[^\w’']/g, "").toLowerCase()) ? "is-key" : ""}`} style={{ ["--i" as string]: i }}>
                  {w}
                </span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
