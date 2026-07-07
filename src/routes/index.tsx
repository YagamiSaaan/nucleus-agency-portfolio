import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import heroChrome from "@/assets/chrome-skull-full.png";
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
  const items = ["Work", "About", "Process", "Contact"];
  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10">
        <a href="#top" className="font-display text-2xl tracking-tight text-chrome">nucleus<span className="text-accent">◆</span></a>
        <nav className="hidden items-center gap-1 rounded-full glass px-2 py-2 md:flex">
          {items.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              data-text={item}
              className="chromatic-hover rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item}
            </a>
          ))}
        </nav>
        <Magnetic strength={0.3}>
          <a href="#contact" className="group relative overflow-hidden rounded-full chrome-border glass shine-sweep border-trace px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-foreground">
            Let&apos;s Talk
          </a>
        </Magnetic>
      </div>
    </header>
  );
}

function Hero() {
  const { x, y } = useMouseParallax();
  const [skullRef, skullProgress] = useScrollTransform<HTMLDivElement>();
  // Scroll-linked scale/rotate on the skull
  const scale = 1 + skullProgress * 0.15;
  const rotate = skullProgress * -6;
  const yOffset = skullProgress * -40;

  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden pt-28">
      <div className="pointer-events-none absolute inset-0 radial-glow" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
           style={{ background: "radial-gradient(circle, rgba(150,180,255,0.35), transparent 65%)" }} />

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
        <div className="relative">
          <h1 className="font-display text-[22vw] leading-[0.85] tracking-[-0.04em] chrome-shimmer md:text-[15vw]">
            <SplitText text="Portfolio" step={70} />
          </h1>
        </div>

        <div className="relative -mt-[8vw] grid grid-cols-12 items-start gap-6">
          <Reveal delay={200} className="col-span-6 space-y-2 pt-8 md:col-span-3">
            <div className="pt-4 font-sans-tight text-3xl font-light leading-none md:text-4xl">
              <div className="text-chrome">UX</div>
              <div className="text-chrome-cyber">UI</div>
              <div className="text-chrome">Web</div>
            </div>
            <p className="max-w-xs pt-6 text-sm text-muted-foreground">
              Creative designer sculpting digital experiences at the frontier of luxury and futurism.
            </p>
          </Reveal>

          <Reveal delay={400} className="col-span-12 md:col-span-6">
            <div
              ref={skullRef}
              className="relative mx-auto w-full max-w-[980px] md:-my-16 md:w-[125%] md:max-w-none chrome-breathe"
              style={{ transform: `translate(${x * -14}px, ${y * -14 + yOffset}px) scale(${scale}) rotate(${rotate}deg)` }}
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
                <span className="font-display text-xl italic normal-case text-chrome">nucleus</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={600} className="col-span-6 pt-4 text-right md:col-span-3">
            <div className="font-display text-[14vw] leading-[0.85] tracking-[-0.04em] text-chrome-cyber md:text-[6vw]">
              <SplitText text="De" step={80} delay={400} />
              <div><SplitText text="si" step={80} delay={560} /></div>
              <div className="italic"><SplitText text="gner" step={80} delay={720} /></div>
            </div>
            <div className="mt-4 flex justify-end gap-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span>ig · nucleus</span>
              <span>tg · nucleus</span>
            </div>
          </Reveal>
        </div>

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
  const [tigerRef, tigerProgress] = useScrollTransform<HTMLDivElement>();
  const tigerY = (tigerProgress - 0.5) * -60;
  const tigerRot = (tigerProgress - 0.5) * 8;
  return (
    <section id="about" className="relative mx-auto max-w-[1600px] px-6 py-32 md:px-10">
      <div className="mb-16 flex items-end justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">[ 01 · about ]</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">who / behind / the chrome</span>
      </div>
      <div className="grid grid-cols-12 gap-12 md:gap-20">
        <Reveal className="col-span-12 md:col-span-5">
          <div ref={tigerRef} className="relative" style={{ transform: `translateY(${tigerY}px) rotate(${tigerRot}deg)` }}>
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
        </Reveal>

        <div className="col-span-12 md:col-span-7 md:pl-12">
          <Reveal>
            <h2 className="font-display text-5xl leading-[0.95] tracking-tight text-chrome md:text-7xl">
              I sculpt <span className="italic text-chrome-cyber">immersive</span> digital experiences at the intersection of aesthetics, strategy and modern interaction.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
              Six years turning ambitious ideas into interfaces that feel like objects — polished, kinetic, unmistakable. Everything begins with a story and ends with pixels that move like liquid metal.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3">
            {specialties.map((s, i) => (
              <Reveal key={s} delay={i * 60}>
                <div className="glass chrome-border shine-sweep border-trace rounded-2xl px-5 py-4">
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
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-10">
        {/* Sticky pinned heading */}
        <div className="mb-16 md:sticky md:top-24 md:z-10 md:mb-8 md:bg-background/60 md:backdrop-blur-xl">
          <div className="flex items-end justify-between py-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">[ 02 · process ]</span>
            <h2 className="font-display text-4xl italic text-chrome md:text-6xl">stages of the craft</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <Tilt3D>
                <div className="group relative h-full overflow-hidden rounded-3xl glass-strong chrome-border shine-sweep border-trace p-8 transition-transform duration-500 hover:-translate-y-2">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-50"
                       style={{ background: "radial-gradient(circle, rgba(200,220,255,0.8), transparent)" }} />
                  <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">{s.n}</div>
                  <h3 className="mt-24 font-display text-4xl text-chrome">{s.t}</h3>
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
            <h2 className="mt-3 font-display text-5xl text-chrome md:text-7xl">
              <SplitText text="Selected " step={50} />
              <span className="italic text-chrome-cyber"><SplitText text="Works" step={50} delay={250} /></span>
            </h2>
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:block">two selected pieces</span>
        </div>

        <div className="space-y-24 md:space-y-32">
          {featured.map((p, i) => (
            <div key={p.n} className={`group grid grid-cols-12 items-center gap-8 md:gap-16 ${i % 2 ? "md:flex-row-reverse" : ""}`}>
              <Reveal className={`col-span-12 md:col-span-7 ${i % 2 ? "md:order-2" : ""}`}>
                <div className="px-4 py-6 md:px-8 md:py-10">
                  <Tilt3D max={6}>
                    <div className="relative overflow-hidden rounded-2xl chrome-border">
                      <img src={p.img} alt={p.title} loading="lazy" width={1200} height={800} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                    </div>
                  </Tilt3D>
                </div>
              </Reveal>
              <Reveal delay={150} className={`col-span-12 md:col-span-5 md:px-6 ${i % 2 ? "md:order-1" : ""}`}>
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
                  <Magnetic>
                    <button className="group/btn relative overflow-hidden rounded-full chrome-border glass shine-sweep border-trace px-6 py-3 text-xs uppercase tracking-[0.2em] text-foreground">
                      View Case
                    </button>
                  </Magnetic>
                  <Magnetic>
                    <button className="rounded-full border border-border px-6 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
                      Live ↗
                    </button>
                  </Magnetic>
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
          {items.map((it, idx) => (
            <Reveal key={it.t} delay={idx * 80}>
              <Tilt3D>
                <div className="group relative aspect-square overflow-hidden rounded-2xl glass chrome-border shine-sweep border-trace p-6 transition-transform hover:-translate-y-1">
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="text-chrome text-4xl">{it.i}</div>
                    <div>
                      <div className="font-display text-2xl text-chrome">{it.t}</div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">08 pieces</div>
                    </div>
                  </div>
                </div>
              </Tilt3D>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const links = [
    { name: "Instagram", handle: "@nucleus.ux", href: "#" },
    { name: "Behance", handle: "/nucleus", href: "#" },
    { name: "Dribbble", handle: "/nucleus", href: "#" },
    { name: "LinkedIn", handle: "/in/nucleus", href: "#" },
    { name: "Email", handle: "hello@nucleus.io", href: "mailto:hello@nucleus.io" },
  ];
  const [discRef, discProgress] = useScrollTransform<HTMLDivElement>();
  const discRot = discProgress * 30;
  const discY = (discProgress - 0.5) * -40;
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
            <h2 className="font-display text-[16vw] leading-[0.85] tracking-[-0.04em] chrome-shimmer md:text-[10vw]">
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

        <div className="mt-24 grid grid-cols-2 gap-3 md:grid-cols-5">
          {links.map((l, i) => (
            <Reveal key={l.name} delay={i * 80}>
              <Magnetic strength={0.25}>
                <a
                  href={l.href}
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

        <footer className="relative mt-32 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-muted/20 p-8 md:p-12">
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
              { label: "navigate", items: ["index", "work", "process", "contact"] },
              { label: "channels", items: ["telegram", "instagram", "read.cv", "are.na"] },
              { label: "signals", items: ["studio log", "field notes", "press kit", "colophon"] },
              { label: "contact", items: ["hello@nucleus.st", "+1 (415) 000·0000", "san francisco", "by appointment"] },
            ].map((col, i) => (
              <Reveal key={col.label} delay={i * 80}>
                <div className="flex flex-col gap-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                    ◆ {col.label}
                  </div>
                  <ul className="flex flex-col gap-2">
                    {col.items.map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="chromatic-hover font-mono text-xs uppercase tracking-[0.2em] text-foreground/80 transition-colors hover:text-foreground"
                        >
                          {item}
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

function ChromeChain() {
  const trackRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let raf = 0;
    const update = () => {
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = y / max;
      if (linksRef.current) {
        // vertical feed (loop within one link height = 56px)
        const feed = (y * 0.6) % 56;
        linksRef.current.style.transform = `translateY(${-feed}px)`;
      }
      if (trackRef.current) {
        const links = trackRef.current.querySelectorAll<HTMLElement>("[data-link]");
        links.forEach((el, i) => {
          const twist = Math.sin(progress * Math.PI * 4 + i * 0.35 + y * 0.004) * 55;
          el.style.transform = `rotateY(${twist}deg)`;
        });
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (!mounted) return null;

  // enough links to cover any viewport with overflow for feed loop
  const linkCount = 60;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-3 top-0 z-40 hidden h-screen w-10 md:flex md:items-start md:justify-center"
      style={{ perspective: "600px" }}
    >
      {/* soft chrome glow behind chain */}
      <div className="absolute inset-y-0 right-1/2 w-[2px] translate-x-1/2 bg-gradient-to-b from-transparent via-foreground/10 to-transparent" />
      <div
        ref={trackRef}
        className="relative h-full w-full overflow-hidden"
        style={{ maskImage: "linear-gradient(to bottom, transparent 0, black 8%, black 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 8%, black 92%, transparent 100%)" }}
      >
        <div ref={linksRef} className="absolute left-1/2 top-0 -translate-x-1/2 will-change-transform">
          {Array.from({ length: linkCount }).map((_, i) => (
            <div
              key={i}
              data-link
              className="flex h-[56px] w-10 items-center justify-center will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              <ChainLink flip={i % 2 === 1} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChainLink({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 64"
      width="34"
      height="54"
      style={{ transform: flip ? "rotate(90deg)" : "none", display: "block" }}
    >
      <defs>
        <linearGradient id="chrm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4f4f4" />
          <stop offset="20%" stopColor="#8a8a8a" />
          <stop offset="45%" stopColor="#e8e8e8" />
          <stop offset="60%" stopColor="#2a2a2a" />
          <stop offset="80%" stopColor="#c8c8c8" />
          <stop offset="100%" stopColor="#5a5a5a" />
        </linearGradient>
        <linearGradient id="chrmHL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* outer link */}
      <rect
        x="6"
        y="4"
        width="28"
        height="56"
        rx="14"
        ry="20"
        fill="none"
        stroke="url(#chrm)"
        strokeWidth="6"
      />
      {/* inner highlight */}
      <rect
        x="6"
        y="4"
        width="28"
        height="56"
        rx="14"
        ry="20"
        fill="none"
        stroke="url(#chrmHL)"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground noise">
      <PageLoader />
      <ScrollProgress />
      <CursorSpotlight />
      <ChromeCursor />
      <ChromeChain />
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
