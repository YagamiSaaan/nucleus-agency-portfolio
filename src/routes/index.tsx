import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

import aboutChrome from "@/assets/chrome-tiger-cutout.png";
import contactChrome from "@/assets/chrome-cd-cutout.png";
import chromeBlob from "@/assets/chrome-blob.jpg";
import chromeStar from "@/assets/chrome-star.png";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import {
  Reveal,
  SplitText,
  Magnetic,
  Tilt3D,
  CursorSpotlight,
  ScrollProgress,
  PageLoader,
  MeltDivider,
  useScrollTransform,
} from "@/lib/motion";

export const Route = createFileRoute("/")({
  component: Index,
});

function useMouseParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setPos({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return pos;
}

function ChromeCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let x = 0, y = 0, tx = 0, ty = 0;
    const move = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    window.addEventListener("mousemove", move);
    let raf = 0;
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-8 w-8 rounded-full md:block"
      style={{
        background: "radial-gradient(circle at 30% 30%, #ffffff 0%, #d9d9d9 40%, #7a7a7a 80%)",
        boxShadow: "0 0 24px rgba(200,220,255,0.5), inset 0 0 12px rgba(0,0,0,0.4)",
        mixBlendMode: "difference",
      }}
    />
  );
}

function Nav() {
  const items = [
    { label: "Work", id: "work" },
    { label: "About", id: "about" },
    { label: "Process", id: "process" },
    { label: "Contact", id: "contact" },
  ];
  const [active, setActive] = useState<string>("top");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["top", ...items.map((i) => i.id)];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div
        className={`mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-10 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
      >
        <a href="#top" className="font-display text-2xl tracking-tight text-chrome shrink-0">
          nucleus<span className="text-accent">◆</span>
        </a>
        <nav
          className="relative hidden items-center gap-1 rounded-full px-1.5 py-1.5 md:flex chrome-border shine-sweep"
          style={{
            background:
              "linear-gradient(180deg, #f5f5f5 0%, #d9d9d9 40%, #8a8a8a 70%, #cfcfcf 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.35), 0 8px 24px -12px rgba(0,0,0,0.6)",
          }}
        >
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-text={item.label}
                className={`relative rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] transition-colors ${isActive ? "text-black" : "text-black/60 hover:text-black"}`}
              >
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(180deg, #ffffff 0%, #e6e6e6 45%, #b8b8b8 100%)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.25)",
                    }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Magnetic strength={0.3}>
            <a
              href="#contact"
              className="group relative hidden overflow-hidden rounded-full shine-sweep chrome-border px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-black md:inline-block"
              style={{
                background:
                  "linear-gradient(180deg, #ffffff 0%, #dcdcdc 45%, #8a8a8a 80%, #cfcfcf 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,0,0,0.35), 0 10px 30px -12px rgba(200,220,255,0.45)",
              }}
            >
              Let&apos;s Talk
            </a>
          </Magnetic>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full glass chrome-border md:hidden"
          >
            <div className="flex flex-col gap-1.5">
              <span className={`h-px w-4 bg-foreground transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
              <span className={`h-px w-4 bg-foreground transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>
      <div
        className={`mx-6 origin-top overflow-hidden rounded-3xl chrome-border transition-all duration-500 md:hidden ${open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}
        style={{
          background:
            "linear-gradient(180deg, #f5f5f5 0%, #d9d9d9 40%, #8a8a8a 70%, #cfcfcf 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.35), 0 8px 24px -12px rgba(0,0,0,0.6)",
        }}
      >
        <nav className="flex flex-col p-6">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="border-b border-black/20 py-3 font-display text-2xl text-black last:border-b-0"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-4 rounded-full chrome-border px-5 py-3 text-center text-xs uppercase tracking-[0.2em] text-black"
            style={{
              background:
                "linear-gradient(180deg, #ffffff 0%, #e6e6e6 45%, #b8b8b8 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.25)",
            }}
          >
            Let&apos;s Talk
          </a>
        </nav>
      </div>
    </header>
  );
}

