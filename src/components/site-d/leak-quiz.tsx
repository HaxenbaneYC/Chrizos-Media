import { useId, useMemo, useRef, useState } from "react";

import { Gauge } from "./play-d";

export type QuizResult = { score: number; band: string; summary: string; leaks: Leak[] };
type Leak = { title: string; fix: string };
type Option = { label: string; points: number };
type Question = { q: string; options: Option[]; leak: Leak };

const QUESTIONS: Question[] = [
  {
    q: "Are you running paid ads right now?",
    options: [
      { label: "Yes, always on and tested", points: 20 },
      { label: "Sometimes, or boosted posts", points: 8 },
      { label: "No", points: 0 },
    ],
    leak: {
      title: "No attention you control",
      fix: "Paid ads are the only attention you can switch on tomorrow. Start with one offer, one audience and a small daily budget, then scale what works.",
    },
  },
  {
    q: "Do you know what one new customer costs you from ads?",
    options: [
      { label: "Yes, exactly", points: 20 },
      { label: "Roughly", points: 12 },
      { label: "No idea", points: 0 },
    ],
    leak: {
      title: "You can’t see what attention costs",
      fix: "Track one number: cost per customer. Switch on conversion tracking so every sale is tied back to the ad that earned it.",
    },
  },
  {
    q: "How many new hooks or ad creatives do you test each month?",
    options: [
      { label: "5 or more", points: 20 },
      { label: "1 to 4", points: 10 },
      { label: "None, we reuse the same ones", points: 0 },
    ],
    leak: {
      title: "Your ads run on one idea",
      fix: "The hook decides who stops. Test at least 5 new hooks a month, keep the winners and make more like them.",
    },
  },
  {
    q: "How many new people see your business each week?",
    options: [
      { label: "Thousands", points: 20 },
      { label: "Hundreds", points: 10 },
      { label: "Mostly the same followers", points: 0 },
    ],
    leak: {
      title: "You keep talking to the same people",
      fix: "Growth needs new eyes. Put ads and collaborations in front of people who’ve never heard of you, every single week.",
    },
  },
  {
    q: "When someone sees your ad but doesn’t buy, what happens?",
    options: [
      { label: "We retarget them and collect their details", points: 20 },
      { label: "They might follow us", points: 8 },
      { label: "Nothing, they’re gone", points: 0 },
    ],
    leak: {
      title: "Attention you paid for walks away",
      fix: "Retarget everyone who engaged, and offer something worth their email or WhatsApp number so you own that attention.",
    },
  },
];

function bandFor(score: number) {
  if (score >= 80) return { name: "Loud and clear", line: "People see you and you know what it costs. Now it’s about scaling what works." };
  if (score >= 50) return { name: "Half heard", line: "Some of the right people see you, but you’re leaving attention on the table." };
  return { name: "Under the radar", line: "Most of your future customers haven’t seen you yet. The fixes below change that." };
}

function compute(ans: (number | null)[]): QuizResult {
  const pts = QUESTIONS.map((q, i) => {
    const a = ans[i];
    return a === null || a === undefined ? 0 : (q.options[a]?.points ?? 0);
  });
  const score = pts.reduce((s, p) => s + p, 0);
  const leaks = QUESTIONS.map((q, i) => ({ leak: q.leak, p: pts[i] ?? 0 }))
    .filter((x) => x.p < 20)
    .sort((a, b) => a.p - b.p)
    .slice(0, 3)
    .map((x) => x.leak);
  const band = bandFor(score).name;
  const lines = QUESTIONS.map((q, i) => {
    const a = ans[i];
    return `- ${q.q} ${a === null || a === undefined ? "(skipped)" : q.options[a]?.label}`;
  });
  return { score, band, leaks, summary: `Attention Score: ${score}/100 (${band})\n${lines.join("\n")}` };
}

