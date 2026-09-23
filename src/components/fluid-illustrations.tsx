/**
 * Service illustrations built as Apple-style interface mockups:
 * frosted glass panels, soft depth, precise typography. Pure DOM + CSS so they
 * stay crisp at any size and inherit the brand palette from design tokens.
 */

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[oklch(0.22_0.09_262)]">
      {/* soft light blooms for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-primary/50 blur-[90px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-primary/30 blur-[100px]"
      />
      <div className="relative h-full w-full p-5 sm:p-7">{children}</div>
    </div>
  );
}

function Glass({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/15 bg-white/10 shadow-xl shadow-black/25 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}

/** 01 — Content Strategy: a content calendar and a scheduled post card. */
export function ContentFlow({ className = "" }: { className?: string }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const slots = [
    { day: 0, label: "Reel", wide: true },
    { day: 1, label: "Carousel" },
    { day: 3, label: "Story" },
    { day: 4, label: "Reel", wide: true },
    { day: 5, label: "Post" },
  ];

  return (
    <div className={className} aria-label="Content calendar interface" role="img">
      <Panel>
        <div className="flex h-full flex-col gap-3">
          <Glass className="fluid-drift p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
                Content calendar
              </span>
              <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
                Week 12
              </span>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {days.map((d, i) => (
                <span
                  key={i}
                  className="text-center text-[10px] font-bold text-white/45"
                >
                  {d}
                </span>
              ))}
              {days.map((_, i) => {
                const slot = slots.find((s) => s.day === i);
                return (
                  <div
                    key={i}
                    className={`h-9 rounded-md ${
                      slot
                        ? slot.wide
                          ? "bg-primary"
                          : "bg-white/70"
                        : "bg-white/10"
                    }`}
                  />
                );
              })}
            </div>
          </Glass>

          <Glass className="fluid-drift flex flex-1 items-center gap-3 p-4" >
            <div className="h-full min-h-14 w-12 shrink-0 rounded-xl bg-gradient-to-b from-white/80 to-primary" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-2.5 w-3/4 rounded-full bg-white/80" />
              <div className="h-2 w-full rounded-full bg-white/30" />
              <div className="h-2 w-2/3 rounded-full bg-white/20" />
              <div className="flex gap-1.5 pt-1">
                {["Hook", "Story", "CTA"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/25 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/70"
                  >
                    {t}
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

/** 02 — Paid Advertising: a live campaign performance dashboard. */
export function GrowthFlow({ className = "" }: { className?: string }) {
  const bars = [38, 52, 44, 66, 58, 82, 95];

  return (
    <div className={className} aria-label="Campaign performance dashboard" role="img">
      <Panel>
        <div className="flex h-full flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { k: "ROAS", v: "4.8x" },
              { k: "CPA", v: "-32%" },
              { k: "Conv.", v: "1,204" },
            ].map((m) => (
              <Glass key={m.k} className="fluid-drift p-3">
                <span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-white/55">
                  {m.k}
                </span>
                <span className="mt-1 block text-lg font-extrabold leading-none text-white">
                  {m.v}
                </span>
              </Glass>
            ))}
          </div>

          <Glass className="fluid-drift flex flex-1 flex-col p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
                Ad spend return
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Live
              </span>
            </div>

            <div className="mt-auto flex h-24 items-end gap-2">
              {bars.map((h, i) => (
                <div key={i} className="flex-1">
                  <div
                    style={{ height: `${h}%` }}
                    className={`w-full rounded-t-md ${
                      i === bars.length - 1 ? "bg-primary" : "bg-white/35"
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 h-px w-full bg-white/20" />
          </Glass>
        </div>
      </Panel>
    </div>
  );
}