/* Shared button primitives — consistent chrome feel across the site */
function ChromeButton({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  className = "",
  external,
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
}) {
  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-sm",
  } as const;
  const base = `group relative inline-flex items-center gap-2 overflow-hidden rounded-full uppercase tracking-[0.2em] transition-all duration-500 hover:-translate-y-0.5 ${sizes[size]} ${className}`;
  const variants = {
    primary:
      "chrome-border glass shine-sweep border-trace text-foreground hover:shadow-[0_10px_40px_-10px_rgba(200,220,255,0.35)]",
    ghost:
      "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40",
  } as const;
  const cls = `${base} ${variants[variant]}`;
  if (href) {
    const isExternal =
      external ??
      (/^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:"));
    return (
      <Magnetic strength={0.28}>
        <a
          href={href}
          className={cls}
          target={isExternal && !href.startsWith("mailto:") && !href.startsWith("tel:") ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          <span className="relative">{children}</span>
        </a>
      </Magnetic>
    );
  }
  return (
    <Magnetic strength={0.28}>
      <button type="button" onClick={onClick} className={cls}>
        <span className="relative">{children}</span>
      </button>
    </Magnetic>
  );
}

function SilverFluid() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base metallic wash */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(210,220,235,0.35), transparent 55%), radial-gradient(ellipse at 80% 60%, rgba(180,200,230,0.30), transparent 55%), radial-gradient(ellipse at 50% 90%, rgba(150,170,200,0.25), transparent 60%)",
        }}
      />
      {/* Flowing silver blobs */}
      <div
        className="absolute -left-[20%] top-[10%] h-[70vh] w-[70vh] rounded-full mix-blend-screen blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, #f3f5f8 0%, #cfd6e2 30%, #8a92a8 60%, transparent 75%)",
          animation: "fluid-a 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[-15%] top-[35%] h-[80vh] w-[80vh] rounded-full mix-blend-screen blur-3xl opacity-90"
        style={{
          background:
            "radial-gradient(circle at 60% 50%, #ffffff 0%, #d9dee7 25%, #98a2b8 55%, transparent 75%)",
          animation: "fluid-b 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-[30%] bottom-[-10%] h-[65vh] w-[65vh] rounded-full mix-blend-screen blur-3xl opacity-80"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #e8ecf3 0%, #b6bccb 40%, #6f7689 70%, transparent 80%)",
          animation: "fluid-c 26s ease-in-out infinite",
        }}
      />
      {/* Chromatic shimmer sheen */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          background:
            "conic-gradient(from 210deg at 50% 50%, rgba(255,255,255,0.0), rgba(200,220,255,0.35), rgba(180,160,220,0.25), rgba(255,255,255,0.0), rgba(200,220,255,0.35), rgba(255,255,255,0.0))",
          animation: "fluid-spin 40s linear infinite",
          filter: "blur(40px)",
        }}
      />
      <style>{`
        @keyframes fluid-a {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(12vw, 8vh) scale(1.15); }
        }
        @keyframes fluid-b {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-14vw, -6vh) scale(1.1); }
        }
        @keyframes fluid-c {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-8vw, -12vh) scale(1.2); }
        }
        @keyframes fluid-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function Hero() {
  const { x, y } = useMouseParallax();

  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden pt-24 md:pt-28">
      <SilverFluid />
      <div className="pointer-events-none absolute inset-0 radial-glow" />

      <img
        src={chromeStar}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[6%] top-[22%] hidden h-40 w-40 float-slow md:block"
        style={{ transform: `translate(${x * 30}px, ${y * 30}px)`, filter: "drop-shadow(0 0 30px rgba(180,200,255,0.4))" }}
      />
      <img
        src={chromeStar}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-[65%] hidden h-24 w-24 float-slower md:block"
        style={{ transform: `translate(${x * -20}px, ${y * -20}px)`, filter: "drop-shadow(0 0 20px rgba(180,200,255,0.5))" }}
      />

      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10">
        <div className="relative">
          <h1 className="font-display text-[22vw] leading-[0.85] tracking-[-0.045em] chrome-shimmer md:text-[16vw]">
            <SplitText text="Nucleus" step={70} />
          </h1>
        </div>

        <div className="relative mt-6 grid grid-cols-12 items-start gap-6 md:gap-10">
          <Reveal delay={200} className="col-span-12 space-y-2 md:col-span-6 md:pt-8">
            <div className="pt-4 font-sans-tight text-3xl font-light leading-[0.95] sm:text-4xl md:text-5xl">
              <div className="text-chrome">Brand</div>
              <div className="text-chrome-cyber">Digital</div>
              <div className="text-chrome">Motion</div>
            </div>
            <p className="max-w-md pt-6 text-sm leading-relaxed text-muted-foreground md:text-base">
              A design agency sculpting brands and interfaces at the frontier of luxury and futurism.
            </p>
          </Reveal>

          <Reveal delay={600} className="col-span-12 text-left md:col-span-6 md:pt-4 md:text-right">
            <div className="font-display text-[22vw] leading-[0.85] tracking-[-0.04em] text-chrome-cyber md:text-[9vw]">
              <SplitText text="Stu" step={80} delay={400} />
              <div><SplitText text="di" step={80} delay={560} /></div>
              <div className="italic"><SplitText text="o" step={80} delay={720} /></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:gap-4 sm:tracking-[0.3em] md:justify-end">
              <span>ig · nucleus</span>
              <span>tg · nucleus</span>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 md:mt-24">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            [ scroll · v.2026 ]
          </div>
          <div className="hidden gap-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground lg:flex">
            <span>◆ Awwwards Nominee</span>
            <span>◆ Selected Works</span>
            <span>◆ Available Q1</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground pulse-glow">
            ↓ discover
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Immersive", "◆", "Editorial", "◆", "Chrome", "◆", "Cyber Luxury", "◆", "Motion", "◆", "Interfaces", "◆", "Brutalism", "◆"];
  return (
    <section aria-hidden className="relative border-y border-border py-6">
      <div className="marquee whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((t, i) => (
          <span key={i} className="mx-8 font-display text-4xl italic text-chrome md:text-6xl">
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

function About() {
  const specialties = ["UI Design", "UX Design", "Web Design", "Branding", "Product Design", "Creative Direction"];
  const [tigerRef, tigerProgress] = useScrollTransform<HTMLDivElement>();
  const tigerY = (tigerProgress - 0.5) * -60;
  const tigerRot = (tigerProgress - 0.5) * 8;
  return (
    <section id="about" className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-6 md:px-10 md:py-32">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-3 md:mb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">[ 01 · about ]</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">who / behind / the chrome</span>
      </div>
      <div className="grid grid-cols-12 gap-10 md:gap-20">
        <Reveal className="col-span-12 md:col-span-5">
          <div ref={tigerRef} className="relative" style={{ transform: `translateY(${tigerY}px) rotate(${tigerRot}deg)` }}>
            <img
              src={aboutChrome}
              alt="Chrome tiger"
              loading="lazy"
              width={1600}
              height={1600}
              className="relative z-10 h-auto w-[calc(100%+1.25rem)] -ml-5 select-none sm:-ml-6 sm:w-[calc(100%+1.5rem)] md:-ml-10 md:w-[calc(130%+2.5rem)] md:max-w-none"
              style={{ filter: "drop-shadow(0 40px 100px rgba(120,160,220,0.25)) drop-shadow(0 0 60px rgba(200,220,255,0.12))" }}
            />
          </div>
        </Reveal>

        <div className="col-span-12 md:col-span-7 md:pl-12">
          <Reveal>
            <h2 className="font-display text-4xl leading-[0.98] tracking-tight text-chrome sm:text-5xl md:text-7xl">
              We sculpt <span className="italic text-chrome-cyber">immersive</span> brands and interfaces at the intersection of aesthetics, strategy and modern interaction.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
              A studio turning ambitious ideas into products that feel like objects — polished, kinetic, unmistakable. Every engagement begins with a story and ends with pixels that move like liquid metal.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3">
            {specialties.map((s, i) => (
              <Reveal key={s} delay={i * 60}>
                <div className="glass chrome-border shine-sweep border-trace rounded-2xl px-5 py-4 transition-transform duration-500 hover:-translate-y-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">◆</span>
                  <div className="mt-1 font-sans-tight text-sm text-foreground">{s}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-8 border-t border-border pt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <div><div className="text-2xl font-light text-foreground">80+</div>projects shipped</div>
            <div><div className="text-2xl font-light text-foreground">24</div>global clients</div>
            <div><div className="text-2xl font-light text-foreground">06</div>years crafting</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: "01", t: "Discover", d: "Research, mapping and material references. Understanding the object before shaping it." },
    { n: "02", t: "Strategy", d: "Positioning, hierarchy and narrative. Where the surface meets the intent." },
    { n: "03", t: "Design", d: "Systems, states and reflections. Interfaces cast in polished glass and chrome." },
    { n: "04", t: "Delivery", d: "Prototype, ship and refine. Motion, code and craft handed off with care." },
  ];
  return (
    <section id="process" className="relative border-t border-border">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-6 md:px-10 md:py-32">
        {/* Sticky pinned heading */}
        <div className="mb-10 md:sticky md:top-24 md:z-10 md:mb-8 md:bg-background/60 md:backdrop-blur-xl">
          <div className="flex flex-wrap items-end justify-between gap-3 py-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">[ 02 · process ]</span>
            <h2 className="font-display text-3xl italic text-chrome sm:text-4xl md:text-6xl">stages of the craft</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <Tilt3D>
                <div className="group relative h-full overflow-hidden rounded-3xl glass-strong chrome-border shine-sweep border-trace p-8 transition-transform duration-500 hover:-translate-y-2">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-50"
                       style={{ background: "radial-gradient(circle, rgba(200,220,255,0.8), transparent)" }} />
                  <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">{s.n}</div>
                  <h3 className="mt-16 font-display text-3xl text-chrome sm:text-4xl md:mt-24">{s.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                  <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
                </div>
              </Tilt3D>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const featured = [
  { n: "01", title: "Rebranding · Cinema", cat: "Web · Motion", year: "2025", img: project2, tags: ["Editorial", "Streaming", "Dark UI"], caseUrl: "mailto:hello@nucleus.io?subject=Case%20study%20—%20Rebranding%20Cinema", liveUrl: "https://mubi.com" },
  { n: "02", title: "The Last Rooms", cat: "Product · UX", year: "2025", img: project1, tags: ["Dashboard", "Data", "System"], caseUrl: "mailto:hello@nucleus.io?subject=Case%20study%20—%20The%20Last%20Rooms", liveUrl: "https://linear.app" },
];

function Featured() {
  return (
    <section id="work" className="relative border-t border-border">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-6 md:px-10 md:py-32">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-16">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">[ 03 · featured ]</span>
            <h2 className="mt-3 font-display text-4xl text-chrome sm:text-5xl md:text-7xl">
              <SplitText text="Selected " step={50} />
              <span className="italic text-chrome-cyber"><SplitText text="Works" step={50} delay={250} /></span>
            </h2>
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:block">two selected pieces</span>
        </div>

        <div className="space-y-20 md:space-y-32">
          {featured.map((p, i) => (
            <div key={p.n} className="group grid grid-cols-12 items-center gap-6 md:gap-16">
              <Reveal className={`col-span-12 md:col-span-7 ${i % 2 ? "md:order-2" : ""}`}>
                <div className="px-0 py-4 md:px-8 md:py-10">
                  <Tilt3D max={6}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl chrome-border sm:aspect-[3/2]">
                      <img src={p.img} alt={p.title} loading="lazy" width={1200} height={800} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                    </div>
                  </Tilt3D>
                </div>
              </Reveal>
              <Reveal delay={150} className={`col-span-12 md:col-span-5 md:px-6 ${i % 2 ? "md:order-1" : ""}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-[5rem] leading-none text-chrome/40 sm:text-[7rem] md:text-[8rem]">{p.n}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{p.year}</span>
                </div>
                <h3 className="mt-4 font-display text-3xl text-chrome sm:text-4xl md:text-5xl">{p.title}</h3>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{p.cat}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{t}</span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ChromeButton href={p.caseUrl} variant="primary">View Case</ChromeButton>
                  <ChromeButton href={p.liveUrl} variant="ghost">Live ↗</ChromeButton>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OtherWork() {
  return (
    <section className="relative border-t border-border">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-6 md:px-10 md:py-32">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-3 md:mb-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">[ 05 · other ]</span>
          <h2 className="font-display text-3xl italic text-chrome sm:text-4xl md:text-6xl">other works</h2>
        </div>
        <Reveal>
          <Tilt3D max={4}>
            <Link
              to="/works"
              className="group relative block overflow-hidden rounded-3xl chrome-border shine-sweep border-trace p-8 transition-transform hover:-translate-y-1 sm:p-12 md:p-16"
              style={{
                background:
                  "linear-gradient(135deg, #f5f5f5 0%, #cfd6e2 30%, #8a92a8 60%, #cfcfcf 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -1px 0 rgba(0,0,0,0.35), 0 20px 60px -20px rgba(180,200,255,0.35)",
              }}
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/40 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />
              <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/60">◆ archive</div>
                  <h3 className="mt-4 font-display text-4xl leading-[0.95] text-black sm:text-5xl md:text-7xl">
                    10 more <span className="italic">web pieces</span>
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-black/70 md:text-base">
                    Explore an extended reel of interfaces, landing pages and experimental web work from the studio archive.
                  </p>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-black">
                  <span>Enter the archive</span>
                  <span className="text-2xl transition-transform duration-500 group-hover:translate-x-2">→</span>
                </div>
              </div>
            </Link>
          </Tilt3D>
        </Reveal>
      </div>
    </section>
  );
}


function Contact() {
  const links = [
    { name: "Instagram", handle: "@nucleus.ux", href: "https://instagram.com/nucleus.ux", external: true },
    { name: "Behance", handle: "/nucleus", href: "https://behance.net/nucleus", external: true },
    { name: "Dribbble", handle: "/nucleus", href: "https://dribbble.com/nucleus", external: true },
    { name: "LinkedIn", handle: "/in/nucleus", href: "https://linkedin.com/in/nucleus", external: true },
    { name: "Email", handle: "hello@nucleus.io", href: "mailto:hello@nucleus.io", external: false },
  ];
  const [discRef, discProgress] = useScrollTransform<HTMLDivElement>();
  const discRot = discProgress * 30;
  const discY = (discProgress - 0.5) * -40;
  return (
    <section id="contact" className="relative overflow-hidden border-t border-border">
      <div className="pointer-events-none absolute inset-0 radial-glow" />
      <img src={chromeStar} alt="" aria-hidden className="pointer-events-none absolute left-[10%] top-[20%] h-32 w-32 float-slow opacity-60" />
      <img src={chromeBlob} alt="" aria-hidden className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 opacity-40 mix-blend-screen float-slower" />

      <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-6 md:px-10 md:py-32">
        <div className="mb-10 md:mb-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">[ 06 · contact ]</span>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-8">
            <h2 className="font-display text-[14vw] leading-[0.9] tracking-[-0.04em] chrome-shimmer sm:text-[12vw] md:text-[10vw]">
              <SplitText text="Let’s " step={50} />
              <span className="italic text-chrome-cyber"><SplitText text="create" step={50} delay={250} /></span><br/>
              <SplitText text="something" step={50} delay={500} /><br/>
              <span className="italic"><SplitText text="exceptional." step={50} delay={750} /></span>
            </h2>
            <Reveal delay={200}>
              <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground">
                Whether it&apos;s an original interface, a rebrand, or a wild experimental idea — I&apos;m open for select collaborations. Reach out and let&apos;s shape it together.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <Magnetic strength={0.4}>
                <a
                  href="mailto:hello@nucleus.io"
                  className="mt-10 inline-flex items-center gap-4 rounded-full chrome-border glass-strong shine-sweep border-trace px-8 py-4 text-sm uppercase tracking-[0.2em] text-foreground"
                >
                  Start a project
                  <span className="text-chrome-cyber">→</span>
                </a>
              </Magnetic>
            </Reveal>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div
              ref={discRef}
              className="relative chrome-breathe"
              style={{ transform: `translateY(${discY}px) rotate(${discRot}deg)` }}
            >
              <img
                src={contactChrome}
                alt="Chrome disc"
                loading="lazy"
                width={1600}
                height={1600}
                className="h-auto w-full select-none md:w-[130%] md:max-w-none"
                style={{ filter: "drop-shadow(0 40px 100px rgba(120,160,220,0.3)) drop-shadow(0 0 80px rgba(200,220,255,0.15))" }}
              />
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-24 lg:grid-cols-5">
          {links.map((l, i) => (
            <Reveal key={l.name} delay={i * 80}>
              <Magnetic strength={0.25}>
                <a
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noopener noreferrer" : undefined}
                  className="group relative block overflow-hidden rounded-2xl glass chrome-border shine-sweep border-trace p-5 transition-transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-chrome text-2xl">◆</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">→</span>
                  </div>
                  <div className="mt-8 font-display text-2xl text-chrome">{l.name}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{l.handle}</div>
                </a>
              </Magnetic>
            </Reveal>
          ))}
        </div>

        <footer className="relative mt-24 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-muted/20 p-6 sm:p-8 md:mt-32 md:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-foreground/10 via-foreground/5 to-transparent blur-3xl chrome-breathe" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-gradient-to-tr from-foreground/[0.08] via-transparent to-transparent blur-3xl" />

          <Reveal>
            <div className="relative">
              <h2 className="chrome-shimmer font-display text-[18vw] leading-[0.85] tracking-tighter md:text-[14vw]">
                NUCLEUS
              </h2>
              <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                <span>chrome · series · mmxxvi</span>
                <span className="h-px flex-1 bg-gradient-to-l from-border to-transparent" />
              </div>
            </div>
          </Reveal>

          <div className="relative mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              {
                label: "navigate",
                items: [
                  { t: "index", href: "#top" },
                  { t: "work", href: "#work" },
                  { t: "process", href: "#process" },
                  { t: "contact", href: "#contact" },
                ],
              },
              {
                label: "channels",
                items: [
                  { t: "telegram", href: "https://t.me/nucleus", external: true },
                  { t: "instagram", href: "https://instagram.com/nucleus.ux", external: true },
                  { t: "read.cv", href: "https://read.cv/nucleus", external: true },
                  { t: "are.na", href: "https://are.na/nucleus", external: true },
                ],
              },
              {
                label: "signals",
                items: [
                  { t: "studio log", href: "mailto:hello@nucleus.io?subject=Studio%20log" },
                  { t: "field notes", href: "mailto:hello@nucleus.io?subject=Field%20notes" },
                  { t: "press kit", href: "mailto:press@nucleus.io" },
                  { t: "colophon", href: "#about" },
                ],
              },
              {
                label: "contact",
                items: [
                  { t: "hello@nucleus.io", href: "mailto:hello@nucleus.io" },
                  { t: "+1 (415) 000·0000", href: "tel:+14150000000" },
                  { t: "san francisco", href: "https://maps.google.com/?q=San+Francisco", external: true },
                  { t: "by appointment", href: "mailto:hello@nucleus.io?subject=Appointment" },
                ],
              },
            ].map((col, i) => (
              <Reveal key={col.label} delay={i * 80}>
                <div className="flex flex-col gap-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                    ◆ {col.label}
                  </div>
                  <ul className="flex flex-col gap-2">
                    {col.items.map((item) => (
                      <li key={item.t}>
                        <a
                          href={item.href}
                          target={"external" in item && item.external ? "_blank" : undefined}
                          rel={"external" in item && item.external ? "noopener noreferrer" : undefined}
                          className="chromatic-hover font-mono text-xs uppercase tracking-[0.2em] text-foreground/80 transition-colors hover:text-foreground"
                        >
                          {item.t}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="relative mt-16 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-foreground/70" />
              <span>available · q3 mmxxvi</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <span>© mmxxvi · nucleus</span>
              <span>site v.2.4</span>
              <span>◆ forged in liquid metal</span>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground noise">
      <PageLoader />
      <ScrollProgress />
      <CursorSpotlight />
      <ChromeCursor />
      <Nav />
      <main>
        <Hero />
        <MeltDivider />
        <Marquee />
        <MeltDivider flip />
        <About />
        <Process />
        <Featured />
        <OtherWork />
        <Contact />
      </main>
    </div>
  );
}