/**
 * The 60-second Attention Score. One question at a time, then a score and the
 * three biggest leaks with a fix for each. `onResult` hands the result to
 * the page so booking, WhatsApp and email can carry it along.
 */
export function LeakQuiz({ onResult }: { onResult?: (r: QuizResult) => void }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUESTIONS.map(() => null));
  const [step, setStep] = useState(0);
  const headRef = useRef<HTMLHeadingElement>(null);
  const uid = useId();
  const done = step >= QUESTIONS.length;

  const result = useMemo(() => (done ? compute(answers) : null), [done, answers]);

  const choose = (qi: number, oi: number) => {
    const next = answers.slice();
    next[qi] = oi;
    setAnswers(next);
    window.setTimeout(() => {
      setStep(qi + 1);
      if (qi + 1 >= QUESTIONS.length) onResult?.(compute(next));
      headRef.current?.focus();
    }, 180);
  };

  const restart = () => {
    setAnswers(QUESTIONS.map(() => null));
    setStep(0);
    window.setTimeout(() => headRef.current?.focus(), 0);
  };

  if (done && result) {
    const band = bandFor(result.score);
    return (
      <div className="d-card grid gap-12 p-8 sm:p-12" aria-live="polite">
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="d-kicker">Your Attention Score</p>
            <h3 ref={headRef} tabIndex={-1} className="d-display mt-2 scroll-mt-32 text-[clamp(4rem,10vw,6.5rem)] leading-none outline-none">
              {result.score}
              <span className="text-[0.35em] text-[var(--d-muted)]">/100</span>
            </h3>
            <Gauge score={result.score} />
          </div>
          <div className="md:col-span-7">
            <p className="d-display text-3xl">{band.name}</p>
            <p className="mt-2 text-lg">{band.line}</p>
          </div>
        </div>
        {result.leaks.length ? (
          <div>
            <p className="d-kicker">Where you’re losing attention, and the fix</p>
            <ol className="mt-4 grid gap-4 md:grid-cols-3">
              {result.leaks.map((l, i) => (
                <li key={l.title} className="border-t-2 border-[var(--d-ink)] pt-4">
                  <p className="d-mono text-sm text-[var(--d-muted)]">Gap {i + 1}</p>
                  <p className="mt-1 text-lg font-semibold">{l.title}</p>
                  <p className="mt-2">{l.fix}</p>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="text-lg">No big gaps. In a free audit we’d look for the next level: new hooks, new audiences and more budget behind your winners.</p>
        )}
        <button type="button" onClick={restart} className="d-link justify-self-start text-sm">
          Retake the test
        </button>
      </div>
    );
  }

  const q = QUESTIONS[step];
  if (!q) return null;
  return (
    <div className="d-card grid gap-8 p-8 sm:p-12">
      <div className="flex items-center justify-between gap-4">
        <p className="d-mono text-sm">
          Question {step + 1} of {QUESTIONS.length}
        </p>
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} className="d-link text-sm">
            Back
          </button>
        ) : null}
      </div>
      <div className="flex gap-1" aria-hidden>
        {QUESTIONS.map((_, i) => (
          <span key={i} className={`h-1.5 flex-1 ${i <= step ? "bg-[var(--d-forest)]" : "bg-[var(--d-rule)]"}`} />
        ))}
      </div>
      <fieldset className="grid gap-5">
        <legend className="contents">
          <h3 ref={headRef} tabIndex={-1} id={`${uid}-q`} className="d-display scroll-mt-32 text-[clamp(1.6rem,3.2vw,2.4rem)] leading-tight outline-none">
            {q.q}
          </h3>
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {q.options.map((o, oi) => {
            const picked = answers[step] === oi;
            return (
              <button
                key={o.label}
                type="button"
                aria-pressed={picked}
                onClick={() => choose(step, oi)}
                className={`d-option min-h-16 px-5 py-4 text-left text-lg font-medium ${picked ? "is-picked" : ""}`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
