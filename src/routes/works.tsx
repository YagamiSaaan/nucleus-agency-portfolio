import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal, Tilt3D, SplitText, ScrollProgress, CursorSpotlight } from "@/lib/motion";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const WORKS_URL = "https://snuggle-bright-flow.lovable.app/works";
const WORKS_TITLE = "Selected Works — Websites & Motion Ads · Nucleus";
const WORKS_DESCRIPTION =
  "The Nucleus archive: ten selected web pieces and motion experiments — interfaces, landing pages and editorial work cast in polished chrome.";
const WORKS_OG_IMAGE =
  "https://snuggle-bright-flow.lovable.app/__l5e/assets-v1/543eff37-76c7-48cf-a21a-2cb7412c3ae4/nucleus-og.jpg";

export const Route = createFileRoute("/works")({
  head: () => ({
    meta: [
      { title: WORKS_TITLE },
      { name: "description", content: WORKS_DESCRIPTION },
      { property: "og:title", content: WORKS_TITLE },
      { property: "og:description", content: WORKS_DESCRIPTION },
      { property: "og:url", content: WORKS_URL },
      { property: "og:image", content: WORKS_OG_IMAGE },
      { name: "twitter:title", content: WORKS_TITLE },
      { name: "twitter:description", content: WORKS_DESCRIPTION },
      { name: "twitter:image", content: WORKS_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: WORKS_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: WORKS_TITLE,
          url: WORKS_URL,
          description: WORKS_DESCRIPTION,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://snuggle-bright-flow.lovable.app/" },
            { "@type": "ListItem", position: 2, name: "Works", item: WORKS_URL },
          ],
        }),
      },
    ],
  }),
  component: WorksPage,
});

const covers = [project1, project2, project3, project4];

const works = [
  { n: "01", t: "Aurora Systems", cat: "SaaS · Web", year: "2026", tags: ["Dashboard", "Dark UI"] },
  { n: "02", t: "Halcyon Studio", cat: "Portfolio · Motion", year: "2026", tags: ["Editorial", "3D"] },
  { n: "03", t: "Vestige Objects", cat: "E‑commerce", year: "2025", tags: ["Shop", "Typography"] },
  { n: "04", t: "Meridian FM", cat: "Radio · Web", year: "2025", tags: ["Audio", "Live"] },
  { n: "05", t: "Nova Residency", cat: "Real Estate", year: "2025", tags: ["Landing", "Booking"] },
  { n: "06", t: "Kilo Records", cat: "Music Label", year: "2024", tags: ["Catalog", "Player"] },
  { n: "07", t: "Prism Analytics", cat: "Product · UX", year: "2024", tags: ["Data", "Charts"] },
  { n: "08", t: "Chrome Journal", cat: "Editorial", year: "2024", tags: ["Blog", "Long‑read"] },
  { n: "09", t: "Ion Wallet", cat: "Fintech · Web", year: "2023", tags: ["Onboarding", "Motion"] },
  { n: "10", t: "Obsidian Agency", cat: "Agency Site", year: "2023", tags: ["Marketing", "Case"] },
];

