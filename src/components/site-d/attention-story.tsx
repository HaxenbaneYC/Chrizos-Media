import { useEffect, useRef, useState } from "react";

type RGB = [number, number, number];
let INK: RGB = [17, 18, 16];
let LIME: RGB = [210, 245, 60];
let RULE: RGB = [216, 210, 194];
let HI: RGB = [210, 245, 60];
let FOREST = "#0D3B2E";
let FONT = '600 13px "Geist Mono", monospace';

/** Read the page theme's colour tokens, so the story follows whichever brand wraps it. */
function readTheme(el: HTMLElement, ctx: CanvasRenderingContext2D) {
  const cs = getComputedStyle(el);
  const rgb = (name: string, fallback: RGB): RGB => {
    const raw = cs.getPropertyValue(name).trim();
    if (!raw) return fallback;
    ctx.fillStyle = "#000";
    ctx.fillStyle = raw;
    const hex = String(ctx.fillStyle);
    const m = /^#([0-9a-f]{6})$/i.exec(hex);
    if (!m) return fallback;
    const n = parseInt(m[1] ?? "0", 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  INK = rgb("--d-ink", INK);
  LIME = rgb("--d-lime", LIME);
  RULE = rgb("--d-rule", RULE);
  HI = rgb("--d-hi", HI);
  FOREST = `rgb(${rgb("--d-forest", [13, 59, 46]).join(",")})`;
  FONT = el.closest(".b-theme") ? '700 13px "Montserrat", sans-serif' : '600 13px "Geist Mono", monospace';
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - (1 - clamp(t)) ** 3;
const mix = (a: RGB, b: RGB, t: number) => a.map((v, i) => Math.round(v + ((b[i] ?? v) - v) * t));

type Dot = { x: number; y: number; r: number; right: boolean; jitter: number };

const CAPTIONS = [
  { at: 0, kicker: "01 · Attention", line: "Thousands of people scroll past you every week.", mark: "" },
  { at: 0.22, kicker: "02 · Targeting", line: "Our ads find the ones who would ", mark: "actually buy." },
  { at: 0.46, kicker: "03 · Customers", line: "Then we turn that attention into ", mark: "paying customers." },
  { at: 0.7, kicker: "04 · Revenue", line: "And customers into ", mark: "revenue you can see every week." },
];
const REVENUE = 3000; // example: 38 customers x 80 average sale, as in the ad calculator

/**
 * Pinned, scroll-driven story: a crowd of dots (people), a highlighter
 * sweeping across them marking the right ones in Signal, and those people
 * flowing into a "customers" box while a counter climbs. Scrolling back
 * rewinds it. Reduced motion shows the finished frame.
 */
export function AttentionStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    let frame = 0;
    let lastPhase = -1;
    let lastCount = -1;
    let lastRevenue = -1;

    const build = () => {
      readTheme(section, ctx);
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cols = w > 600 ? 26 : 16;
      const rows = Math.round(cols * (h * 0.62) / w);
      const gx = w / (cols + 1);
      const gy = (h * 0.62) / (rows + 1);
      let seed = 7;
      const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      dots = [];
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++)
          dots.push({ x: gx * (i + 1) + (rand() - 0.5) * gx * 0.6, y: gy * (j + 1) + (rand() - 0.5) * gy * 0.6, r: 2.2 + rand() * 1.6, right: rand() < 0.16, jitter: rand() });
    };

    const progress = () => {
      if (reduce) return 1;
      const r = section.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      return span > 0 ? clamp(-r.top / span) : 1;
    };

    const draw = () => {
      frame = 0;
      const p = progress();
      ctx.clearRect(0, 0, w, h);
      const sweep = ease((p - 0.14) / 0.26); // highlighter pass
      const flow = ease((p - 0.42) / 0.24); // people flow into the box
      const rev = ease((p - 0.7) / 0.24); // customers become revenue
      const bandX = -w * 0.25 + sweep * w * 1.35;
      const box = { x: w * 0.5 - Math.min(160, w * 0.3), y: h * 0.74, w: Math.min(320, w * 0.6), h: h * 0.2 };

      // highlighter band (visible while sweeping)
      if (sweep > 0 && sweep < 1) {
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = `rgb(${LIME.join(",")})`;
        ctx.beginPath();
        const bw = Math.max(40, w * 0.08);
        ctx.moveTo(bandX, -10);
        ctx.lineTo(bandX + bw, -10);
        ctx.lineTo(bandX + bw - h * 0.12, h * 0.66);
        ctx.lineTo(bandX - h * 0.12, h * 0.66);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // customers box
      ctx.save();
      ctx.globalAlpha = clamp(flow * 1.5);
      ctx.fillStyle = FOREST;
      ctx.beginPath();
      ctx.roundRect(box.x, box.y, box.w, box.h, 10);
      ctx.fill();
      ctx.fillStyle = `rgb(${HI.join(",")})`;
      ctx.font = FONT;
      ctx.textAlign = "left";
      ctx.fillText("CUSTOMERS", box.x + 14, box.y + 22);
      ctx.restore();

      let arrived = 0;
      const rightTotal = dots.filter((d) => d.right).length;
      for (const d of dots) {
        const marked = d.right && bandX > d.x - h * 0.12 * (d.y / (h * 0.66));
        if (d.right && marked) {
          const t = clamp((flow - d.jitter * 0.35) / 0.65);
          const tx = box.x + box.w * (0.15 + 0.7 * d.jitter);
          const ty = box.y + box.h * (0.3 + 0.4 * ((d.x / w + d.jitter) % 1));
          const x = d.x + (tx - d.x) * ease(t);
          const y = d.y + (ty - d.y) * ease(t);
          if (t >= 1) arrived++;
          ctx.save();
          ctx.globalAlpha = t >= 1 ? 1 - rev : 1;
          ctx.fillStyle = `rgb(${LIME.join(",")})`;
          ctx.strokeStyle = `rgb(${INK.join(",")})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, d.r + 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        } else {
          const fade = d.right ? 0 : flow;
          const c = mix(INK, RULE, 0.35 + fade * 0.55);
          ctx.fillStyle = `rgb(${c.join(",")})`;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // revenue: four monthly bars rise out of the customers box
      if (rev > 0) {
        const bars = [0.35, 0.55, 0.8, 1];
        const bw = box.w / 7;
        const maxH = box.y - h * 0.08;
        ctx.save();
        bars.forEach((b, i) => {
          const grow = clamp(rev * 1.6 - i * 0.2);
          const bh = maxH * 0.78 * b * ease(grow);
          const bx = box.x + bw * (0.8 + i * 1.5);
          ctx.fillStyle = `rgb(${LIME.join(",")})`;
          ctx.strokeStyle = `rgb(${INK.join(",")})`;
          ctx.lineWidth = 2;
          ctx.fillRect(bx, box.y - bh, bw, bh);
          ctx.strokeRect(bx, box.y - bh, bw, bh);
        });
        ctx.fillStyle = `rgb(${INK.join(",")})`;
        ctx.globalAlpha = clamp(rev * 2);
        ctx.font = FONT;
        ctx.textAlign = "left";
        ctx.fillText("REVENUE, MONTHS 1 TO 4", box.x, box.y - maxH * 0.84);
        ctx.restore();
      }

      const ph = p >= CAPTIONS[3]!.at ? 3 : p >= CAPTIONS[2]!.at ? 2 : p >= CAPTIONS[1]!.at ? 1 : 0;
      if (ph !== lastPhase) {
        lastPhase = ph;
        setPhase(ph);
      }
      const c = rightTotal ? Math.round((arrived / rightTotal) * 38) : 0;
      if (c !== lastCount) {
        lastCount = c;
        setCount(c);
      }
      const money = Math.round((rev * REVENUE) / 50) * 50;
      if (money !== lastRevenue) {
        lastRevenue = money;
        setRevenue(money);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    build();
    draw();
    const ro = new ResizeObserver(() => {
      build();
      draw();
    });
    ro.observe(canvas);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const cap = CAPTIONS[phase] ?? CAPTIONS[0]!;
  return (
    <section ref={sectionRef} aria-label="How we turn attention into customers" className="relative h-[340svh] border-t-2 border-[var(--d-ink)]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-6 pb-12 pt-28 lg:px-12">
        <div className="d-wrap grid flex-1 grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="grid content-center gap-4 lg:col-span-5">
            <p className="d-kicker">{cap.kicker}</p>
            <p aria-live="polite" className="d-display d-h2 max-w-[28rem]">
              {cap.line}
              {cap.mark ? <span className="d-mark is-on">{cap.mark}</span> : null}
            </p>
            <div className={`flex items-baseline gap-3 transition-opacity duration-500 ${phase >= 2 ? "opacity-100" : "opacity-0"}`}>
              {phase === 3 ? (
                <>
                  <span className="d-display text-6xl">${revenue.toLocaleString("en-US")}</span>
                  <span className="d-mono text-sm">revenue a month (example)</span>
                </>
              ) : (
                <>
                  <span className="d-display text-6xl">{count}</span>
                  <span className="d-mono text-sm">customers this month (example)</span>
                </>
              )}
            </div>
          </div>
          <div className="relative min-h-[46svh] lg:col-span-7">
            <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
