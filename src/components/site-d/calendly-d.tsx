import { useEffect, useRef, useState } from "react";

import { IconD } from "./brand-d";

const DEFAULT_URL = "https://calendly.com/chrizosmedia/youssef";

/**
 * Calendly scheduler in Option D colours (Newsprint, Ink, Forest). `notes`
 * (e.g. the Attention Score summary) is passed as Calendly's first custom answer,
 * so the answers arrive with the booking when the event asks a question.
 */
export function CalendlyD({ url, notes, onBooked }: { url?: string | undefined; notes?: string | undefined; onBooked?: () => void }) {
  const base = url || DEFAULT_URL;
  const booked = useRef(onBooked);
  booked.current = onBooked;
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), 12000);
    const onMessage = (e: MessageEvent<{ event?: string }>) => {
      if (e.origin !== "https://calendly.com") return;
      if (e.data?.event === "calendly.event_scheduled") {
        setConfirmed(true);
        booked.current?.();
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  const params = new URLSearchParams({
    embed_domain: "chrizosmedia.com",
    embed_type: "Inline",
    hide_gdpr_banner: "1",
    background_color: "f3efe4",
    text_color: "111210",
    primary_color: "0d3b2e",
  });
  if (notes) params.set("a1", notes.slice(0, 900));
  const src = `${base}?${params.toString()}`;

  if (confirmed) {
    return (
      <div role="status" className="flex min-h-80 flex-col items-center justify-center gap-5 border-2 border-[var(--d-ink)] bg-[var(--d-print)] p-10 text-center">
        <IconD className="h-16 w-16" />
        <p className="d-display text-5xl">Booked.</p>
        <p className="max-w-sm text-lg">Calendly has emailed you the details. Talk soon.</p>
      </div>
    );
  }

  return (
    <div className="relative border-2 border-[var(--d-ink)] bg-[var(--d-print)]">
      {!loaded && !timedOut ? (
        <div role="status" className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
          <IconD className="h-12 w-12 animate-pulse" />
          <p className="d-mono text-sm">Loading available times</p>
        </div>
      ) : null}
      {timedOut && !loaded ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-[var(--d-print)] p-8 text-center">
          <p className="d-display text-3xl">The calendar is taking a while.</p>
          <a href={base} target="_blank" rel="noreferrer" className="d-btn d-btn-forest min-h-12 px-6 text-base">
            Open it on Calendly
          </a>
        </div>
      ) : null}
      <iframe key={src} src={src} title="Book a free audit with Chrizos Media" className="block h-[720px] w-full border-0" loading="lazy" onLoad={() => setLoaded(true)} />
      <p className="border-t border-[var(--d-rule)] px-6 py-4 text-center text-sm">
        Calendar not showing?{" "}
        <a href={base} target="_blank" rel="noreferrer" className="d-link font-semibold">
          Open it on Calendly
        </a>
      </p>
    </div>
  );
}
