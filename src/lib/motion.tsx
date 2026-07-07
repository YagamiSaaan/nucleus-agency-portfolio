/**
 * @file src/lib/motion.tsx
 *
 * Shared visual + motion primitives used by every route in the app.
 *
 * Nothing here talks to the network or the router — each export is a
 * self-contained, presentational component or hook. They fall into
 * three groups:
 *
 * 1. **Scroll-triggered reveals**: `Reveal`, `SplitText` — mount and
 *    animate in when the element enters the viewport.
 * 2. **Pointer-reactive**: `Magnetic`, `Tilt3D`, `CursorSpotlight` —
 *    respond to `mousemove`. All are effectively no-ops on touch
 *    devices (no `mousemove` fires) and either hide themselves on
 *    small screens or degrade gracefully.
 * 3. **Scroll-linked**: `ScrollProgress`, `useScrollTransform` — read
 *    `window.scrollY` on `passive: true` scroll listeners inside a
 *    `requestAnimationFrame` throttle.
 *
 * Plus `PageLoader` (chrome intro overlay) and `MeltDivider` (SVG
 * decorative wave between sections).
 *
 * All effect hooks clean up their listeners / RAF loops on unmount to
 * avoid leaking work into unmounted trees.
 */
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PropsWithChildren,
  type ReactNode,
} from "react";

/**
 * Fade-and-lift-in wrapper triggered by an `IntersectionObserver`.
 *
 * Animates from `opacity: 0; translateY(y); blur(blur)` to their zero
 * values once the element crosses the observer threshold.
 *
 * @param as - Which HTML element tag to render. Defaults to `"div"`.
 * @param delay - Milliseconds to wait before starting the transition.
 * @param y - Pixel offset for the initial `translateY`. Default `24`.
 * @param blur - Initial CSS blur amount in px. Default `8`.
 * @param once - When `true` (default), disconnects the observer after
 *   the first intersection so exiting the viewport doesn't hide it.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  y = 24,
  blur = 8,
  once = true,
  style,
}: PropsWithChildren<{
  as?: keyof HTMLElementTagNameMap;
  className?: string;
  delay?: number;
  y?: number;
  blur?: number;
  once?: boolean;
  style?: CSSProperties;
}>) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        } else if (!once) setVisible(false);
      },
      { threshold: 0.12, rootMargin: "0px 0px -80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  const Comp = Tag as unknown as "div";
  return (
    <Comp
      ref={ref as never}
      className={className}
      style={{
        ...style,
        transition:
          "opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1), filter 1s cubic-bezier(.22,1,.36,1)",
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        filter: visible ? "blur(0)" : `blur(${blur}px)`,
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </Comp>
  );
}

/**
 * Reveal `text` letter-by-letter with a staggered blur/lift.
 *
 * The `aria-label={text}` on the wrapper preserves the phrase for
 * assistive tech; each per-letter span is `aria-hidden` so screen
 * readers don't spell it out.
 *
 * @param delay - Base delay in ms before the first letter animates.
 * @param step - Additional delay applied per letter index (default 40).
 */
