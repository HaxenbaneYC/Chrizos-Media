import type { ReactNode } from "react";

/**
 * Service and funnel illustrations built as Apple-style interface mockups:
 * frosted panels, precise information hierarchy, and clean line/UI details.
 */
function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-card">
      <div className="relative h-full w-full p-5 sm:p-7">{children}</div>
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
  return (
    <div
      className={`rounded-2xl border border-foreground/15 bg-foreground/10 shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}

const faintLine = "h-2 rounded-full bg-foreground/20";
const strongLine = "h-2.5 rounded-full bg-foreground/80";

/** 01 — Paid Advertising: a live campaign performance dashboard. */
export function GrowthFlow({ className = "" }: { className?: string }) {
  const bars = ["h-[38%]", "h-[52%]", "h-[44%]", "h-[66%]", "h-[58%]", "h-[82%]", "h-[95%]"];

  return (
    <div className={className} aria-label="Campaign performance dashboard" role="img">
      <Panel>
        <div className="flex h-full flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { k: "ROAS", v: "4.8x" },
              { k: "CPA", v: "-32%" },
              { k: "Leads", v: "+61%" },
            ].map((m) => (
              <Glass key={m.k} className="fluid-drift p-3">
                <span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/55">
                  {m.k}
                </span>
                <span className="mt-1 block text-lg font-extrabold leading-none text-foreground">
                  {m.v}
                </span>
              </Glass>
            ))}
          </div>

          <Glass className="fluid-drift flex flex-1 flex-col p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/70">
                Campaign return
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/80">
                <span className="h-1.5 w-1.5 rounded-full bg-background" />
                Live
              </span>
            </div>

            <div className="mt-5 flex flex-1 items-end gap-2">
              {bars.map((heightClass, index) => (
                <div
                  key={heightClass}
                  className={`min-h-4 flex-1 rounded-t-md ${heightClass} ${
                    index === bars.length - 1 ? "bg-background" : "bg-foreground/35"
                  }`}
                />
              ))}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                "Spend",
                "Revenue",
                "Scale",
              ].map((label) => (
                <span key={label} className="rounded-full bg-foreground/10 px-2 py-1 text-center text-[9px] font-bold uppercase tracking-wider text-foreground/70">
                  {label}
                </span>
              ))}
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
    <div className={className} aria-label="Content calendar interface" role="img">
      <Panel>
        <div className="flex h-full flex-col gap-3">
          <Glass className="fluid-drift p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/70">
                Content calendar
              </span>
              <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
                Week 12
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
              <div className={`${strongLine} w-3/4`} />
              <div className={`${faintLine} w-full`} />
              <div className={`${faintLine} w-2/3`} />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Hook", "Story", "CTA"].map((tag) => (
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
    <div className={className} aria-label="Brand strategy and market insights workspace" role="img">
      <Panel>
        <div className="grid h-full grid-cols-[0.9fr_1.1fr] gap-3">
          <Glass className="fluid-drift flex flex-col gap-3 p-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/70">
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
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/70">
                  Positioning
                </span>
                <span className="rounded-full bg-background px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-foreground">
                  Focus
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <div className={`${strongLine} w-11/12`} />
                <div className={`${faintLine} w-full`} />
                <div className={`${faintLine} w-3/5`} />
              </div>
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

export function ProblemFlow({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-label="Marketing funnel problem map" role="img">
      <Panel>
        <div className="flex h-full flex-col justify-between gap-3">
          {[
            { label: "Attention", width: "w-full" },
            { label: "Trust", width: "w-4/5" },
            { label: "Enquiries", width: "w-3/5" },
            { label: "Revenue", width: "w-2/5" },
          ].map((step, index) => (
            <Glass key={step.label} className={`fluid-drift ${step.width} p-3`}>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/75">
                  {step.label}
                </span>
                <span className={`h-2.5 w-2.5 rounded-full ${index === 3 ? "bg-background" : "bg-foreground/35"}`} />
              </div>
            </Glass>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function ProofFlow({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-label="Social proof dashboard" role="img">
      <Panel>
        <div className="flex h-full flex-col gap-3">
          <Glass className="fluid-drift p-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/70">
              Results board
            </span>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["Reach", "Leads", "Sales"].map((item, index) => (
                <div key={item} className="rounded-xl bg-foreground/10 p-3 text-center">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-foreground/55">
                    {item}
                  </span>
                  <span className="mt-1 block text-base font-extrabold text-foreground">
                    {index === 0 ? "+" : "↑"}
                  </span>
                </div>
              ))}
            </div>
          </Glass>

          <Glass className="fluid-drift flex flex-1 items-center gap-4 p-4">
            <div className="flex -space-x-2">
              {[0, 1, 2].map((item) => (
                <span key={item} className="h-10 w-10 rounded-full border border-foreground/20 bg-foreground/20" />
              ))}
            </div>
            <div className="flex-1 space-y-2">
              <div className={`${strongLine} w-4/5`} />
              <div className={`${faintLine} w-full`} />
              <div className={`${faintLine} w-2/3`} />
            </div>
          </Glass>
        </div>
      </Panel>
    </div>
  );
}

/** Booking widget placeholder: calendar grid plus time slots, styled like the rest of the site. */
export function BookingFlow({ className = "" }: { className?: string }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const dates = Array.from({ length: 28 }, (_, i) => i + 1);
  const active = [9, 11, 16, 18, 23];
  const slots = ["09:30", "11:00", "13:30", "15:00", "16:30", "18:00"];

  return (
    <div className={className} aria-label="Calendar booking widget placeholder" role="img">
      <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/70">
            Select a time
          </span>
          <span className="rounded-full border border-border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-foreground/55">
            Placeholder
          </span>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-[1.3fr_0.7fr]">
          <Glass className="p-4">
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {days.map((d, i) => (
                <span
                  key={`${d}-${i}`}
                  className="text-[9px] font-bold uppercase tracking-[0.1em] text-foreground/45"
                >
                  {d}
                </span>
              ))}
              {dates.map((n) => (
                <span
                  key={n}
                  className={`flex aspect-square items-center justify-center rounded-lg text-[10px] font-bold ${
                    active.includes(n)
                      ? "bg-foreground/80 text-background"
                      : "text-foreground/45"
                  }`}
                >
                  {n}
                </span>
              ))}
            </div>
          </Glass>

          <div className="grid content-start gap-2">
            {slots.map((s) => (
              <span
                key={s}
                className="rounded-xl border border-border px-3 py-2.5 text-center text-[11px] font-bold tracking-[0.1em] text-foreground/70"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <span className={`${strongLine} w-24`} />
          <span className={`${faintLine} w-16`} />
        </div>
      </div>
    </div>
  );
}
