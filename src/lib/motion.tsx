import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PropsWithChildren,
  type ReactNode,
} from "react";

/* -------------------------------------------------- */
/* Scroll reveal — IntersectionObserver               */
/* -------------------------------------------------- */
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

/* -------------------------------------------------- */
/* Split text — letter stagger reveal                 */
/* -------------------------------------------------- */
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

/* -------------------------------------------------- */
/* Magnetic — element pulls toward cursor             */
/* -------------------------------------------------- */
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

/* -------------------------------------------------- */
/* Tilt3D — perspective hover                         */
/* -------------------------------------------------- */
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

/* -------------------------------------------------- */
/* Cursor spotlight — follows mouse                   */
/* -------------------------------------------------- */
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

/* -------------------------------------------------- */
/* Scroll progress bar (top of viewport)              */
/* -------------------------------------------------- */
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

/* -------------------------------------------------- */
/* Page loader — chrome intro                         */
/* -------------------------------------------------- */
export function PageLoader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center bg-background"
      style={{
        transition: "opacity .7s ease, transform 1s cubic-bezier(.22,1,.36,1), clip-path 1s cubic-bezier(.7,0,.3,1)",
        clipPath: done ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
        opacity: done ? 0 : 1,
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="font-display text-6xl text-chrome md:text-8xl">
          <SplitText text="nucleus" step={80} />
        </div>
        <div className="h-[1px] w-40 overflow-hidden bg-white/10">
          <div
            className="h-full"
            style={{
              width: "40%",
              background: "linear-gradient(90deg, transparent, #fff, transparent)",
              animation: "loader-sweep 1.2s ease-in-out infinite",
            }}
          />
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          initializing chrome
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* useScrollTransform — scroll-linked value            */
/* -------------------------------------------------- */
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

/* -------------------------------------------------- */
/* Section melt divider                                */
/* -------------------------------------------------- */
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