export function SplitText({
  text,
  className = "",
  delay = 0,
  step = 40,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} className={`inline-block ${className}`} aria-label={text}>
      {text.split("").map((c, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block"
          style={{
            transition:
              "opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1), filter .9s cubic-bezier(.22,1,.36,1)",
            transitionDelay: `${delay + i * step}ms`,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(0.6em)",
            filter: visible ? "blur(0)" : "blur(10px)",
          }}
        >
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </span>
  );
}

/**
 * "Magnetic" wrapper — the child element eases toward the cursor
 * whenever the pointer is over it, then springs back on leave.
 *
 * Uses an internal `requestAnimationFrame` loop with a fixed damping
 * factor (`0.15`) for smooth pull/release. Great for CTAs and small
 * icons; avoid nesting inside `Tilt3D` (their transforms compete).
 *
 * @param strength - Multiplier on the raw cursor offset. Values above
 *   `~0.6` feel unnatural. Default `0.35`.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: PropsWithChildren<{ strength?: number; className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = 0, ty = 0, x = 0, y = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) * strength;
      ty = (e.clientY - (r.top + r.height / 2)) * strength;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };
    const loop = () => {
      x += (tx - x) * 0.15;
      y += (ty - y) * 0.15;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);
  return (
    <div ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}

/**
 * Perspective-tilt wrapper — the child rotates on X/Y axes to follow
 * the cursor across its own bounding box.
 *
 * `transform-style: preserve-3d` on the wrapper lets nested elements
 * pop out on top of the tilt. Resets to the neutral pose on mouse leave.
 *
 * @param max - Maximum rotation in degrees on each axis. Default `8`.
 */
export function Tilt3D({
  children,
  className = "",
  max = 8,
}: PropsWithChildren<{ className?: string; max?: number }>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1200px) rotateX(${-py * max}deg) rotateY(${px * max}deg) scale(1.02)`;
    };
    const reset = () => {
      el.style.transform = "perspective(1200px) rotateX(0) rotateY(0) scale(1)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, [max]);
  return (
    <div
      ref={ref}
      className={`transition-transform duration-500 ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

/**
 * Fixed, viewport-covering "spotlight" that follows the cursor with
 * heavy easing. Rendered as a soft radial gradient painted into a
 * `<div>`'s `background` on every animation frame.
 *
 * Hidden on `< md` breakpoints — pointless (and blocking) on touch.
 * `z-[1]` keeps it above the page background but below content.
 */
export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2, x = tx, y = ty;
    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(180,210,255,0.10), transparent 55%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] hidden md:block"
    />
  );
}

/**
 * Thin gradient progress bar pinned to the top of the viewport that
 * scales horizontally with document scroll position.
 *
 * Reads `document.documentElement.scrollHeight - window.innerHeight`
 * inside a RAF-throttled scroll handler and writes `scaleX(0..1)` on
 * a single DOM node — no re-renders.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      el.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left"
      style={{
        background:
          "linear-gradient(90deg, #ffffff, #cfd8e8, #b8a8d0, #ffffff)",
        transform: "scaleX(0)",
        boxShadow: "0 0 12px rgba(200,220,255,0.6)",
      }}
      ref={ref}
    />
  );
}

/**
 * Full-screen chrome-intro overlay shown on first paint.
 *
 * Animates a 0–100% progress counter using an ease-out-cubic curve
 * over ~2.2 s, then clips itself away with a `clip-path` reveal so
 * the app underneath is exposed cleanly.
 *
 * All labels ("loading assets", "casting chrome", "polishing surface",
 * "ready") are derived from the current progress percentage.
 *
 * `aria-hidden` — the overlay is decorative; the underlying page is
 * fully rendered underneath from the start.
 */
