import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

const CALENDLY_URL = "https://calendly.com/chrizosmedia/youssef";

type CalendlyMessage = {
  event?: string;
};

export function CalendlyBooking() {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => setTimedOut(true), 10000);

    const onMessage = (message: MessageEvent<CalendlyMessage>) => {
      if (message.origin !== "https://calendly.com") return;
      if (message.data?.event === "calendly.event_scheduled") {
        setConfirmed(true);
      }
    };

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleLoad = () => {
    setLoaded(true);
    setTimedOut(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <div className="booking-shell glass-panel overflow-hidden" aria-label="Calendly booking scheduler">
      <div className="border-b border-border px-5 py-4 sm:px-7">
        <p className="text-sm font-extrabold">Choose a time that works for you</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-foreground/65">
          Availability and time zones are handled securely by Calendly.
        </p>
      </div>

      {confirmed ? (
        <div className="flex min-h-40 flex-col items-center justify-center px-6 py-10 text-center" role="status">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-xl font-extrabold text-primary-foreground">
            ✓
          </span>
          <p className="mt-4 text-xl font-extrabold">Your call is booked.</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-foreground/70">
            Calendly has sent the confirmation and meeting details to your email.
          </p>
        </div>
      ) : (
        <div className="relative min-h-[720px] bg-foreground sm:min-h-[680px]">
          {!loaded && !timedOut ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-card px-6 text-center" role="status">
              <p className="text-sm font-bold text-foreground/75">Loading available times…</p>
            </div>
          ) : null}

          {timedOut ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-card px-6 text-center">
              <p className="text-xl font-extrabold">The scheduler could not load here.</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-foreground/70">
                You can still view live availability and book directly on Calendly.
              </p>
              <Button asChild className="lift mt-6 min-h-11 px-6 font-semibold">
                <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                  Open Calendly
                </a>
              </Button>
            </div>
          ) : null}

          <iframe
            src={`${CALENDLY_URL}?embed_domain=chrizosmedia.com&embed_type=Inline&hide_gdpr_banner=1&background_color=ffffff&text_color=052662&primary_color=1700ff`}
            title="Book a free brand audit with Chrizos Media"
            className="h-[720px] w-full border-0 sm:h-[680px]"
            loading="lazy"
            onLoad={handleLoad}
          />
        </div>
      )}

      {!confirmed ? (
        <div className="border-t border-border px-5 py-4 text-center sm:px-7">
          <p className="text-xs font-semibold leading-5 text-foreground/65">
            Not seeing the calendar?{" "}
            <a className="font-extrabold text-foreground underline underline-offset-4" href={CALENDLY_URL} target="_blank" rel="noreferrer">
              Open Calendly in a new tab
            </a>
            .
          </p>
        </div>
      ) : null}
    </div>
  );
}