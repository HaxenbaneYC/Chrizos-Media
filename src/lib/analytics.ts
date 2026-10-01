/**
 * Analytics, loaded only after the visitor accepts cookies.
 *
 * Paste the IDs below to switch tracking on. While both are empty nothing is
 * loaded, no cookies are set and the cookie banner stays hidden.
 *   GA_MEASUREMENT_ID: Google Analytics 4 → Admin → Data streams → "G-…"
 *   META_PIXEL_ID: Meta Events Manager → your dataset/pixel → the number
 */
export const GA_MEASUREMENT_ID = "";
export const META_PIXEL_ID = "";

export const ANALYTICS_ENABLED = Boolean(GA_MEASUREMENT_ID || META_PIXEL_ID);

export type Consent = "all" | "essential";
const KEY = "chrizos-consent-v1";
export const CONSENT_EVENT = "chrizos-consent-open";

type Win = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: ((...args: unknown[]) => void) & {
    queue?: unknown[];
    loaded?: boolean;
    version?: string;
    callMethod?: (...a: unknown[]) => void;
    push?: unknown;
  };
  _fbq?: unknown;
};

export function readConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(consent: Consent) {
  try {
    window.localStorage.setItem(KEY, consent);
  } catch {
    // Private mode: the choice lasts for this visit only.
  }
  if (consent === "all") loadAnalytics();
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

function addScript(src: string) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

let loaded = false;

export function loadAnalytics() {
  if (loaded || !ANALYTICS_ENABLED || typeof window === "undefined") return;
  loaded = true;
  const w = window as Win;

  if (GA_MEASUREMENT_ID) {
    w.dataLayer = w.dataLayer || [];
    w.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };
    w.gtag("js", new Date());
    w.gtag("config", GA_MEASUREMENT_ID);
    addScript(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
  }

  if (META_PIXEL_ID) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue!.push(args);
    } as NonNullable<Win["fbq"]>;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.push = fbq;
    w.fbq = fbq;
    w._fbq = fbq;
    addScript("https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", META_PIXEL_ID);
    fbq("track", "PageView");
  }
}

/** Page view after an in-app navigation (Google Analytics tracks these itself). */
export function trackPageView() {
  if (!loaded) return;
  (window as Win).fbq?.("track", "PageView");
}

/** A finished audit form ("lead") or a booked call ("booking"). No-op without consent. */
export function track(event: "lead" | "booking") {
  if (!loaded) return;
  const w = window as Win;
  w.gtag?.("event", event === "lead" ? "generate_lead" : "book_appointment");
  w.fbq?.("track", event === "lead" ? "Lead" : "Schedule");
}
