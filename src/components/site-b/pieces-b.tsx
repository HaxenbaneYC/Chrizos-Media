import { useId, useState } from "react";

import { useCount, useSeen } from "./motion-b";

const BOLT = "M340.75 0.44 0 548.96l206.29-.24L63.13 1000l484.72-641.71-221.86-.27L505.88 0z";

/** The bolt, the brand's one graphic device. */
export function BoltIcon({ className = "", filled = true }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="-20 -20 588 1040" aria-hidden className={className}>
      <path
        d={BOLT}
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 44}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={filled ? undefined : { strokeWidth: 2 }}
      />
    </svg>
  );
}

/** Five bolts for the five client spots: taken ones filled, open ones outlined. */
export function BoltSeats({ open, className = "h-8" }: { open: number; className?: string }) {
  const total = 5;
  return (
    <span role="img" aria-label={`${total - open} of ${total} client spots taken, ${open} open`} className="inline-flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <BoltIcon key={i} filled={i < total - open} className={`${className} w-auto shrink-0`} />
      ))}
    </span>
  );
}

type Stat = { value: number; unit: string; label: string; prefix?: string };

/** Three proof numbers that count up once, set huge. */
export function ProofNumbers({ stats }: { stats: Stat[] }) {
  const [ref, seen] = useSeen<HTMLDListElement>();
  return (
    <dl ref={ref} className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
      {stats.map((s) => (
        <ProofNumber key={s.label} stat={s} run={seen} />
      ))}
    </dl>
  );
}

function ProofNumber({ stat, run }: { stat: Stat; run: boolean }) {
  const n = useCount(stat.value, run);
  return (
    <div className="grid content-start gap-2 border-t-4 border-[var(--d-lime)] pt-6">
      <dt className="sr-only">{stat.label}</dt>
      <dd className="d-display flex items-baseline gap-3 text-[var(--d-lime)]">
        <span className="text-7xl leading-none tabular-nums sm:text-8xl">
          {stat.prefix}
          {n}
        </span>
        <span className="text-2xl uppercase">{stat.unit}</span>
      </dd>
      <dd className="text-lg">{stat.label}</dd>
    </div>
  );
}

export type Service = { name: string; line: string; headline: string; points: string[]; first: string };

/**
 * The switchboard: every service as a full-width row set huge. Opening a row
 * throws it to Electric Blue with a flash of the bolt and shows the detail.
 */
export function Switchboard({ services }: { services: Service[] }) {
  const [open, setOpen] = useState(0);
  const uid = useId();
  return (
    <ul className="border-t-2 border-[var(--d-ink)]">
      {services.map((s, i) => {
        const on = open === i;
        return (
          <li key={s.name} className={`b-switch ${on ? "is-on" : ""}`}>
            <h3>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`${uid}-${i}`}
                onClick={() => setOpen(on ? -1 : i)}
                className="b-switch-row grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 px-4 py-6 text-left sm:grid-cols-[5rem_1fr_1fr_auto] sm:px-8"
              >
                <span className="text-sm font-semibold tabular-nums">0{i + 1}</span>
                <span className="d-display b-switch-name uppercase">{s.name}</span>
                <span className="hidden text-lg font-semibold sm:block">{s.line}</span>
                <span aria-hidden className="b-switch-icon grid h-12 w-12 place-items-center rounded-full border-2">
                  <BoltIcon className="b-switch-bolt h-6" />
                </span>
              </button>
            </h3>
            <div id={`${uid}-${i}`} role="region" hidden={!on} className="b-switch-body px-4 pb-12 sm:px-8 sm:pl-[calc(5rem+3rem)]">
              <div className="grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
                <p className="d-display text-2xl leading-tight sm:text-3xl">{s.headline}</p>
                <div className="grid content-start gap-6">
                  <ul className="grid gap-3 text-lg">
                    {s.points.map((pt) => (
                      <li key={pt} className="flex gap-3">
                        <BoltIcon className="mt-1 h-5 w-auto shrink-0" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em]">First results: {s.first}</p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
