import { useId, useState } from "react";

const CURRENCIES = ["$", "€", "£", "AED "] as const;

function fmt(n: number, cur = "", digits = 0) {
  if (!Number.isFinite(n)) return "–";
  return cur + n.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

/**
 * Ad calculator: what an ad budget turns into (views, clicks, customers,
 * revenue) and what stronger hooks are worth at the same spend. Plain arithmetic with every
 * assumption editable, labelled as illustrative.
 */
export function GrowthCalc() {
  const id = useId();
  const [cur, setCur] = useState<(typeof CURRENCIES)[number]>("$");
  const [budget, setBudget] = useState(1500);
  const [aov, setAov] = useState(80);
  const [cpm, setCpm] = useState(8);
  const [ctr, setCtr] = useState(1);
  const [cr, setCr] = useState(2);
  const [lift, setLift] = useState(0.5);

  const views = cpm > 0 ? (budget / cpm) * 1000 : 0;
  const visitors = (views * ctr) / 100;
  const now = { customers: (visitors * cr) / 100 };
  const nowRev = now.customers * aov;
  const betterCustomers = ((views * (ctr + lift)) / 100) * (cr / 100);
  const betterRev = betterCustomers * aov;
  const maxRev = Math.max(nowRev, betterRev, 1);

  const num = (label: string, value: number, set: (v: number) => void, step: number, suffix = "", prefix = "") => (
    <label className="grid gap-1 text-sm font-semibold" htmlFor={`${id}-${label}`}>
      {label}
      <span className="d-field flex items-center gap-1">
        {prefix ? <span className="d-mono opacity-70">{prefix}</span> : null}
        <input
          id={`${id}-${label}`}
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={value}
          onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))}
          className="d-mono min-h-11 w-full bg-transparent py-2 text-lg outline-none"
        />
        {suffix ? <span className="d-mono opacity-70">{suffix}</span> : null}
      </span>
    </label>
  );

  return (
    <div className="d-card grid grid-cols-1 gap-12 p-8 sm:p-12 lg:grid-cols-12">
      <div className="grid content-start gap-6 lg:col-span-5">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Currency">
          {CURRENCIES.map((c) => (
            <button key={c} type="button" aria-pressed={cur === c} onClick={() => setCur(c)} className={`d-chip ${cur === c ? "is-on" : ""}`}>
              {c.trim()}
            </button>
          ))}
        </div>
        <label className="grid gap-2 text-sm font-semibold" htmlFor={`${id}-budget`}>
          <span className="flex items-baseline justify-between">
            Monthly ad budget <span className="d-mono text-2xl">{fmt(budget, cur)}</span>
          </span>
          <input id={`${id}-budget`} type="range" min={250} max={10000} step={250} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="d-range" />
        </label>
        <div className="grid grid-cols-2 gap-4 [&>label:last-child]:col-span-2">
          {num("Cost per 1,000 views", cpm, setCpm, 0.5, "", cur.trim())}
          {num("Click rate (hook)", ctr, setCtr, 0.1, "%")}
          {num("Clicks that buy", cr, setCr, 0.1, "%")}
          {num("Average sale", aov, setAov, 5, "", cur.trim())}
          {num("Better hooks add", lift, setLift, 0.1, "pts")}
        </div>
        <p className="text-sm text-[var(--d-muted)]">
          Illustrative maths, not a promise. Costs and click rates vary a lot by market and platform. In your free audit we
          replace these with your real numbers.
        </p>
      </div>

      <div className="grid content-start gap-6 lg:col-span-7" aria-live="polite">
        <div className="grid grid-cols-1 gap-4 border-b-2 border-[var(--d-ink)] pb-6 sm:grid-cols-3 [&>div]:flex [&>div]:items-baseline [&>div]:justify-between sm:[&>div]:block">
          <div>
            <p className="d-kicker">People reached</p>
            <p className="d-mono mt-1 text-2xl sm:text-3xl">{fmt(views)}</p>
          </div>
          <div>
            <p className="d-kicker">Customers</p>
            <p className="d-mono mt-1 text-2xl sm:text-3xl">{fmt(now.customers)}</p>
          </div>
          <div>
            <p className="d-kicker">Revenue</p>
            <p className="d-mono mt-1 text-2xl sm:text-3xl">{fmt(nowRev, cur)}</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[
            { label: `Today, ${fmt(ctr, "", 1)}% stop and click`, rev: nowRev, cust: now.customers, tone: "bg-[var(--d-moss)]" },
            { label: `Better hooks, ${fmt(ctr + lift, "", 1)}% stop and click`, rev: betterRev, cust: betterCustomers, tone: "bg-[var(--d-forest)]" },
          ].map((row) => (
            <div key={row.label} className="grid gap-2">
              <div className="flex items-baseline justify-between gap-4 text-sm font-semibold">
                <span>{row.label}</span>
                <span className="d-mono">
                  {fmt(row.cust)} customers · {fmt(row.rev, cur)}
                </span>
              </div>
              <div className="h-8 w-full bg-[var(--d-rule)]">
                <div className={`h-full ${row.tone} transition-[width] duration-500`} style={{ width: `${(row.rev / maxRev) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="d-display d-h3">
          Same budget. <span className="d-mark is-on">{fmt(betterRev - nowRev, cur)} more a month</span> just from hooks that make more
          people stop.
        </p>
        <p className="text-base">
          That’s why we test new hooks and creatives every month, and move the budget to whatever makes people stop.
        </p>
      </div>
    </div>
  );
}
