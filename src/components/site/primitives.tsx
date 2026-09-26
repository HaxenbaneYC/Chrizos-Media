import { useEffect, useRef, useState, type ReactNode } from "react";

/** The Chrizos lightning bolt, traced from the brand kit (brand-kit V3.1). */
export const BOLT_POINTS = "68.3,0.1 0,110 41.3,110 12.7,200.4 109.8,71.8 65.3,71.7 101.4,0";

export function Bolt({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 110 201"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <polygon points={BOLT_POINTS} fill="currentColor" />
    </svg>
  );
}

/** Tracks whether an element has entered the viewport (once by default). */
export function useInView<T extends Element>({
  threshold = 0.25,
  rootMargin,
  once = true,
}: { threshold?: number; rootMargin?: string; once?: boolean } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      rootMargin ? { threshold, rootMargin } : { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView] as const;
}

/** Small uppercase section label. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-sm font-semibold uppercase ${className}`}>{children}</p>;
}

/**
 * Large statement whose words light up one at a time as they cross
 * a trigger line in the viewport.
 */
export function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const words = Array.from(root.querySelectorAll<HTMLElement>("[data-word]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => w.classList.add("is-lit"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-lit");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -42% 0px", threshold: 1 },
    );
    words.forEach((w) => observer.observe(w));
    return () => observer.disconnect();
  }, [text]);

  const lines = text.split("\n");
  return (
    <p ref={ref} className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((word, wi) => (
            <span key={wi} data-word className="word-reveal">
              {word}{" "}
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}
