import type { CSSProperties } from "react";

import { useScrollProgress } from "./scroll-d";

/**
 * Option D infographics. Each draws itself in once when scrolled into view
 * and shows its final state for reduced-motion users (see .d-ig in styles).
 */

const v = (vars: Record<string, number | string>) => vars as CSSProperties;

/** Ads: views narrowing into clicks and customers. */
export function AdsFunnel() {
  const ref = useScrollProgress<SVGSVGElement>();
  const rows = [
    { label: "People who see your ad", value: "187,500", w: 100 },
    { label: "Stop and click", value: "1,875", w: 62 },
    { label: "Become customers", value: "38", w: 30 },
  ];
  return (
    <svg ref={ref} viewBox="0 0 420 190" className={`d-ig w-full`} role="img" aria-label="Ad funnel: views become clicks, clicks become customers">
      {rows.map((r, i) => {
        const w = (r.w / 100) * 400;
        return (
          <g key={r.label} transform={`translate(${(420 - w) / 2} ${i * 62})`}>
            <rect width={w} height="50" className={`d-ig-grow ${i === 2 ? "fill-[var(--d-forest)]" : "fill-[var(--d-ink)]"}`} style={v({ "--i": i })} />
            <text x={w / 2} y="22" textAnchor="middle" className="d-ig-num fill-[var(--d-hi)]">
              {r.value}
            </text>
            <text x={w / 2} y="40" textAnchor="middle" className="d-ig-label fill-[var(--d-print)]">
              {r.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Content: a month calendar filling up with planned posts. */
export function ContentCalendar() {
  const ref = useScrollProgress<SVGSVGElement>();
  const order = [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26];
  const posts = new Set(order);
  const launch = 17;
  return (
    <svg ref={ref} viewBox="0 0 280 150" className={`d-ig w-full`} role="img" aria-label="A month of content planned: three posts a week and a launch">
      {Array.from({ length: 28 }, (_, i) => {
        const x = (i % 7) * 40;
        const y = Math.floor(i / 7) * 38;
        const isPost = posts.has(i);
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <rect width="34" height="32" rx="3" className="fill-none stroke-[var(--d-ink)]" strokeWidth="1.5" />
            {isPost ? (
              <rect
                x="4"
                y="4"
                width="26"
                height="24"
                rx="2"
                className={`d-ig-pop ${i === launch ? "fill-[var(--d-forest)]" : "fill-[var(--d-lime)]"}`}
                style={v({ "--i": order.indexOf(i) })}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/** SEO: your listing climbing to the top of the results. */
export function SearchRank() {
  const ref = useScrollProgress<SVGSVGElement>();
  return (
    <svg ref={ref} viewBox="0 0 280 150" className={`d-ig w-full`} role="img" aria-label="Your business moving to the first search result">
      <rect x="0" y="0" width="280" height="26" rx="13" className="fill-none stroke-[var(--d-ink)]" strokeWidth="1.5" />
      <circle cx="16" cy="13" r="5" className="fill-none stroke-[var(--d-ink)]" strokeWidth="1.5" />
      <text x="30" y="17" className="d-ig-label fill-[var(--d-ink)]">
        what you sell near me
      </text>
      {[1, 2].map((i) => (
        <g key={i} transform={`translate(0 ${40 + i * 36})`}>
          <rect width="200" height="8" rx="2" className="fill-[var(--d-rule)]" />
          <rect y="14" width="140" height="6" rx="2" className="fill-[var(--d-rule)]" />
        </g>
      ))}
      <g className="d-ig-climb">
        <rect x="-4" y="-6" width="288" height="34" rx="3" className="fill-[var(--d-lime)] stroke-[var(--d-ink)]" strokeWidth="1.5" />
        <rect x="6" y="2" width="170" height="8" rx="2" className="fill-[var(--d-on-lime)]" />
        <rect x="6" y="16" width="110" height="6" rx="2" className="fill-[var(--d-on-lime)] opacity-60" />
        <text x="270" y="16" textAnchor="end" className="d-ig-num fill-[var(--d-on-lime)]">
          #1
        </text>
      </g>
    </svg>
  );
}

/** Brand: a positioning map, you in the corner nobody owns. */
export function BrandMap() {
  const ref = useScrollProgress<SVGSVGElement>();
  const others = [
    [60, 50],
    [90, 95],
    [150, 110],
    [70, 120],
  ];
  return (
    <svg ref={ref} viewBox="0 0 280 150" className={`d-ig w-full`} role="img" aria-label="Positioning map with your brand in its own corner">
      <line x1="10" y1="140" x2="270" y2="140" className="stroke-[var(--d-ink)]" strokeWidth="1.5" />
      <line x1="10" y1="140" x2="10" y2="6" className="stroke-[var(--d-ink)]" strokeWidth="1.5" />
      <text x="268" y="132" textAnchor="end" className="d-ig-label fill-[var(--d-muted)]">
        clear offer →
      </text>
      <text x="16" y="16" className="d-ig-label fill-[var(--d-muted)]">
        ↑ memorable
      </text>
      {others.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="8" className="fill-[var(--d-rule)] stroke-[var(--d-ink)]" strokeWidth="1" />
      ))}
      <g className="d-ig-move">
        <circle cx="228" cy="34" r="14" className="fill-[var(--d-lime)] stroke-[var(--d-ink)]" strokeWidth="2" />
        <text x="228" y="38" textAnchor="middle" className="d-ig-num fill-[var(--d-on-lime)]" style={{ fontSize: 11 }}>
          you
        </text>
      </g>
    </svg>
  );
}

/** A real timeline: evenly spaced stops on one line (vertical on phones). */
export function ResultsTimeline() {
  const ref = useScrollProgress<HTMLOListElement>();
  const stops = [
    { when: "Week 1", what: "Audit and plan", detail: "Your written plan within 48 hours." },
    { when: "Weeks 2–3", what: "Brand", detail: "Clear positioning and message." },
    { when: "Weeks 2–4", what: "Ads", detail: "First customers from paid ads." },
    { when: "Weeks 4–6", what: "Content", detail: "Posts people stop for, every week." },
    { when: "Months 2–3", what: "SEO", detail: "Showing up on Google." },
  ];
  return (
    <ol ref={ref} className="d-ig d-timeline relative grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-6">
      <span aria-hidden className="d-timeline-rail" />
      {stops.map((st, i) => (
        <li key={st.when} className="d-timeline-stop relative grid content-start gap-2 pl-10 md:pl-0" style={v({ "--i": i })}>
          <p className="d-mono text-sm font-semibold md:order-1">{st.when}</p>
          <span
            aria-hidden
            className={`d-timeline-dot md:order-2 ${i === 2 ? "is-key" : ""}`}
          />
          <p className="text-lg font-semibold md:order-3 md:mt-2">{st.what}</p>
          <p className="text-base text-[var(--d-muted)] md:order-4">{st.detail}</p>
        </li>
      ))}
    </ol>
  );
}

/** Five seats, some taken: the 5-client limit at a glance. */
export function Seats({ open, size = "lg" }: { open: number; size?: "sm" | "lg" }) {
  const total = 5;
  const dim = size === "lg" ? "h-14 w-14" : "h-4 w-4";
  return (
    <div className="flex items-center gap-2" role="img" aria-label={`${total - open} of ${total} client spots taken, ${open} open`}>
      {Array.from({ length: total }, (_, i) => {
        const taken = i < total - open;
        return (
          <span
            key={i}
            className={`${dim} shrink-0 rounded-full border-2 ${
              taken ? "border-[var(--d-ink)] bg-[var(--d-ink)]" : "border-[var(--d-ink)] bg-[var(--d-lime)]"
            }`}
          />
        );
      })}
    </div>
  );
}

/** Glaucia: spend flat, revenue climbing, crossing at month 3. */
export function BreakEvenChart() {
  const ref = useScrollProgress<SVGSVGElement>();
  const W = 460;
  const H = 230;
  const x = (m: number) => 40 + (m / 5) * (W - 60);
  const y = (v: number) => H - 30 - v * (H - 60);
  const revenue = [0, 0.12, 0.3, 0.55, 0.8, 1];
  const rev = revenue.map((v, m) => `${m ? "L" : "M"}${x(m).toFixed(1)} ${y(v).toFixed(1)}`).join("");
  const spendY = y(0.55);
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className={`d-ig w-full`} role="img" aria-label="Glaucia: revenue passed monthly spend in month 3">
      {[0, 1, 2, 3, 4, 5].map((m) => (
        <text key={m} x={x(m)} y={H - 8} textAnchor="middle" className="d-ig-label fill-[var(--d-muted)]">
          {m === 0 ? "Launch" : `M${m}`}
        </text>
      ))}
      <line x1={x(0)} y1={H - 30} x2={x(5)} y2={H - 30} className="stroke-[var(--d-rule)]" strokeWidth="1.5" />
      <line x1={x(0)} y1={spendY} x2={x(5)} y2={spendY} className="stroke-[var(--d-print)]" strokeWidth="2" strokeDasharray="6 6" />
      <text x={x(5)} y={spendY - 8} textAnchor="end" className="d-ig-label fill-[var(--d-print)]">
        Monthly spend
      </text>
      <path d={rev} pathLength={1} className="d-ig-line fill-none stroke-[var(--d-lime)]" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <text x={x(4.1)} y={y(0.92)} textAnchor="end" className="d-ig-label fill-[var(--d-lime)]">
        Revenue
      </text>
      <g className="d-ig-end">
        <circle cx={x(3)} cy={spendY} r="9" className="fill-[var(--d-lime)] stroke-[var(--d-ink)]" strokeWidth="2" />
        <text x={x(3)} y={spendY + 30} textAnchor="middle" className="d-ig-num fill-[var(--d-lime)]">
          Break-even
        </text>
      </g>
    </svg>
  );
}
