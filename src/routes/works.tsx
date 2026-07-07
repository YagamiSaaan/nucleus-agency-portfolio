import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal, Tilt3D, SplitText, ScrollProgress, CursorSpotlight } from "@/lib/motion";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

export const Route = createFileRoute("/works")({
  head: () => ({
    meta: [
      { title: "Archive — 10 Web Works · NUCLEUS" },
      { name: "description", content: "An extended reel of ten selected web pieces from the NUCLEUS studio archive — interfaces, landing pages and experimental work." },
      { property: "og:title", content: "Archive — 10 Web Works · NUCLEUS" },
      { property: "og:description", content: "Ten selected web pieces from the NUCLEUS studio archive." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Archive — 10 Web Works · NUCLEUS" },
      { name: "twitter:description", content: "Ten selected web pieces from the NUCLEUS studio archive." },
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

      <section className="relative overflow-hidden pt-32 md:pt-40">
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
              <Tilt3D max={6}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl glass chrome-border shine-sweep border-trace transition-transform duration-500 hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={covers[i % covers.length]}
                      alt={w.t}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/80">
                      {w.n}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-2xl text-chrome sm:text-3xl">{w.t}</h3>
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        {w.year}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{w.cat}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      {w.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
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
