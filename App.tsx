
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { CrisisDetail } from "./components/CrisisDetail";
import { CrisisFilters } from "./components/CrisisFilters";
import { CrisisGrid } from "./components/CrisisGrid";
import { CrisisMonitoringDashboard } from "./components/CrisisMonitoringDashboard";
import { CrisisNetwork } from "./components/CrisisNetwork";
import { EducationalModules } from "./components/EducationalModules";
import { GlossaryDrawer } from "./components/GlossaryDrawer";
import { KeywordDetail } from "./components/KeywordDetail";
import { Layout } from "./components/Layout";
import { CrisisGlossaryEntry, CrisisIndexItem, Language } from "./types";
import {
  getAllCrises,
  getContentVersion,
  getContentCount,
  getCrisis,
  getRelated,
  getManifestMap,
  getValidationIssues,
} from "./src/content/loadCrises";

type SortKey = "index" | "severity" | "volatility" | "alphabetic" | "lastUpdated";

type FilterGroup = {
  id: FilterId;
  categories: string[];
  label: Record<Language, string>;
};

type FilterId = "ALL" | "ECO" | "SOC" | "POWER" | "TECH" | "MIND";

const FILTER_GROUPS: FilterGroup[] = [
  { id: "ALL", categories: [], label: { de: "ALLE", en: "ALL" } },
  { id: "ECO", categories: ["Materie"], label: { de: "ÖKOLOGIE & MATERIE", en: "ECOLOGY & MATTER" } },
  { id: "SOC", categories: ["Existenz"], label: { de: "GESELLSCHAFT & EXISTENZ", en: "SOCIETY & EXISTENCE" } },
  { id: "POWER", categories: ["Macht"], label: { de: "MACHT & ORDNUNG", en: "POWER & ORDER" } },
  { id: "TECH", categories: ["Kontrolle"], label: { de: "TECHNIK & KONTROLLE", en: "TECH & CONTROL" } },
  { id: "MIND", categories: ["Gefühl"], label: { de: "GEIST & GEFÜHL", en: "MIND & AFFECT" } },
];

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/&/g, "und")
    .replace(/[öäüß]/g, (m) => ({ ö: "o", ä: "a", ü: "u", ß: "ss" }[m] || m))
    .replace(/[^a-z0-9-]/g, "");

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("app_lang");
    return (stored as Language) || "de";
  });
  const [activeFilter, setActiveFilter] = useState<FilterId>("ALL");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedGlossary, setSelectedGlossary] = useState<CrisisGlossaryEntry | null>(null);
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("index");
  const [loadingIndex, setLoadingIndex] = useState(true);
  const [entered, setEntered] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'network' | 'monitoring' | 'education'>('grid');
  const [navTop, setNavTop] = useState<number>(72);
  const [navSticky, setNavSticky] = useState(false);

  const contentVersion = getContentVersion();
  const contentCount = getContentCount();
  const validationIssues = getValidationIssues();

  useEffect(() => {
    localStorage.setItem("app_lang", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (entered && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [entered]);

  useLayoutEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const update = () => setNavTop(header.getBoundingClientRect().height);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const handle = () => {
      setNavSticky(window.scrollY > 0);
    };
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const crises = useMemo(() => getAllCrises(language), [language]);
  const orderMap = useMemo(() => {
    const map: Record<string, number> = {};
    crises.forEach((c, idx) => {
      map[c.slug] = idx;
    });
    return map;
  }, [crises]);
  const manifestMap = useMemo(() => getManifestMap(), []);

  useEffect(() => {
  const handleHashChange = () => {
    if (!entered) return;
    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (hash.startsWith("keyword/")) {
      const kw = decodeURIComponent(hash.split("/")[1] || "");
      setActiveKeyword(kw);
      setSelectedSlug(null);
      setActiveFilter("ALL");
      return;
    }
      if (hash.startsWith("archetype/") || hash.startsWith("glossary/")) {
        const kw = decodeURIComponent(hash.split("/")[1] || "");
        setSelectedGlossary({ term: kw, definition: { de: "", en: "" }, archetypeLink: undefined });
        return;
      }

      if (!hash || hash === "alle") {
        setSelectedSlug(null);
        setActiveFilter("ALL");
        return;
      }

      const filterMatch = FILTER_GROUPS.find((fg) => slugify(fg.label.de) === hash || slugify(fg.label.en) === hash);
      if (filterMatch) {
        setActiveFilter(filterMatch.id);
        setSelectedSlug(null);
        return;
      }

      setSelectedSlug(hash);
      setActiveFilter("ALL");
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [entered]);

  useEffect(() => {
    if (!crises.length) return;
    const cacheKey = `krisen_index_${contentVersion}_${language}`;
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        version: contentVersion,
        lang: language,
        items: crises,
        cachedAt: new Date().toISOString(),
      }),
    );
    const timer = setTimeout(() => setLoadingIndex(false), 200);
    return () => clearTimeout(timer);
  }, [crises, language, contentVersion]);

  const filteredCrises = useMemo(() => {
    const term = search.trim().toLowerCase();
    const active = FILTER_GROUPS.find((f) => f.id === activeFilter);
    const matches = crises.filter((c) => {
      const categoryOk =
        !active || active.id === "ALL" || c.categories.some((cat) => active.categories.includes(cat));
      if (!categoryOk) return false;
      if (!term) return true;
      return (
        c.title.toLowerCase().includes(term) ||
        c.summary.toLowerCase().includes(term) ||
        c.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    });

    return [...matches].sort((a, b) => {
      switch (sort) {
        case "index":
          return (orderMap[a.slug] ?? 0) - (orderMap[b.slug] ?? 0);
        case "volatility":
          return b.volatility - a.volatility;
        case "alphabetic":
          return a.title.localeCompare(b.title);
        case "lastUpdated":
          return new Date(b.lastUpdatedISO).getTime() - new Date(a.lastUpdatedISO).getTime();
        case "severity":
        default:
          return b.severity - a.severity;
      }
    });
  }, [activeFilter, crises, search, sort, orderMap]);

  const selectedRecord = selectedSlug ? getCrisis(selectedSlug, language) : null;
  const related = useMemo(() => (selectedSlug ? getRelated(selectedSlug, language) : []), [selectedSlug, language]);
  const pendingIssues = useMemo(
    () => (selectedSlug ? validationIssues.filter((i) => i.slug === selectedSlug && i.lang === language) : []),
    [selectedSlug, validationIssues, language],
  );

  const handleSelectCrisis = (item: CrisisIndexItem) => {
    window.location.hash = item.slug;
  };

  const handleKeywordClick = (keyword: string) => {
    setActiveKeyword(keyword);
    window.location.hash = `keyword/${encodeURIComponent(keyword)}`;
  };

  const handleCategoryClick = (filterId: FilterId | "ALL" | string) => {
    const resolved =
      typeof filterId === "string" && filterId !== "ALL"
        ? FILTER_GROUPS.find((f) => f.id === filterId || f.categories.includes(filterId))?.id ?? "ALL"
        : "ALL";
    const next = filterId === "ALL" ? "ALL" : (resolved as FilterId);
    setActiveFilter(next);
    if (next === "ALL") {
      window.location.hash = "alle";
    } else {
      const filter = FILTER_GROUPS.find((f) => f.id === next);
      if (filter) {
        window.location.hash = slugify(filter.label[language]);
      }
    }
  };

  const handleCopyCommand = (slug: string) => {
    const cmd = `npm run generate:crisis -- ${slug}`;
    navigator.clipboard.writeText(cmd).catch(() => {});
  };

  const introCopy = {
    de: { introTitle: "Archiv des Zerfalls.", all: "ALLE", detail: "Archiv öffnen" },
    en: { introTitle: "Archive of Decay.", all: "ALL", detail: "Open Archive" },
  }[language];
  const showIntroHero = viewMode === 'grid';

  if (!entered) {
    return (
      <Layout lang={language} onLangChange={setLanguage}>
        <section className="min-h-[80vh] px-6 flex flex-col justify-center gap-10 max-w-5xl">
          <div className="space-y-6">
            <span className="mono text-[10px] uppercase tracking-[0.5em] text-white/30">ARCHIV DER</span>
            <h2 className="text-[12vw] md:text-[8vw] font-black uppercase leading-[0.8] tracking-tighter">
              KRISEN
            </h2>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-3xl">
              sind keine äußerer Ausnahmezustände, sondern eine Weise, in der moderne Gesellschaft sich selbst beschreibt. Die folgenden Einträge sind Momentaufnahmen in diesem Verdichtungsraum von Störungen. Sie bleiben lokal im
              doppelten Sinn: an konkrete Situationen gebunden und in sich geschlossen, ohne nachträgliche Aktualisierung,
              ohne Live-Feed. Nicht das „große Ganze“ wird nachgeladen, sondern eine Serie begrenzter, determinierter Perspektiven
              auf eine Gegenwart, die sich selbst permanent als krisenhaft inszeniert.
            </p>
          </div>

          {/* Vorwort Section */}
          <div className="border-t border-white/10 pt-12 max-w-4xl">
            <div className="mono text-[10px] uppercase tracking-[0.5em] text-white/30 mb-6">VORWORT</div>
            <div className="mono text-[12px] leading-relaxed text-white/70 space-y-6">
              <p>
                Wir sind gewohnt, von der <span className="text-red-500">Krise</span> zu sprechen: der Klimakrise, der
                Finanzkrise, der Demokratieskrise, der Sinnkrise. Krise – das hieß einmal: ein Moment der Entscheidung.
                Ein Körper fiebert, eine Gesellschaft gerät ins Schwanken, ein System außer Kontrolle – und irgendwo, so
                die alte Hoffnung, zeichnet sich eine Richtung ab: Heilung oder Zusammenbruch.
              </p>
              <p>
                Die Gegenwart kennt diesen Wendepunkt nicht mehr. Sie kennt nur noch <span className="text-red-500">Dauerzustand</span>.
                Was sich heute abzeichnet, ist kein einzelner Ausnahmefall, sondern ein Verdichtungsraum von Störungen.
                Krieg, Klimawandel, Migration, Inflation, Autoritarismus, Desinformation, Künstliche Intelligenz, Erschöpfung,
                Zukunftsangst – sie treten nicht nacheinander auf, nicht einmal ordentlich nebeneinander, sondern
                übereinandergeschichtet, ineinander verschlungen, wechselseitig aufgeladen. Jede Störung verweist auf andere,
                wird Ursache und Symptom zugleich.
              </p>
              <p>
                Die Rede von der Krise hat selbst eine Geschichte. Reinhart Koselleck hat gezeigt, wie sich der Begriff von
                der medizinisch-theologischen Zuspitzung – der entscheidende Moment zwischen Leben und Tod – löst und zur
                großen Zeitdiagnose der Neuzeit wird. Die Krise der Moderne. Mit Luhmann verschiebt sich der Blick von der
                Philosophie zur funktionalen Gesellschaftsanalyse. Jetzt ist Krise kein metaphysischer Zustand mehr,
                sondern eine Form der Selbstbeschreibung moderner Gesellschaft.
              </p>
              <p className="text-white/50 italic">
                Krisenrhetorik fungiert als Diagnose, als Alarm, als Geschäftsmodell, als Programm der Politik, als Format
                der Massenmedien, als persönliches Lebensgefühl. Zwischen beidem – der materiellen Härte und ihrer
                symbolisch-medialen Verarbeitung – setzt dieses Buch an.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setEntered(true);
                window.location.hash = "alle";
              }}
              className="mono text-[11px] uppercase tracking-[0.4em] px-6 py-3 border border-white/40 hover:bg-white hover:text-black transition-all"
            >
              Archiv öffnen
            </button>
            <div className="mono text-[9px] uppercase tracking-[0.3em] text-white/30">
              {contentCount} Einträge // Build {contentVersion}
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (loadingIndex) {
    return (
      <Layout lang={language} onLangChange={setLanguage}>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
          <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-white transition-all duration-700 ease-out" style={{ width: "90%" }} />
          </div>
          <div className="mono text-[10px] uppercase tracking-[0.4em] text-white/40">Lade Archiv …</div>
          <div className="mono text-[9px] uppercase tracking-[0.3em] text-white/20">Build {contentVersion}</div>
        </div>
      </Layout>
    );
  }

  // Generate unique key for transitions
  const currentViewKey = selectedRecord
    ? `detail-${selectedRecord.manifest.slug}`
    : selectedSlug
      ? `missing-${selectedSlug}`
      : `grid-${viewMode}-${activeFilter}-${sort}`;

  return (
    <Layout lang={language} onLangChange={setLanguage}>
      <div
        className={`${
          selectedGlossary ? "blur-sm grayscale opacity-30 pointer-events-none" : ""
        } transition-all duration-700`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentViewKey}
            initial={{ opacity: 0, x: selectedRecord ? 100 : 0, scale: selectedRecord ? 1 : 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: selectedRecord ? 0 : -50, scale: selectedRecord ? 1 : 0.95 }}
            transition={{
              duration: 0.6,
              ease: [0.19, 1, 0.22, 1] // Custom easing for smooth animation
            }}
          >
            {selectedRecord ? (
              <CrisisDetail
                record={selectedRecord}
                lang={language}
                related={related}
                issues={pendingIssues}
                onBack={() => window.location.hash = ""}
                onGlossaryClick={(entry) => {
                  setSelectedGlossary(entry);
                  window.location.hash = `glossary/${encodeURIComponent(entry.term)}`;
                }}
                onKeywordClick={handleKeywordClick}
              />
            ) : selectedSlug ? (
              <div className="max-w-5xl mx-auto px-6 py-24 text-center space-y-8">
                <div className="mono text-[10px] uppercase tracking-[0.4em] text-white/40">
                  Missing entry: {selectedSlug}
                </div>
                <p className="text-2xl font-black uppercase tracking-tight">Kein Manifest gefunden.</p>
                <p className="text-white/60">
                  Erstelle den Datensatz lokal über das CLI, anschließend Seite neu laden.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <code className="bg-white/5 border border-white/10 px-4 py-2 mono text-[11px]">
                    npm run generate:crisis -- {selectedSlug}
                  </code>
                  <button
                    onClick={() => handleCopyCommand(selectedSlug)}
                    className="mono text-[10px] uppercase tracking-[0.3em] border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ) : (
              <>
                {showIntroHero && (
                  <section className="px-6 mb-16 max-w-6xl animate-fade-in">
                    <h2 className="text-[12vw] font-black uppercase leading-[0.7] tracking-tighter mb-10">
                      {introCopy.introTitle}
                    </h2>
                    <p className="mono text-[11px] text-white/40 tracking-[0.4em] uppercase">
                      Build {contentVersion} // {contentCount} Einträge // Offline-Index
                    </p>
                  </section>
                )}

                <nav
                  className="sticky z-40 bg-black/95 backdrop-blur-2xl border-y border-white/5 px-6 py-6 mb-12 flex flex-wrap gap-6 overflow-x-auto no-scrollbar"
                  style={{
                    top: navSticky ? 0 : Math.max(navTop - 1, 0),
                    marginTop: navSticky ? 0 : undefined,
                  }}
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="mono text-[10px] uppercase tracking-[0.4em] text-white/40">ANSICHT:</span>
                    <div className="flex border border-white/20">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 ${
                          viewMode === 'grid'
                            ? 'bg-white text-black'
                            : 'text-white hover:bg-white/10'
                        } transition-all`}
                      >
                        Raster
                      </button>
                      <button
                        onClick={() => setViewMode('network')}
                        className={`mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 ${
                          viewMode === 'network'
                            ? 'bg-white text-black'
                            : 'text-white hover:bg-white/10'
                        } transition-all`}
                      >
                        Netzwerk
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setViewMode('monitoring')}
                      className={`mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 border border-white/20 ${
                        viewMode === 'monitoring'
                          ? 'bg-white text-black'
                          : 'text-white hover:bg-white/10'
                      } transition-all`}
                    >
                      Monitoring
                    </button>
                    <button
                      onClick={() => setViewMode('education')}
                      className={`mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 border border-white/20 ${
                        viewMode === 'education'
                          ? 'bg-white text-black'
                          : 'text-white hover:bg-white/10'
                      } transition-all`}
                    >
                      Bildung
                    </button>
                  </div>
                  <CrisisFilters
                    lang={language}
                    activeFilter={activeFilter}
                    filters={FILTER_GROUPS}
                    onFilterChange={handleCategoryClick}
                    onSearchChange={setSearch}
                    search={search}
                    sort={sort}
                    onSortChange={setSort}
                  />
                </nav>

                <section className="px-6 pb-36">
                  {viewMode === 'grid' ? (
                    <CrisisGrid
                      items={filteredCrises}
                      lang={language}
                      onSelect={handleSelectCrisis}
                      onCategory={handleCategoryClick}
                      orderMap={orderMap}
                    />
                  ) : viewMode === 'network' ? (
                    <CrisisNetwork
                      crises={filteredCrises}
                      manifestMap={manifestMap}
                      onNodeClick={handleSelectCrisis}
                    />
                  ) : viewMode === 'monitoring' ? (
                    <CrisisMonitoringDashboard
                      crises={crises}
                      lang={language}
                    />
                  ) : (
                    <EducationalModules
                      crises={crises}
                      lang={language}
                    />
                  )}
                </section>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={() => setTocOpen(true)}
        className="fixed bottom-20 right-6 mono text-[10px] uppercase tracking-[0.3em] border border-white/20 px-4 py-3 bg-black/80 hover:border-white/60 hover:text-accent transition-all z-60"
      >
        INDEX
      </button>
      {tocOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center px-4">
          <div className="max-w-4xl w-full bg-black border border-white/20 p-6 overflow-y-auto max-h-[80vh]">
            <div className="flex items-center justify-between mb-6">
              <div className="mono text-[10px] uppercase tracking-[0.4em] text-white/50">Kanon Index 1–100</div>
              <button
                onClick={() => setTocOpen(false)}
                className="mono text-[10px] uppercase tracking-[0.3em] text-white/60 hover:text-white"
              >
                Close ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {crises.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => {
                    window.location.hash = c.slug;
                    setTocOpen(false);
                  }}
                  className="flex items-start gap-3 border border-white/10 p-3 text-left hover:border-white/50 transition-all"
                >
                  <span className="mono text-[10px] text-white/40">
                    {String((orderMap[c.slug] ?? 0) + 1).padStart(3, "0")}
                  </span>
                  <div>
                    <div className="text-sm font-black uppercase tracking-tight">{c.title}</div>
                    <div className="mono text-[8px] uppercase tracking-[0.3em] text-white/30">
                      {c.categories.join(", ")} // v{c.version}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedGlossary && (
        <GlossaryDrawer
          entry={selectedGlossary}
          lang={language}
          onClose={() => {
            setSelectedGlossary(null);
            if (selectedRecord) {
              window.location.hash = selectedRecord.manifest.slug;
            } else {
              window.location.hash = "alle";
            }
          }}
        />
      )}
      {activeKeyword && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center px-4">
          <KeywordDetail
            keyword={activeKeyword}
            lang={language}
            onBack={() => {
              setActiveKeyword(null);
              window.location.hash = "alle";
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
      `}</style>
    </Layout>
  );
};

export default App;
