import { useEffect, useRef } from "react";

/**
 * Writes scroll progress (0 to 1) into the CSS variable `--p` on the
 * returned element, so graphics can build as the reader scrolls and rewind
 * when they scroll back. Progress runs from the element's top entering the
 * bottom of the viewport to its middle reaching `endAt` of the viewport.
 * Reduced-motion users get a fixed `--p: 1` (the finished state).
 */
export function useScrollProgress<T extends HTMLElement | SVGElement>(endAt = 0.45) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh; // top enters from below
      const end = vh * endAt - r.height / 2; // middle reaches endAt
      const p = (start - r.top) / (start - end);
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [endAt]);
  return ref;
}
