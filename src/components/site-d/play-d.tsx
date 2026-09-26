import { useEffect, useId, useRef, type ReactNode } from "react";

import { useInView } from "@/components/site/primitives";

/**
 * Playful, decorative layer for Option D: marker scribbles, a rotating
 * stamp, a scroll-driven headline band and a score gauge. All of it is
 * aria-hidden decoration; content never depends on it.
 */

const SCRIBBLES = {
  // loose hand-drawn ellipse, drawn in one stroke with an overshoot
  circle: "M6 52 C 4 22, 60 6, 120 8 S 196 26, 194 52 S 150 94, 96 92 S 8 80, 10 48 C 12 30, 40 16, 70 12",
  // wobbly strike-through
  strike: "M2 20 C 40 14, 80 26, 120 18 S 180 14, 198 22",
  // quick double underline
  underline: "M4 20 C 50 12, 120 10, 196 14 M 20 30 C 70 24, 130 24, 180 26",
  // curved arrow pointing down-left to something
  arrow: "M190 8 C 150 10, 110 30, 96 70 M 96 70 L 82 52 M 96 70 L 114 58",
} as const;

/** Wraps inline text and draws a marker scribble around/under it when it comes into view. */
export function Scribble({ children, kind = "circle", className = "" }: { children: ReactNode; kind?: "circle" | "underline" | "strike"; className?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.8 });
  const box =
    kind === "circle"
      ? "absolute -inset-x-[6%] -inset-y-[18%]"
      : kind === "strike"
        ? "absolute -inset-x-[3%] top-[42%] h-[0.3em]"
        : "absolute inset-x-0 -bottom-[0.28em] h-[0.4em]";
  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {children}
      <svg aria-hidden viewBox={kind === "circle" ? "0 0 200 100" : kind === "strike" ? "0 0 200 36" : "0 0 200 36"} preserveAspectRatio="none" className={`d-scribble pointer-events-none ${box} ${inView ? "is-on" : ""}`}>
        <path d={SCRIBBLES[kind]} pathLength={1} />
      </svg>
    </span>
  );
}

/** A hand-drawn arrow with a short handwritten-style note, for pointing at a CTA. */
export function ArrowNote({ note, className = "" }: { note: string; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.6 });
  return (
    <div ref={ref} aria-hidden className={`pointer-events-none flex items-end gap-1 ${className}`}>
      <svg viewBox="0 0 200 80" className={`d-scribble h-12 w-28 ${inView ? "is-on" : ""}`}>
        <path d={SCRIBBLES.arrow} pathLength={1} />
      </svg>
      <span className={`d-note ${inView ? "is-on" : ""}`}>{note}</span>
    </div>
  );
}

/** Rotating circular stamp, like a sticker on a newspaper front page. */
export function Stamp({ text, className = "" }: { text: string; className?: string }) {
  const id = `stamp${useId().replace(/:/g, "")}`;
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={`d-stamp ${className}`}>
      <circle cx="60" cy="60" r="58" className="d-stamp-bg" />
      <defs>
        <path id={id} d="M60 60 m -42 0 a 42 42 0 1 1 84 0 a 42 42 0 1 1 -84 0" />
      </defs>
      <g className="d-stamp-spin">
        <text className="d-stamp-text">
          <textPath href={`#${id}`} startOffset="0" textLength="258">
            {text}
          </textPath>
        </text>
      </g>
      <path d="M60 36 L78 68 L42 68 Z" className="d-stamp-tri" />
    </svg>
  );
}

/** Two giant headline lines that slide in opposite directions as the page scrolls. */
export function SlideBand({ top, bottom }: { top: string; bottom: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const t = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      el.style.setProperty("--t", Math.min(1, Math.max(0, t)).toFixed(3));
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
  const line = (text: string) => Array.from({ length: 4 }, () => text).join("\u00a0\u00a0");
  return (
    <div ref={ref} aria-hidden className="d-band overflow-hidden py-10 sm:py-14" style={{ ["--t" as string]: "0.5" }}>
      <p className="d-band-row d-band-a d-display whitespace-nowrap">{line(top)}</p>
      <p className="d-band-row d-band-b d-display whitespace-nowrap">
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i}>
            <span className="d-mark is-on">{bottom}</span>
            {"\u00a0\u00a0"}
          </span>
        ))}
      </p>
    </div>
  );
}

/** Half-circle gauge whose needle swings to the score (0 to 100). */
export function Gauge({ score }: { score: number }) {
  const [ref, inView] = useInView<SVGSVGElement>({ threshold: 0.4 });
  const angle = -90 + (Math.max(0, Math.min(100, score)) / 100) * 180;
  return (
    <svg ref={ref} viewBox="0 0 200 116" className="d-gauge w-full max-w-xs" role="img" aria-label={`Score ${score} out of 100`}>
      <path d="M20 100 A80 80 0 0 1 180 100" className="d-gauge-track" />
      <path d="M20 100 A80 80 0 0 1 180 100" pathLength={100} className="d-gauge-fill" style={{ strokeDashoffset: inView ? 100 - score : 100 }} />
      {[0, 25, 50, 75, 100].map((v) => {
        const a = ((-90 + v * 1.8) * Math.PI) / 180;
        return <line key={v} x1={100 + Math.sin(a) * 66} y1={100 - Math.cos(a) * 66} x2={100 + Math.sin(a) * 58} y2={100 - Math.cos(a) * 58} className="d-gauge-tick" />;
      })}
      <g className="d-gauge-needle" style={{ transform: `rotate(${inView ? angle : -90}deg)` }}>
        <line x1="100" y1="100" x2="100" y2="34" />
        <circle cx="100" cy="100" r="7" />
      </g>
    </svg>
  );
}
