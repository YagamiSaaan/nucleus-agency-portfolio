import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import heroChrome from "@/assets/chrome-skull-cutout.png";
import aboutChrome from "@/assets/chrome-tiger-cutout.png";
import contactChrome from "@/assets/chrome-cd-cutout.png";
import chromeBlob from "@/assets/chrome-blob.jpg";
import chromeStar from "@/assets/chrome-star.png";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

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
  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10">
        <a href="#top" className="font-display text-2xl tracking-tight text-chrome">akkira<span className="text-accent">◆</span></a>
        <nav className="hidden items-center gap-1 rounded-full glass px-2 py-2 md:flex">
          {["Work", "About", "Process", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item}
            </a>
          ))}
        </nav>
        <a href="#contact" className="group relative overflow-hidden rounded-full chrome-border glass shine-sweep px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-foreground">
          Let&apos;s Talk
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const { x, y } = useMouseParallax();
  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden pt-28">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 radial-glow" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
           style={{ background: "radial-gradient(circle, rgba(150,180,255,0.35), transparent 65%)" }} />

      {/* Floating chrome elements */}
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
      <img
        src={chromeBlob}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-24 top-[15%] hidden h-72 w-72 float-slower opacity-70 mix-blend-screen md:block"
        style={{ transform: `translate(${x * -40}px, ${y * -20}px) rotate(-15deg)` }}
      />
      <img
        src={chromeBlob}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-[8%] hidden h-56 w-56 float-slow opacity-60 mix-blend-screen md:block"
        style={{ transform: `translate(${x * 40}px, ${y * 20}px) rotate(30deg)` }}
      />

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-10">
        {/* Massive PORTFOLIO title */}
        <div className="relative">
          <h1 className="reveal-up font-display text-[22vw] leading-[0.85] tracking-[-0.04em] text-chrome md:text-[15vw]">
            Portfolio
          </h1>
        </div>

        {/* Center portrait + DESIGNER */}
        <div className="relative -mt-[8vw] grid grid-cols-12 items-start gap-6">
          {/* Left: UX / UI / WEB */}
          <div className="reveal-up col-span-6 space-y-2 pt-8 md:col-span-3" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px w-6 bg-gradient-to-r from-transparent via-foreground/60 to-transparent" />
              since 2019
            </div>
            <div className="pt-4 font-sans-tight text-3xl font-light leading-none md:text-4xl">
              <div className="text-chrome">UX</div>
              <div className="text-chrome-cyber">UI</div>
              <div className="text-chrome">Web</div>
            </div>
            <p className="max-w-xs pt-6 text-sm text-muted-foreground">
              Creative designer sculpting digital experiences at the frontier of luxury and futurism.
            </p>
          </div>

          {/* Center chrome subject — no card, bleeds into section */}
          <div className="reveal-up col-span-12 md:col-span-6" style={{ animationDelay: "0.4s" }}>
            <div
              className="relative mx-auto w-full max-w-[720px]"
              style={{ transform: `translate(${x * -14}px, ${y * -14}px)` }}
            >
              <img
                src={heroChrome}
                alt="Chrome skull"
                width={1600}
                height={1600}
                className="h-auto w-full select-none"
                style={{ filter: "drop-shadow(0 40px 80px rgba(120,160,220,0.25)) drop-shadow(0 0 40px rgba(200,220,255,0.15))" }}
              />
              <div className="mt-4 flex items-end justify-between px-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span>MRK · 001 / chrome_series</span>
                <span className="font-display text-xl italic normal-case text-chrome">akkira</span>
              </div>
            </div>
          </div>



          {/* Right: DESIGNER stacked */}
          <div className="reveal-up col-span-6 pt-4 text-right md:col-span-3" style={{ animationDelay: "0.6s" }}>
            <div className="font-display text-[14vw] leading-[0.85] tracking-[-0.04em] text-chrome-cyber md:text-[6vw]">
              <div>De</div>
              <div>si</div>
              <div className="italic">gner</div>
            </div>
            <div className="mt-4 flex justify-end gap-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span>ig · akkira</span>
              <span>tg · akkira</span>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="mt-24 flex items-center justify-between border-t border-border pt-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            [ scroll · v.2026 ]
          </div>
          <div className="hidden gap-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:flex">
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
  return (
    <section id="about" className="relative mx-auto max-w-[1600px] px-6 py-32 md:px-10">
      <div className="mb-16 flex items-end justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">[ 01 · about ]</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">who / behind / the chrome</span>
      </div>
      <div className="grid grid-cols-12 gap-12 md:gap-20">
        <div className="col-span-12 md:col-span-5">
          <div className="relative">
            <img
              src={aboutChrome}
              alt="Chrome tiger"
              loading="lazy"
              width={1600}
              height={1600}
              className="relative z-10 h-auto w-full select-none md:-ml-16 md:w-[130%] md:max-w-none"
              style={{ filter: "drop-shadow(0 40px 100px rgba(120,160,220,0.25)) drop-shadow(0 0 60px rgba(200,220,255,0.12))" }}
            />
          </div>
        </div>


        <div className="col-span-12 md:col-span-7 md:pl-12">
          <h2 className="font-display text-5xl leading-[0.95] tracking-tight text-chrome md:text-7xl">
            I sculpt <span className="italic text-chrome-cyber">immersive</span> digital experiences at the intersection of aesthetics, strategy and modern interaction.
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
            Six years turning ambitious ideas into interfaces that feel like objects — polished, kinetic, unmistakable. Everything begins with a story and ends with pixels that move like liquid metal.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3">
            {specialties.map((s) => (
              <div key={s} className="glass chrome-border shine-sweep rounded-2xl px-5 py-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">◆</span>
                <div className="mt-1 font-sans-tight text-sm text-foreground">{s}</div>
              </div>
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
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-10">
        <div className="mb-16 flex items-end justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">[ 02 · process ]</span>
          <h2 className="font-display text-4xl italic text-chrome md:text-6xl">stages of the craft</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="group relative overflow-hidden rounded-3xl glass-strong chrome-border shine-sweep p-8 transition-transform duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-50"
                   style={{ background: "radial-gradient(circle, rgba(200,220,255,0.8), transparent)" }} />
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">{s.n}</div>
              <h3 className="mt-24 font-display text-4xl text-chrome">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const featured = [
  { n: "01", title: "Rebranding · Cinema", cat: "Web · Motion", year: "2025", img: project2, tags: ["Editorial", "Streaming", "Dark UI"] },
  { n: "02", title: "The Last Rooms", cat: "Product · UX", year: "2025", img: project1, tags: ["Dashboard", "Data", "System"] },
];

function Featured() {
  return (
    <section id="work" className="relative border-t border-border">
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-10">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">[ 03 · featured ]</span>
            <h2 className="mt-3 font-display text-5xl text-chrome md:text-7xl">Selected <span className="italic text-chrome-cyber">Works</span></h2>
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:block">two selected pieces</span>
        </div>

        <div className="space-y-24 md:space-y-32">
          {featured.map((p, i) => (
            <div key={p.n} className={`group grid grid-cols-12 items-center gap-8 md:gap-16 ${i % 2 ? "md:flex-row-reverse" : ""}`}>
              <div className={`col-span-12 md:col-span-7 ${i % 2 ? "md:order-2" : ""}`}>
                <div className="px-4 py-6 md:px-8 md:py-10">
                  <div className="relative overflow-hidden rounded-2xl chrome-border">
                    <img src={p.img} alt={p.title} loading="lazy" width={1200} height={800} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
              <div className={`col-span-12 md:col-span-5 md:px-6 ${i % 2 ? "md:order-1" : ""}`}>
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-[8rem] leading-none text-chrome/40">{p.n}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{p.year}</span>
                </div>
                <h3 className="mt-4 font-display text-4xl text-chrome md:text-5xl">{p.title}</h3>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{p.cat}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{t}</span>
                  ))}
                </div>
                <div className="mt-8 flex gap-3">
                  <button className="group/btn relative overflow-hidden rounded-full chrome-border glass shine-sweep px-6 py-3 text-xs uppercase tracking-[0.2em] text-foreground">
                    View Case
                  </button>
                  <button className="rounded-full border border-border px-6 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
                    Live ↗
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const grid = [
  { title: "Skyline OS", cat: "Product Design", year: "2025", img: project1 },
  { title: "Aureate Studio", cat: "Branding", year: "2025", img: project3 },
  { title: "Halo Commerce", cat: "Web Design", year: "2024", img: project2 },
  { title: "Nova Mobile", cat: "App Design", year: "2024", img: project4 },
];

function Grid() {
  return (
    <section id="grid" className="relative border-t border-border">
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-10">
        <div className="mb-16">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">[ 04 · archive ]</span>
          <h2 className="mt-3 font-display text-5xl text-chrome md:text-7xl">Recent <span className="italic text-chrome-cyber">Projects</span></h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {grid.map((p) => (
            <a key={p.title} href="#" className="group relative block overflow-hidden rounded-3xl chrome-border glass">
              <div className="relative aspect-[16/11] overflow-hidden">
                <img src={p.img} alt={p.title} loading="lazy" width={1200} height={800} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                     style={{ background: "linear-gradient(115deg, transparent 40%, rgba(200,220,255,0.15) 50%, transparent 60%)" }} />
              </div>
              <div className="flex items-end justify-between p-6">
                <div>
                  <h3 className="font-display text-3xl text-chrome">{p.title}</h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{p.cat}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{p.year}</div>
                  <div className="mt-2 font-display text-2xl italic text-chrome-cyber">↗</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function OtherWork() {
  const items = [
    { t: "Branding", i: "◆" },
    { t: "Apps", i: "▲" },
    { t: "Posters", i: "■" },
    { t: "3D", i: "●" },
    { t: "Motion", i: "◐" },
  ];
  return (
    <section className="relative border-t border-border">
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-10">
        <div className="mb-12 flex items-end justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">[ 05 · other ]</span>
          <h2 className="font-display text-4xl italic text-chrome md:text-6xl">other works</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {items.map((it) => (
            <div key={it.t} className="group relative aspect-square overflow-hidden rounded-2xl glass chrome-border shine-sweep p-6 transition-transform hover:-translate-y-1">
              <div className="relative flex h-full flex-col justify-between">
                <div className="text-chrome text-4xl">{it.i}</div>
                <div>
                  <div className="font-display text-2xl text-chrome">{it.t}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">08 pieces</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function Contact() {
  const links = [
    { name: "Instagram", handle: "@akkira.ux", href: "#" },
    { name: "Behance", handle: "/akkira", href: "#" },
    { name: "Dribbble", handle: "/akkira", href: "#" },
    { name: "LinkedIn", handle: "/in/akkira", href: "#" },
    { name: "Email", handle: "hello@akkira.io", href: "mailto:hello@akkira.io" },
  ];
  return (
    <section id="contact" className="relative overflow-hidden border-t border-border">
      <div className="pointer-events-none absolute inset-0 radial-glow" />
      <img src={chromeStar} alt="" aria-hidden className="pointer-events-none absolute left-[10%] top-[20%] h-32 w-32 float-slow opacity-60" />
      <img src={chromeBlob} alt="" aria-hidden className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 opacity-40 mix-blend-screen float-slower" />

      <div className="relative mx-auto max-w-[1600px] px-6 py-32 md:px-10">
        <div className="mb-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">[ 06 · contact ]</span>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-8">
            <h2 className="font-display text-[16vw] leading-[0.85] tracking-[-0.04em] text-chrome md:text-[10vw]">
              Let&apos;s <span className="italic text-chrome-cyber">create</span><br/>
              something<br/>
              <span className="italic">exceptional.</span>
            </h2>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground">
              Whether it&apos;s an original interface, a rebrand, or a wild experimental idea — I&apos;m open for select collaborations. Reach out and let&apos;s shape it together.
            </p>
            <a
              href="mailto:hello@akkira.io"
              className="mt-10 inline-flex items-center gap-4 rounded-full chrome-border glass-strong shine-sweep px-8 py-4 text-sm uppercase tracking-[0.2em] text-foreground"
            >
              Start a project
              <span className="text-chrome-cyber">→</span>
            </a>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="mx-auto w-full max-w-sm px-6 py-10 md:px-8 md:py-12">
              <div className="relative aspect-square w-full overflow-hidden rounded-full chrome-border">
                <img src={contactChrome} alt="Contact portrait" loading="lazy" width={1024} height={1024} className="h-full w-full object-cover" />
                <div className="absolute inset-0 rounded-full" style={{ boxShadow: "inset 0 0 100px rgba(0,0,0,0.7)" }} />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-display text-2xl italic text-chrome">akkira</div>
              </div>
            </div>
          </div>

        </div>

        {/* Contact cards */}
        <div className="mt-24 grid grid-cols-2 gap-3 md:grid-cols-5">
          {links.map((l) => (
            <a
              key={l.name}
              href={l.href}
              className="group relative overflow-hidden rounded-2xl glass chrome-border shine-sweep p-5 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-chrome text-2xl">◆</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">→</span>
              </div>
              <div className="mt-8 font-display text-2xl text-chrome">{l.name}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{l.handle}</div>
            </a>
          ))}
        </div>

        <footer className="mt-24 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:flex-row md:items-center">
          <div>© 2026 · akkira · chrome series</div>
          <div className="flex gap-6">
            <span>site v.2.4</span>
            <span>◆ made with liquid metal</span>
            <span>tg · @akkira</span>
          </div>
        </footer>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground noise">
      <ChromeCursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Process />
        <Featured />
        
        <OtherWork />
        <Contact />
      </main>
    </div>
  );
}
