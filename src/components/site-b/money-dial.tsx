import { useId, useState } from "react";

const CURRENCIES = ["$", "€", "£", "AED "] as const;
const HOOKS = [
  { label: "Same hooks", lift: 0 },
  { label: "Better hooks", lift: 0.5 },
  { label: "Much better hooks", lift: 1 },
];

const money = (n: number, cur: string) => (Number.isFinite(n) ? cur + Math.round(n).toLocaleString("en-US") : "–");

/**
 * The money dial: one big budget dial and a hook switch. The page answers
 * with two giant numbers, today and with better hooks, and the difference in
 * the highlight. The assumptions sit behind "Change the maths".
 */
export function MoneyDial() {
  const id = useId();
  const [cur, setCur] = useState<(typeof CURRENCIES)[number]>("$");
  const [budget, setBudget] = useState(1500);
  const [hook, setHook] = useState(1);
  const [cpm, setCpm] = useState(8);
  const [ctr, setCtr] = useState(1);
  const [cr, setCr] = useState(2);
  const [aov, setAov] = useState(80);

  const views = cpm > 0 ? (budget / cpm) * 1000 : 0;
  const customers = (lift: number) => ((views * (ctr + lift)) / 100) * (cr / 100);
  const now = customers(0);
  const better = customers(HOOKS[hook]?.lift ?? 0);
  const gain = (better - now) * aov;
  const pct = ((budget - 250) / (10000 - 250)) * 100;

  const field = (label: string, value: number, set: (v: number) => void, step: number, suffix = "") => (
    <label className="grid gap-1 text-sm font-semibold" htmlFor={`${id}-${label}`}>
      {label}
      <span className="flex items-center gap-1 border-b-2 border-white">
        <input
          id={`${id}-${label}`}
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={value}
          onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))}
          className="min-h-11 w-full bg-transparent py-2 text-lg tabular-nums outline-none"
        />
        {suffix ? <span className="opacity-80">{suffix}</span> : null}
      </span>
    </label>
  );

  return (
    <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
      <div className="grid content-start gap-10 lg:col-span-5">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Currency">
          {CURRENCIES.map((c) => (
            <button key={c} type="button" aria-pressed={cur === c} onClick={() => setCur(c)} className={`b-pill ${cur === c ? "is-on" : ""}`}>
              {c.trim()}
            </button>
          ))}
        </div>

        <label htmlFor={`${id}-budget`} className="grid gap-4">
          <span className="text-sm font-semibold uppercase tracking-[0.14em]">Monthly ad budget</span>
          <span className="d-display text-6xl tabular-nums">{money(budget, cur)}</span>
          <input
            id={`${id}-budget`}
            type="range"
            min={250}
            max={10000}
            step={250}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="b-dial"
            style={{ ["--fill" as string]: `${pct}%` }}
          />
        </label>

        <div className="grid gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.14em]" id={`${id}-hooks`}>
            Your hooks
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby={`${id}-hooks`}>
            {HOOKS.map((h, i) => (
              <button key={h.label} type="button" aria-pressed={hook === i} onClick={() => setHook(i)} className={`b-pill ${hook === i ? "is-on" : ""}`}>
                {h.label}
              </button>
            ))}
          </div>
        </div>

        <details className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 font-semibold underline underline-offset-4">
            Change the maths
            <span aria-hidden className="transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="mt-6 grid grid-cols-2 gap-6">
            {field("Cost per 1,000 views", cpm, setCpm, 0.5, cur.trim())}
            {field("Click rate", ctr, setCtr, 0.1, "%")}
            {field("Clicks that buy", cr, setCr, 0.5, "%")}
            {field("Average sale", aov, setAov, 5, cur.trim())}
          </div>
        </details>
      </div>

      <div className="grid content-start gap-10 lg:col-span-6 lg:col-start-7" aria-live="polite">
        <div className="grid gap-2 border-t-2 border-white/30 pt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] opacity-80">Today</p>
          <p className="d-display text-5xl tabular-nums opacity-80 sm:text-6xl">
            {money(now * aov, cur)}
            <span className="text-xl"> /month</span>
          </p>
          <p className="opacity-80">{Math.round(now)} customers from {Math.round(views).toLocaleString("en-US")} views</p>
        </div>
        <div className="grid gap-2 border-t-2 border-white pt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em]">With {HOOKS[hook]?.label.toLowerCase()}</p>
          <p className="d-display text-6xl tabular-nums sm:text-7xl">
            {money(better * aov, cur)}
            <span className="text-xl"> /month</span>
          </p>
          <p>{Math.round(better)} customers, same budget</p>
        </div>
        <p className="d-display text-2xl uppercase leading-tight sm:text-3xl">
          {gain > 0 ? (
            <>
              That’s <span className="bg-white px-[0.12em] text-[#052662]">{money(gain, cur)} more a month</span> for the same spend.
            </>
          ) : (
            "Same hooks, same results. The hook is the lever."
          )}
        </p>
        <p className="max-w-[36rem] text-sm opacity-80">
          Illustrative maths, not a promise. Costs and click rates vary by market and platform. In your free audit we replace these with your
          real numbers.
        </p>
      </div>
    </div>
  );
}
