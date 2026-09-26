import { useEffect, useRef, type ReactNode } from "react";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - (1 - clamp(t)) ** 3;

/**
 * "The Strike": a pinned, scroll-scrubbed opening. A full Electric Blue screen
 * says businesses don't have a product problem; a white line strikes it out,
 * the bolt drops with a flash, Navy splits the screen and the real problem
 * lands with its highlight. Scrolling back rewinds it. Reduced motion shows
 * the finished frame without pinning.
 */
export function StrikeHero({ lead, actions }: { lead: ReactNode; actions: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = (p: number) => {
      const s = el.style;
      s.setProperty("--s", ease((p - 0.1) / 0.2).toFixed(3)); // strike through
      s.setProperty("--b", ease((p - 0.3) / 0.14).toFixed(3)); // bolt drops
      s.setProperty("--f", Math.max(0, 1 - Math.abs(p - 0.45) / 0.05).toFixed(3)); // flash
      s.setProperty("--w", ease((p - 0.42) / 0.16).toFixed(3)); // navy wipe
      s.setProperty("--t", ease((p - 0.56) / 0.14).toFixed(3)); // second line
      const h = ease((p - 0.66) / 0.12);
      s.setProperty("--h", h.toFixed(3)); // highlight
      s.setProperty("--c", ease((p - 0.74) / 0.14).toFixed(3)); // lead and buttons
      el.dataset["on"] = h > 0.55 ? "1" : "0";
      el.dataset["live"] = p > 0.74 ? "1" : "0";
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset["static"] = "1";
      set(1);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      set(run > 0 ? clamp(-r.top / run) : 1);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="top" ref={ref} className="b-strike" aria-labelledby="hero-title">
      <div className="b-strike-stage">
        <div className="b-strike-a">
          <div className="b-strike-inner">
            <p className="text-sm font-semibold uppercase tracking-[0.14em]">For growing businesses</p>
            <h1 id="hero-title" className="d-display b-strike-h mt-4">
              Great businesses don’t have a{" "}
              <span className="b-struck">
                product problem.
              </span>
              <span className="sr-only"> They have an attention problem.</span>
            </h1>
          </div>
        </div>

        <div className="b-strike-b">
          <div className="b-strike-inner">
            <p aria-hidden className="d-display b-strike-h b-strike-2">
              They have an <br className="hidden sm:inline" />
              <span className="b-strike-hl">attention problem.</span>
            </p>
            <div className="b-strike-rest">
              <div className="b-strike-lead">{lead}</div>
              {actions}
            </div>
          </div>
        </div>

        <img src="/b/bolt-white.svg" alt="" aria-hidden width={150} height={150} className="b-strike-bolt" />
        <span aria-hidden className="b-strike-flash" />
      </div>
    </section>
  );
}
