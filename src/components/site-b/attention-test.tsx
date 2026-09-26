import { useRef, useState, type ReactNode } from "react";

import { QUESTIONS, bandFor, compute, type QuizResult } from "@/components/site-d/leak-quiz";
import { useCount } from "./motion-b";
import { BoltIcon } from "./pieces-b";

const LETTERS = ["A", "B", "C", "D"];

/**
 * The Attention Test: a full-bleed Electric Blue takeover, one giant question
 * at a time. Each answer charges one of five bolts; the result is a big score,
 * the three biggest gaps with a fix each, and whatever next steps the page
 * passes in (booking, WhatsApp, emailed report).
 */
export function AttentionTest({ onResult, next }: { onResult?: (r: QuizResult) => void; next: (r: QuizResult) => ReactNode }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUESTIONS.map(() => null));
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const headRef = useRef<HTMLHeadingElement>(null);

  const choose = (qi: number, oi: number) => {
    const nextAns = answers.slice();
    nextAns[qi] = oi;
    setAnswers(nextAns);
    window.setTimeout(() => {
      if (qi + 1 >= QUESTIONS.length) {
        const r = compute(nextAns);
        setResult(r);
        onResult?.(r);
      }
      setStep(qi + 1);
      headRef.current?.focus();
    }, 220);
  };

  const restart = () => {
    setAnswers(QUESTIONS.map(() => null));
    setResult(null);
    setStep(0);
    headRef.current?.focus();
  };

  const q = QUESTIONS[step];
  return (
    <div className="grid gap-12">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <span role="img" aria-label={`${Math.min(step, QUESTIONS.length)} of ${QUESTIONS.length} answered`} className="inline-flex gap-2">
          {QUESTIONS.map((_, i) => (
            <BoltIcon key={i} filled={i < step} className={`h-9 w-auto transition-transform duration-300 ${i < step ? "scale-110" : ""}`} />
          ))}
        </span>
        {step > 0 && !result ? (
          <button type="button" onClick={() => setStep(step - 1)} className="d-link min-h-11 text-base font-semibold">
            Back
          </button>
        ) : null}
      </div>

      {q && !result ? (
        <fieldset key={step} className="b-test-q grid gap-8">
          <legend className="contents">
            <h3 ref={headRef} tabIndex={-1} className="d-display text-[clamp(1.75rem,4.4vw,3.5rem)] uppercase leading-[1.05] outline-none">
              <span className="mb-4 block text-sm font-semibold tracking-[0.14em]">
                Question {step + 1} of {QUESTIONS.length}
              </span>
              {q.q}
            </h3>
          </legend>
          <div className="grid gap-3">
            {q.options.map((o, oi) => (
              <button
                key={o.label}
                type="button"
                aria-pressed={answers[step] === oi}
                onClick={() => choose(step, oi)}
                className={`b-test-option ${answers[step] === oi ? "is-picked" : ""}`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 text-sm font-bold">{LETTERS[oi]}</span>
                <span className="text-lg font-semibold sm:text-xl">{o.label}</span>
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {result ? <Result result={result} headRef={headRef} onRestart={restart} next={next(result)} /> : null}
    </div>
  );
}

function Result({ result, headRef, onRestart, next }: { result: QuizResult; headRef: React.RefObject<HTMLHeadingElement | null>; onRestart: () => void; next: ReactNode }) {
  const n = useCount(result.score, true, 1400);
  const band = bandFor(result.score);
  return (
    <div className="grid gap-12">
      <div className="grid gap-4">
        <h3 ref={headRef} tabIndex={-1} className="text-sm font-semibold uppercase tracking-[0.14em] outline-none">
          Your Attention Score
        </h3>
        <p className="d-display flex items-baseline gap-4 leading-none">
          <span className="text-[clamp(6rem,18vw,12rem)] tabular-nums">{n}</span>
          <span className="text-3xl">/100</span>
        </p>
        <p className="d-display text-3xl uppercase">
          <span className="bg-white px-[0.12em] text-[#052662]">{band.name}.</span>
        </p>
        <p className="max-w-[36rem] text-lg">{band.line}</p>
      </div>
      {result.leaks.length ? (
        <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {result.leaks.map((l, i) => (
            <li key={l.title} className="grid content-start gap-3 border-t-2 border-white pt-6">
              <span className="text-sm font-semibold tracking-[0.14em]">GAP {i + 1}</span>
              <p className="text-xl font-bold">{l.title}</p>
              <p>{l.fix}</p>
            </li>
          ))}
        </ol>
      ) : null}
      {next}
      <button type="button" onClick={onRestart} className="d-link min-h-11 justify-self-start text-base font-semibold">
        Take the test again
      </button>
    </div>
  );
}
