import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import {
  ANALYTICS_ENABLED,
  CONSENT_EVENT,
  loadAnalytics,
  readConsent,
  saveConsent,
  trackPageView,
  type Consent,
} from "@/lib/analytics";

/**
 * Asks before any analytics cookie is set. Renders nothing while no analytics
 * ID is configured (see src/lib/analytics.ts), because then there is nothing to ask.
 */
export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const firstPath = useRef(path);

  useEffect(() => {
    if (!ANALYTICS_ENABLED) return;
    const consent = readConsent();
    if (consent === "all") loadAnalytics();
    if (consent === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (path !== firstPath.current) trackPageView();
  }, [path]);

  if (!ANALYTICS_ENABLED || !open) return null;

  const choose = (c: Consent) => {
    saveConsent(c);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-xl border-2 border-[#052662] bg-white p-5 text-[#052662] shadow-[6px_6px_0_#052662] sm:inset-x-6 sm:bottom-6"
    >
      <p id="cookie-title" className="font-bold">
        Cookies, only if you say yes
      </p>
      <p className="mt-2 text-sm leading-relaxed">
        We’d like to use analytics cookies to see which pages help people and to measure our ads.
        Nothing is set unless you accept.{" "}
        <a href="/privacy#cookies" className="font-semibold underline underline-offset-2">
          Privacy policy
        </a>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => choose("all")}
          className="d-btn min-h-11 bg-[#1700FF] px-5 text-sm text-white"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => choose("essential")}
          className="d-btn min-h-11 border-2 border-[#052662] px-5 text-sm"
        >
          Only essential
        </button>
      </div>
    </div>
  );
}
