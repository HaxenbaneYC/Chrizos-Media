import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Service and funnel illustrations built as Apple-style interface mockups:
 * frosted glass panels, precise information hierarchy, and clean line/UI details.
 */
function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-card">
      <div className="relative h-full w-full p-4 sm:p-7">{children}</div>
    </div>
  );
}

function Glass({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`graphic-glass ${className}`}>{children}</div>;
}

/** 01 — Paid Advertising: a live campaign performance dashboard. */
export function GrowthFlow({ className = "" }: { className?: string }) {
  const bars = [
    { height: "38%", value: "Example 1.6x" },
    { height: "52%", value: "Example 2.2x" },
    { height: "44%", value: "Example 1.9x" },
    { height: "66%", value: "Example 2.9x" },
    { height: "58%", value: "Example 2.5x" },
    { height: "82%", value: "Target 3.7x" },
    { height: "95%", value: "Target 4.8x" },
  ];

  const chartRef = useRef<HTMLDivElement>(null);
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setGrown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={className} aria-label="Illustrative paid advertising dashboard showing target returns, customer costs, weekly lead reporting, and a rising campaign return chart" role="img">
      <Panel>
        <div className="flex h-full flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { k: "Ad return", v: "$3–$5 back per $1" },
              { k: "Customer cost", v: "Lower by design" },
              { k: "Leads", v: "Weekly reports" },
            ].map((m) => (
              <Glass key={m.k} className="fluid-drift lift min-w-0 p-3">
                <span className="graphic-kicker block">
                  {m.k}
                </span>
                <span className="mt-1.5 block text-[clamp(0.62rem,2.5vw,0.9rem)] font-extrabold leading-tight text-foreground">
                  {m.v}
                </span>
              </Glass>
            ))}
          </div>

          <Glass className="fluid-drift flex flex-1 flex-col p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="graphic-headline max-w-[75%]">
                Example target: $3–$5 back per $1 spent
              </span>
              <span className="flex shrink-0 items-center gap-1.5 text-[9px] font-bold uppercase text-foreground/80">
                <span className="h-1.5 w-1.5 rounded-full bg-background" />
                Illustrative
              </span>
            </div>

            <div ref={chartRef} className="mt-5 flex flex-1 items-end gap-2">
              {bars.map((bar, index) => {
                const isLast = index === bars.length - 1;
                return (
                  <div
                    key={bar.value + index}
                    className="bar-col group relative flex h-full min-w-1.5 flex-1 items-end"
                  >
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-1.5 py-0.5 text-[8px] font-extrabold text-primary-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {bar.value}
                    </span>
                    <div
                      className={`bar-grow ${grown ? "is-grown" : ""} min-h-4 w-full rounded-t-md ${
                        isLast ? `bg-background ${grown ? "bar-glow" : ""}` : "bg-foreground/35"
                      }`}
                      style={{
                        height: bar.height,
                        transitionDelay: `${index * 80}ms`,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-3 rounded-lg bg-foreground/10 px-3 py-2 text-[9px] font-bold leading-4 text-foreground/80">
              Sales tracking from day one. Leads reported every week.
            </div>
          </Glass>
        </div>
      </Panel>
    </div>
  );
}


/** 02 — Content Strategy: a content calendar and scheduled post card. */
export function ContentFlow({ className = "" }: { className?: string }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const slots = [
    { day: 0, active: true },
    { day: 1, active: false },
    { day: 3, active: false },
    { day: 4, active: true },
    { day: 5, active: false },
  ];

  return (
    <div className={className} aria-label="Content strategy calendar showing a weekly plan for attention-grabbing openings, stories, and clear next steps" role="img">
      <Panel>
        <div className="flex h-full flex-col gap-3">
          <Glass className="fluid-drift p-4">
            <div className="flex items-center justify-between">
              <span className="graphic-headline">
                Content calendar
              </span>
              <span className="rounded-full bg-foreground px-2.5 py-1 text-[9px] font-bold uppercase text-primary-foreground">
                Monthly plan
              </span>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {days.map((day, index) => (
                <span
                  key={`${day}-${index}`}
                  className="text-center text-[10px] font-bold text-foreground/45"
                >
                  {day}
                </span>
              ))}
              {days.map((_, index) => {
                const slot = slots.find((item) => item.day === index);
                return (
                  <div
                    key={index}
                    className={`h-9 rounded-md ${
                      slot ? (slot.active ? "bg-background" : "bg-foreground/70") : "bg-foreground/10"
                    }`}
                  />
                );
              })}
            </div>
          </Glass>

          <Glass className="fluid-drift flex flex-1 items-center gap-3 p-4">
            <div className="h-full min-h-14 w-12 shrink-0 rounded-xl bg-foreground/80" />
            <div className="min-w-0 flex-1 space-y-2">
              <p className="graphic-headline">Structured weekly cadence</p>
              <p className="text-[9px] font-semibold leading-4 text-foreground/70">
                Opening idea, story, and next step, planned a month at a time.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Opening", "Story", "Next step"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-foreground/25 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-foreground/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Glass>
        </div>
      </Panel>
    </div>
  );
}

/** 03 — Brand Strategy & Market Insights: research, positioning and action plan. */
export function StrategyFlow({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-label="Brand strategy workspace showing a competitor market map and audience, offer, and message research priorities" role="img">
      <Panel>
        <div className="grid h-full grid-cols-[0.9fr_1.1fr] gap-3">
          <Glass className="fluid-drift flex flex-col gap-3 p-4">
            <span className="graphic-headline">
              Market map
            </span>
            <div className="relative flex-1 rounded-xl border border-foreground/15 bg-foreground/10">
              <div className="absolute left-1/2 top-3 h-[calc(100%-1.5rem)] w-px bg-foreground/15" />
              <div className="absolute left-3 top-1/2 h-px w-[calc(100%-1.5rem)] bg-foreground/15" />
              {[
                "left-5 top-6 bg-foreground/35",
                "right-6 top-10 bg-background",
                "bottom-7 left-8 bg-foreground/55",
                "bottom-5 right-8 bg-foreground/25",
              ].map((dot) => (
                <span key={dot} className={`absolute h-3 w-3 rounded-full ${dot}`} />
              ))}
            </div>
          </Glass>

          <div className="flex flex-col gap-3">
            <Glass className="fluid-drift p-4">
              <div className="flex items-center justify-between">
                <span className="graphic-headline">
                  Research first
                </span>
                <span className="rounded-full bg-background px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-foreground">
                  Focus
                </span>
              </div>
              <p className="mt-3 text-[9px] font-semibold leading-4 text-foreground/70">
                Real competitor and audience research before a single ad runs.
              </p>
            </Glass>

            <Glass className="fluid-drift flex flex-1 flex-col justify-center gap-2 p-4">
              {["Audience", "Offer", "Message"].map((item, index) => (
                <div key={item} className="flex items-center gap-2">
                  <span className={`h-6 w-6 rounded-full ${index === 0 ? "bg-background" : "bg-foreground/20"}`} />
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-foreground/75">
                    {item}
                  </span>
                </div>
              ))}
            </Glass>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function SeoIcon({ type }: { type: "audit" | "keyword" | "content" }) {
  if (type === "audit") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-10 w-10">
        <rect x="6" y="9" width="27" height="22" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M6 15h27M11 12h.1M15 12h.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="31" cy="30" r="8" stroke="currentColor" strokeWidth="2.5" />
        <path d="m37 36 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "keyword") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-10 w-10">
        <path d="M11 5h19l8 8v30H11V5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M30 5v9h8M17 21h14M17 27h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="30" cy="31" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="30" cy="31" r="1.5" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-10 w-10">
      <path d="M9 6h24l6 6v30H9V6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M33 6v7h6M15 33l13-13 4 4-13 13-6 2 2-6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m29 35 5-5 4 4 5-7M39 27h4v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 04 — SEO: three core workstreams and illustrative keyword movement. */
export function SearchFlow({ className = "" }: { className?: string }) {
  const workstreams = [
    { type: "audit" as const, title: "Technical Audit", detail: "Speed, indexing, and site structure." },
    { type: "keyword" as const, title: "Keyword Strategy", detail: "Pages matched to what customers search for." },
    { type: "content" as const, title: "Content That Ranks", detail: "Useful pages designed to earn visibility." },
  ];
  const rankingRows = [
    { keyword: "Service keyword", position: "18 → 9" },
    { keyword: "Local search", position: "24 → 12" },
    { keyword: "Buyer question", position: "31 → 16" },
  ];

  return (
    <div
      className={className}
      aria-label="SEO service illustration with Technical Audit, Keyword Strategy, and Content That Ranks glass tiles above an illustrative Keyword Rankings widget"
      role="img"
    >
      <div className="relative h-full w-full overflow-hidden bg-card">
        <div className="flex h-full flex-col gap-3 p-5 sm:p-7">
          <div className="grid flex-[1.35] grid-cols-3 gap-1.5 sm:gap-2">
            {workstreams.map((item) => (
              <div key={item.title} className="seo-icon-card fluid-drift flex min-w-0 flex-col items-center justify-center p-2 text-center sm:p-3">
                <div className="seo-icon-tile flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-foreground sm:h-16 sm:w-16 sm:rounded-2xl">
                  <SeoIcon type={item.type} />
                </div>
                <span className="mt-2.5 text-[10px] font-extrabold leading-tight text-foreground">{item.title}</span>
                <span className="mt-1 text-[8px] font-semibold leading-3 text-foreground/65">{item.detail}</span>
              </div>
            ))}
          </div>

          <Glass className="fluid-drift flex flex-1 flex-col p-4">
            <span className="graphic-headline">Keyword Rankings</span>
            <div className="mt-3 grid gap-2">
              {rankingRows.map((row) => (
                <div key={row.keyword} className="flex items-center justify-between gap-3 rounded-lg bg-foreground/10 px-3 py-2">
                  <span className="truncate text-[9px] font-bold text-foreground/75">{row.keyword}</span>
                  <span className="shrink-0 text-[9px] font-extrabold text-foreground">↑ {row.position}</span>
                </div>
              ))}
            </div>
          </Glass>
        </div>
      </div>
    </div>
  );
}

export function ProblemFlow({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-label="Marketing funnel diagram connecting attention, trust, enquiries, and revenue goals" role="img">
      <Panel>
        <div className="flex h-full flex-col justify-center gap-4">
          {[
            { label: "Attention", goal: "Built for measurable reach growth", width: "w-full" },
            { label: "Trust", goal: "Designed to lift engagement", width: "w-[92%]" },
            { label: "Enquiries", goal: "Focused on qualified leads, not just clicks", width: "w-[84%]" },
            { label: "Revenue", goal: "Every campaign tied to a revenue target", width: "w-[76%]" },
          ].map((step, index) => (
            <Glass key={step.label} className={`fluid-drift ${step.width} p-4`}>
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${index === 3 ? "bg-background" : "bg-foreground/35"}`} />
                <div className="min-w-0">
                  <span className="graphic-kicker block">{step.label}</span>
                  <span className="mt-1.5 block text-[clamp(0.58rem,2.2vw,0.72rem)] font-extrabold leading-snug text-foreground">
                    {step.goal}
                  </span>
                </div>
              </div>
            </Glass>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function ProofFlow({ className = "" }: { className?: string }) {
  const milestones = [
    { label: "Launch", detail: "Campaign live", featured: false },
    { label: "Month 2", detail: "Learning and refining", featured: false },
    { label: "Break-even", detail: "Month 3", featured: true },
  ];

  return (
    <div
      className={className}
      aria-label="Three-month campaign timeline from launch to break-even in month three for a single-product brand"
      role="img"
    >
      <Panel>
        <div className="flex h-full items-center">
          <Glass className="fluid-drift w-full p-5 sm:p-6">
            <span className="graphic-kicker block">Campaign milestone</span>
            <p className="mt-2 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              Break-even in 3 months
            </p>

            <div className="relative mt-8 grid grid-cols-3 gap-2 sm:gap-4">
              <div aria-hidden className="absolute left-[16.67%] right-[16.67%] top-5 h-px bg-foreground/25" />
              {milestones.map((milestone) => (
                <div key={milestone.label} className="relative flex min-w-0 flex-col items-center text-center">
                  <div
                    className={
                      milestone.featured
                        ? "seo-icon-tile relative z-10 flex h-11 w-11 items-center justify-center rounded-xl"
                        : "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 bg-card"
                    }
                  >
                    <span className={`rounded-full ${milestone.featured ? "h-3 w-3 bg-foreground" : "h-2.5 w-2.5 bg-foreground/55"}`} />
                  </div>
                  <span className="mt-3 text-[10px] font-extrabold leading-tight text-foreground sm:text-xs">
                    {milestone.label}
                  </span>
                  <span className="mt-1 text-[8px] font-semibold leading-3 text-foreground/60 sm:text-[9px]">
                    {milestone.detail}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-7 border-t border-foreground/15 pt-4 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/65">
              Single-product brand, first campaign
            </p>
          </Glass>
        </div>
      </Panel>
    </div>
  );
}