export function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const start = performance.now();
    const duration = 2200;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // eased progress
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 300);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pct = Math.round(progress * 100);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
      style={{
        transition: "opacity .6s ease, clip-path 1.2s cubic-bezier(.76,0,.24,1)",
        clipPath: done ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
        opacity: done ? 0 : 1,
      }}
    >
      {/* Base black */}
      <div className="absolute inset-0 bg-background" />

      {/* Silver fluid layers */}
      <div
        className="absolute -left-[15%] top-[10%] h-[80vh] w-[80vh] rounded-full mix-blend-screen blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, #ffffff 0%, #cfd6e2 30%, #7a8296 60%, transparent 75%)",
          animation: "loader-fluid-a 3s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[-10%] top-[35%] h-[85vh] w-[85vh] rounded-full mix-blend-screen blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 60% 50%, #f3f5f8 0%, #b6bccb 40%, #6f7689 70%, transparent 80%)",
          animation: "loader-fluid-b 3.4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-[25%] bottom-[-15%] h-[70vh] w-[70vh] rounded-full mix-blend-screen blur-3xl opacity-80"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #e8ecf3 0%, #98a2b8 45%, transparent 75%)",
          animation: "loader-fluid-c 3.8s ease-in-out infinite",
        }}
      />
      {/* Chromatic sheen */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          background:
            "conic-gradient(from 210deg at 50% 50%, rgba(255,255,255,0), rgba(200,220,255,0.5), rgba(180,160,220,0.35), rgba(255,255,255,0), rgba(200,220,255,0.5), rgba(255,255,255,0))",
          animation: "loader-spin 6s linear infinite",
          filter: "blur(40px)",
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Center content */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6">
        {/* Ticker line */}
        <div className="absolute left-6 top-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-white/60 sm:left-10 sm:top-10">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-white/80" />
          <span>nucleus · chrome · mmxxvi</span>
        </div>
        <div className="absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.35em] text-white/60 sm:right-10 sm:top-10">
          initializing · sequence
        </div>

        {/* Wordmark with reveal mask */}
        <div className="relative">
          <div
            className="font-display text-[22vw] leading-[0.85] tracking-[-0.045em] md:text-[16vw]"
            style={{
              background:
                "linear-gradient(90deg, #7a7a7a 0%, #ffffff 25%, #cfd8e8 45%, #ffffff 55%, #7a7a7a 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
              animation: "loader-shimmer 2.4s linear infinite",
              clipPath: `inset(0 ${100 - pct}% 0 0)`,
              transition: "clip-path 120ms linear",
            }}
          >
            nucleus
          </div>
          {/* Ghost outline underneath */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 font-display text-[22vw] leading-[0.85] tracking-[-0.045em] md:text-[16vw]"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.10)",
            }}
          >
            nucleus
          </div>
        </div>

        {/* Progress row */}
        <div className="mt-10 flex w-full max-w-md items-center gap-4 px-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60 tabular-nums">
            {String(pct).padStart(3, "0")}
          </span>
          <div className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 left-0"
              style={{
                width: `${pct}%`,
                background:
                  "linear-gradient(90deg, #7a7a7a, #ffffff, #cfd8e8, #ffffff)",
                boxShadow: "0 0 16px rgba(200,220,255,0.7)",
                transition: "width 120ms linear",
              }}
            />
            <div
              className="absolute inset-y-0"
              style={{
                left: `${pct}%`,
                width: "40px",
                transform: "translateX(-100%)",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                filter: "blur(2px)",
              }}
            />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
            /100
          </span>
        </div>

        <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
          {pct < 30 ? "loading assets" : pct < 65 ? "casting chrome" : pct < 95 ? "polishing surface" : "ready"}
        </div>
      </div>

      <style>{`
        @keyframes loader-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes loader-fluid-a {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(10vw, 6vh) scale(1.15); }
        }
        @keyframes loader-fluid-b {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-12vw, -4vh) scale(1.1); }
        }
        @keyframes loader-fluid-c {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-6vw, -10vh) scale(1.2); }
        }
        @keyframes loader-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * Bind a ref to a DOM element and return a scroll-linked `progress`
 * value in `[0, 1]` representing how far past the top of the viewport
 * the element's bottom edge has traveled.
 *
 * Callers typically feed the returned progress into a `translateY` or
 * `rotate` transform to drive parallax:
 *
 * ```tsx
 * const [ref, p] = useScrollTransform<HTMLDivElement>();
 * const y = (p - 0.5) * -60;
 * ```
 *
 * Uses `useLayoutEffect` so the initial value is measured before the
 * browser paints, avoiding a one-frame flash.
 *
 * @returns Tuple of `[ref, progress]`.
 */
export function useScrollTransform<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh;
      const p = 1 - (r.bottom / total);
      setProgress(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return [ref, progress] as const;
}

/**
 * Decorative SVG "melt" divider — a soft chrome-tinted wave used
 * between full-bleed sections. Purely visual (`aria-hidden`).
 *
 * @param flip - When `true`, mirrors the wave vertically so it can
 *   sit at the bottom of a section instead of the top.
 */
export function MeltDivider({ flip = false }: { flip?: boolean }): ReactNode {
  return (
    <div
      aria-hidden
      className="relative h-16 w-full overflow-hidden"
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
    >
      <svg
        className="absolute inset-x-0 top-0 h-full w-full"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 Q150,60 300,20 T600,30 T900,15 T1200,40 L1200,0 Z"
          fill="url(#meltG)"
          opacity="0.35"
        />
        <defs>
          <linearGradient id="meltG" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="0.5" stopColor="#cfd8e8" stopOpacity="0.25" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
