import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fades content up the first time it scrolls into view.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Fire at 20% visibility, or as soon as a taller-than-viewport block
        // has entered the lower part of the screen.
        if (
          entries.some(
            (entry) =>
              entry.isIntersecting &&
              (entry.intersectionRatio >= 0.2 ||
                entry.boundingClientRect.height > window.innerHeight * 0.8),
          )
        ) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.2] },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