function SilverFluid() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(210,220,235,0.35), transparent 55%), radial-gradient(ellipse at 80% 60%, rgba(180,200,230,0.30), transparent 55%), radial-gradient(ellipse at 50% 90%, rgba(150,170,200,0.25), transparent 60%)",
        }}
      />
      <div
        className="absolute -left-[20%] top-[10%] h-[70vh] w-[70vh] rounded-full mix-blend-screen blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, #f3f5f8 0%, #cfd6e2 30%, #8a92a8 60%, transparent 75%)",
          animation: "wfluid-a 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[-15%] top-[35%] h-[80vh] w-[80vh] rounded-full mix-blend-screen blur-3xl opacity-90"
        style={{
          background:
            "radial-gradient(circle at 60% 50%, #ffffff 0%, #d9dee7 25%, #98a2b8 55%, transparent 75%)",
          animation: "wfluid-b 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-[30%] bottom-[-10%] h-[65vh] w-[65vh] rounded-full mix-blend-screen blur-3xl opacity-80"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #e8ecf3 0%, #b6bccb 40%, #6f7689 70%, transparent 80%)",
          animation: "wfluid-c 26s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          background:
            "conic-gradient(from 210deg at 50% 50%, rgba(255,255,255,0.0), rgba(200,220,255,0.35), rgba(180,160,220,0.25), rgba(255,255,255,0.0), rgba(200,220,255,0.35), rgba(255,255,255,0.0))",
          animation: "wfluid-spin 40s linear infinite",
          filter: "blur(40px)",
        }}
      />
      <style>{`
        @keyframes wfluid-a { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(12vw,8vh) scale(1.15);} }
        @keyframes wfluid-b { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-14vw,-6vh) scale(1.1);} }
        @keyframes wfluid-c { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-8vw,-12vh) scale(1.2);} }
        @keyframes wfluid-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function WorksPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <CursorSpotlight />

      <header className="fixed left-0 right-0 top-0 z-50">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-6 md:px-10">
          <Link to="/" className="font-display text-2xl tracking-tight text-chrome">
            nucleus<span className="text-accent">◆</span>
          </Link>
          <Link
            to="/"
            className="rounded-full chrome-border px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-black shine-sweep"
            style={{
              background:
                "linear-gradient(180deg, #ffffff 0%, #dcdcdc 45%, #8a8a8a 80%, #cfcfcf 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,0,0,0.35), 0 10px 30px -12px rgba(200,220,255,0.45)",
            }}
          >
            ← Back
          </Link>
        </div>
      </header>

      <section className="relative min-h-[70vh] overflow-hidden pt-32 md:pt-40">
        <SilverFluid />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              [ archive · 10 / mmxxvi ]
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              web · pieces
            </span>
          </div>
          <h1 className="font-display text-[16vw] leading-[0.85] tracking-[-0.045em] chrome-shimmer md:text-[11vw]">
            <SplitText text="The Archive" step={60} />
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
            Ten web pieces from the studio vault — interfaces, landing pages and experiments cast in polished chrome.
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-6 md:px-10 md:py-28">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {works.map((w, i) => (
            <Reveal key={w.n} delay={i * 60}>
              <Tilt3D max={5}>
                <div
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl chrome-border shine-sweep border-trace p-4 transition-transform duration-500 hover:-translate-y-1 sm:p-5"
                  style={{
                    background:
                      "linear-gradient(135deg, #f5f5f5 0%, #cfd6e2 30%, #8a92a8 60%, #cfcfcf 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -1px 0 rgba(0,0,0,0.35), 0 20px 60px -20px rgba(180,200,255,0.35)",
                  }}
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/40 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />

                  <div
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                    style={{
                      boxShadow:
                        "inset 0 0 0 1px rgba(255,255,255,0.6), 0 20px 50px -20px rgba(0,0,0,0.55)",
                    }}
                  >
                    <img
                      src={covers[i % covers.length]}
                      alt={w.t}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/90">
                      {w.n}
                    </span>
                  </div>

                  <div className="relative flex flex-1 flex-col gap-3 p-4 pt-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-2xl text-black sm:text-3xl">{w.t}</h3>
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/60">
                        {w.year}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/70">{w.cat}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      {w.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-black/25 bg-white/25 px-3 py-1 text-xs text-black/80 backdrop-blur"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Tilt3D>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <Link
            to="/"
            className="rounded-full chrome-border px-8 py-4 text-xs uppercase tracking-[0.2em] text-black shine-sweep"
            style={{
              background:
                "linear-gradient(180deg, #ffffff 0%, #dcdcdc 45%, #8a8a8a 80%, #cfcfcf 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,0,0,0.35), 0 10px 30px -12px rgba(200,220,255,0.45)",
            }}
          >
            ← Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
