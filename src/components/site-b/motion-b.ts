import { useEffect, useRef, useState } from "react";

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Progress (0 to 1) through a pinned section: 0 when its top reaches the top
 * of the viewport, 1 when its bottom reaches the bottom. Written to `--p` on
 * the element and passed to `onProgress`. Reduced motion gets `data-static`
 * and a fixed 1, so CSS can drop the pin and show the finished state.
 */
export function usePinProgress<T extends HTMLElement>(onProgress?: (p: number, el: T) => void) {
  const ref = useRef<T>(null);
  const cb = useRef(onProgress);
  cb.current = onProgress;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = (p: number) => {
      el.style.setProperty("--p", p.toFixed(4));
      cb.current?.(p, el);
    };
    if (reducedMotion()) {
      el.dataset["static"] = "1";
      set(1);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      set(run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 1);
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
  }, []);
  return ref;
}

/** True once the element has come into view (stays true). */
export function useSeen<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/** Counts from 0 to `to` once `run` turns true. */
export function useCount(to: number, run: boolean, ms = 1100) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (reducedMotion()) {
      setN(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setN(Math.round(to * (1 - (1 - k) ** 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, run, ms]);
  return n;
}
