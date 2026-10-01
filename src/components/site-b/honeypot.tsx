import { useRef } from "react";

/**
 * Spam trap for forms: a field that is invisible to people (and skipped by screen
 * readers and the keyboard) but that bots fill in, plus the time the form was open.
 * Read both with `spamTraps(formData)` when submitting.
 */
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}
    >
      <label>
        Leave this empty
        <input type="text" name="company_url" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

/** Call once per form; returns a reader for the trap values. */
export function useSpamTraps() {
  const openedAt = useRef(Date.now());
  return (f: FormData) => ({
    hp: String(f.get("company_url") ?? "").slice(0, 300),
    elapsedMs: Math.max(0, Math.round(Date.now() - openedAt.current)),
  });
}
