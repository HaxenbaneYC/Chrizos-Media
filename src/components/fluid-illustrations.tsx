/**
 * Fluid brand illustrations — pure SVG so they stay crisp at any size and
 * inherit the brand palette through CSS variables. Slow drift animation.
 */

function Drift({
  children,
  delay = 0,
  duration = 14,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}) {
  return (
    <g
      className="fluid-drift"
      style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
    >
      {children}
    </g>
  );
}

/** 01 — Content Strategy: flowing streamlines and soft blobs. */
export function ContentFlow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 600"
      className={className}
      role="img"
      aria-label="Fluid illustration of flowing content streams"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="cf-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--brand-electric)" }} />
          <stop offset="1" style={{ stopColor: "var(--brand-navy)" }} />
        </linearGradient>
        <linearGradient id="cf-white" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      <rect width="800" height="600" style={{ fill: "var(--brand-navy)" }} />

      {/* soft fluid blobs */}
      <Drift duration={18}>
        <path
          d="M120 480 C 60 380, 140 300, 240 330 C 360 365, 380 260, 300 200 C 230 148, 260 60, 360 60 C 480 60, 560 150, 520 250 C 480 350, 560 420, 660 400 C 760 380, 800 460, 760 540 L 120 540 Z"
          fill="url(#cf-blue)"
          opacity="0.55"
        />
        <ellipse cx="600" cy="140" rx="150" ry="100" fill="url(#cf-blue)" opacity="0.4" />
      </Drift>

      {/* flowing streamlines */}
      <Drift duration={12}>
        <path
          d="M-20 470 C 150 430, 220 520, 400 470 C 560 425, 640 500, 820 450"
          fill="none"
          stroke="url(#cf-white)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M-20 520 C 180 480, 260 560, 420 515 C 580 470, 680 545, 820 500"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.35"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M-20 150 C 140 190, 260 90, 420 140 C 580 190, 700 100, 820 150"
          fill="none"
          stroke="url(#cf-white)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1 14"
        />
      </Drift>

      {/* orbs */}
      <Drift duration={10} delay={1}>
        <circle cx="640" cy="420" r="14" fill="#ffffff" fillOpacity="0.85" />
        <circle cx="180" cy="160" r="8" fill="#ffffff" fillOpacity="0.5" />
        <circle cx="700" cy="260" r="22" style={{ fill: "var(--brand-electric)" }} fillOpacity="0.9" />
      </Drift>
    </svg>
  );
}

/** 02 — Paid Advertising: ascending fluid curves and rising orbs. */
export function GrowthFlow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 600"
      className={className}
      role="img"
      aria-label="Fluid illustration of rising growth curves"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="gf-rise" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "var(--brand-navy)" }} />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="gf-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="1" style={{ stopColor: "var(--brand-electric)" }} />
        </linearGradient>
      </defs>

      <rect width="800" height="600" style={{ fill: "var(--brand-navy)" }} />

      {/* deep fluid swell */}
      <Drift duration={20}>
        <path
          d="M0 600 L0 460 C 160 380, 300 470, 440 400 C 580 330, 680 380, 800 300 L 800 600 Z"
          fill="url(#gf-blue)"
          opacity="0.35"
        />
      </Drift>

      {/* ascending curves */}
      <Drift duration={12}>
        <path
          d="M-20 560 C 200 540, 380 430, 500 320 C 590 235, 660 180, 820 120"
          fill="none"
          stroke="url(#gf-rise)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M-20 600 C 220 580, 400 500, 540 400 C 640 330, 720 260, 820 210"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.3"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1 16"
        />
      </Drift>

      {/* rising orbs */}
      <Drift duration={9} delay={0.5}>
        <circle cx="620" cy="150" r="16" fill="#ffffff" fillOpacity="0.9" />
        <circle cx="480" cy="250" r="10" style={{ fill: "var(--brand-electric)" }} />
        <circle cx="700" cy="330" r="26" style={{ fill: "var(--brand-electric)" }} fillOpacity="0.8" />
        <circle cx="300" cy="430" r="7" fill="#ffffff" fillOpacity="0.45" />
      </Drift>
    </svg>
  );
}
