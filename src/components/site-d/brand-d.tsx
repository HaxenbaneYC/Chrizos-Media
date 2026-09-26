import { useEffect, useRef, useState, type ReactNode } from "react";

import { useInView } from "@/components/site/primitives";

import { D_ICON_SVG, D_ICON_VIEWBOX, D_LOCKUP_SVG, D_LOCKUP_VIEWBOX } from "./logo-data";

/**
 * Option D: "The Growth Report". A modern financial newspaper: Newsprint,
 * deep Forest green and one Signal-lime highlighter. The logo is the word
 * chrizos marked with a highlighter stroke (Brand-Kit-D/source/logo.py).
 */
export const D = {
  forest: "#0D3B2E",
  forestDeep: "#08271E",
  print: "#F3EFE4",
  ink: "#111210",
  lime: "#D2F53C",
  moss: "#2E6B4F",
  rule: "#D8D2C2",
};

export const D_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Geist:wght@400..700&family=Geist+Mono:wght@400..600&display=swap";

type LogoTone = "print" | "forest";

const TONES: Record<LogoTone, Record<string, string>> = {
  // on Newsprint / white
  print: { "--logo-word": D.ink, "--logo-mark": D.lime, "--logo-media": D.forest, "--logo-inner": D.ink },
  // on Forest
  forest: { "--logo-word": D.print, "--logo-mark": D.lime, "--logo-media": D.lime, "--logo-inner": D.ink },
};

/** The Highlighter lockup, 1em tall. */
export function LogoD({ tone = "print", className = "" }: { tone?: LogoTone; className?: string }) {
  return (
    <svg
      viewBox={D_LOCKUP_VIEWBOX}
      className={`inline-block h-[1em] w-auto shrink-0 ${className}`}
      style={TONES[tone]}
      role="img"
      aria-label="Chrizos Media"
      dangerouslySetInnerHTML={{ __html: D_LOCKUP_SVG }}
    />
  );
}

/** The highlighted c, for small spaces. */
export function IconD({ tone = "print", className = "" }: { tone?: LogoTone; className?: string }) {
  return (
    <svg
      viewBox={D_ICON_VIEWBOX}
      className={className}
      style={TONES[tone]}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: D_ICON_SVG }}
    />
  );
}

/** Paints the page canvas Newsprint while an Option D page is mounted. */
export function usePrintCanvas() {
  useEffect(() => {
    const html = document.documentElement;
    const prev = [html.style.backgroundColor, document.body.style.backgroundColor];
    html.style.backgroundColor = D.print;
    document.body.style.backgroundColor = D.print;
    return () => {
      html.style.backgroundColor = prev[0] ?? "";
      document.body.style.backgroundColor = prev[1] ?? "";
    };
  }, []);
}

/** Text marked with the Signal highlighter, which sweeps in when it scrolls into view. */
export function Mark({ children }: { children: ReactNode }) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.6 });
  return (
    <span ref={ref} className={`d-mark ${inView ? "is-on" : ""}`}>
      {children}
    </span>
  );
}

/** A small rising line chart that draws itself in. Purely decorative. */
export function Sparkline({ points, className = "", label }: { points: number[]; className?: string; label?: string }) {
  const [ref, inView] = useInView<SVGSVGElement>({ threshold: 0.4 });
  const max = Math.max(...points);
  const min = Math.min(...points);
  const w = 200;
  const h = 64;
  const xy = points.map((p, i) => [(i / (points.length - 1)) * w, h - 6 - ((p - min) / (max - min || 1)) * (h - 12)] as const);
  const d = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
  const last = xy[xy.length - 1] ?? [w, 6];
  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${h}`} className={`d-spark ${inView ? "is-on" : ""} ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <path d={`${d}L${w} ${h}L0 ${h}Z`} className="d-spark-area" />
      <path d={d} pathLength={1} className="d-spark-line" />
      <circle cx={last[0]} cy={last[1]} r="4" className="d-spark-dot" />
    </svg>
  );
}

/** Market-style ticker band. Content is duplicated for a seamless loop and hidden from screen readers. */
export function Ticker({ items }: { items: { label: string; value: string }[] }) {
  const row = (copy: number) => (
    <span key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
      {items.map((it) => (
        <span key={it.label + copy} className="flex items-center gap-2 px-6">
          <span className="font-semibold">{it.label}</span>
          <span className="text-[var(--d-lime)]">▲</span>
          <span className="opacity-80">{it.value}</span>
        </span>
      ))}
    </span>
  );
  return (
    <div className="d-ticker d-mono overflow-hidden bg-[var(--d-forest)] py-3 text-sm text-[var(--d-print)]">
      <div className="d-ticker-track flex w-max">{[0, 1].map(row)}</div>
    </div>
  );
}

/** Image with a graceful placeholder if it fails to load. */
export function SafeImageD({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  if (failed) {
    return (
      <div role="img" aria-label={alt} className={`flex items-center justify-center bg-[var(--d-forest)] ${className}`}>
        <IconD tone="forest" className="h-20 w-20" />
      </div>
    );
  }
  return <img ref={ref} src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}
