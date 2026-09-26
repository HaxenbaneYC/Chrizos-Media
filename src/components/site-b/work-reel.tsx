import { useEffect, useRef, useState, type ReactNode } from "react";

import { reducedMotion } from "./motion-b";

/**
 * The work reel: case-study panels in one long row that slides sideways as
 * the reader scrolls down. The section is made exactly as tall as the row
 * is wide, so the slide ends as the section does. Reduced motion (or no
 * JavaScript) gets an ordinary swipeable row.
 */
export function WorkReel({ label, children }: { label: string; children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || reducedMotion()) return;
    setPinned(true);
    let frame = 0;
    let run = 0;
    const measure = () => {
      run = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${run + window.innerHeight}px`;
      update();
    };
    const update = () => {
      frame = 0;
      const top = section.getBoundingClientRect().top;
      const x = Math.min(run, Math.max(0, -top));
      track.style.transform = `translate3d(${-x}px,0,0)`;
      section.style.setProperty("--p", run ? (x / run).toFixed(4) : "0");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      section.style.height = "";
      track.style.transform = "";
    };
  }, []);

  return (
    <section ref={sectionRef} id="results" aria-label={label} className={`b-reel scroll-mt-16 ${pinned ? "is-pinned" : ""}`}>
      <div className="b-reel-stage">
        <div ref={trackRef} className="b-reel-track">
          {children}
        </div>
        <span aria-hidden className="b-reel-progress" />
      </div>
    </section>
  );
}

/** One panel in the reel. `tone` picks the brand colour behind it. */
export function ReelPanel({ tone = "navy", wide = false, children }: { tone?: "navy" | "blue" | "white"; wide?: boolean; children: ReactNode }) {
  return <div className={`b-panel b-panel-${tone} ${wide ? "is-wide" : ""}`}>{children}</div>;
}
