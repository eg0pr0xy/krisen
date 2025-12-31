import React, { useEffect, useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  CrisisCategory,
  CrisisGlossaryEntry,
  CrisisIndexItem,
  CrisisRecord,
  CrisisValidationIssue,
  Language,
  LocalizedString,
} from "../types";
import { getManifestMap } from "../src/content/loadCrises";
import { contentIndex } from "../src/generated/contentIndex";
import { AnnotationSystem } from "./AnnotationSystem";
import { LoadingProgressBar } from "./LoadingProgressBar";
import { IndicatorsPanel, IndicatorDatum } from "./IndicatorsPanel";
import { EvidenceLog, EvidenceEntry } from "./EvidenceLog";
import { LiveEvidenceGrid, LiveEvidenceItem } from "./LiveEvidenceGrid";
import { HistoricalTimeline } from "./HistoricalTimeline";
import { indicatorMappings, oecdIndicators } from "../src/generated/indicatorMappings";

interface CrisisDetailProps {
  record: CrisisRecord;
  lang: Language;
  related: CrisisIndexItem[];
  issues?: CrisisValidationIssue[];
  onBack: () => void;
  onGlossaryClick: (entry: CrisisGlossaryEntry) => void;
  onKeywordClick?: (keyword: string) => void;
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getSummarySentence = (summary: string) => {
  if (!summary) return "";
  const cleaned = summary.trim().replace(/\s+/g, " ");
  const match = cleaned.match(/([^.!?]+[.!?])/);
  return match ? match[0].trim() : cleaned;
};

const COLORS = {
  default: { base: "#ffffff", accent: "#f87171", text: "#f9fafb" },
};

const CATEGORY_COLORS: Record<CrisisCategory, { base: string; accent: string; text: string }> = {
  Materie: { base: "#ef4444", accent: "#980000", text: "#fee2e2" },
  Existenz: { base: "#f97316", accent: "#7c2d12", text: "#fff6ed" },
  Macht: { base: "#eab308", accent: "#78350f", text: "#fff7d6" },
  Kontrolle: { base: "#22c55e", accent: "#065f46", text: "#ecfdf5" },
  Gefühl: { base: "#3b82f6", accent: "#1e3a8a", text: "#e0e7ff" },
  "Systemic Fragility": { base: "#d946ef", accent: "#7c3aed", text: "#f5f3ff" },
};

const MANIFEST_LOOKUP = getManifestMap();

export const CrisisDetail: React.FC<CrisisDetailProps> = ({
  record,
  lang,
  related,
  issues,
  onBack,
  onGlossaryClick,
  onKeywordClick,
}) => {
  const { manifest } = record;
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [manifest.slug]);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const mediaImages = manifest.media?.images ?? [];
  const mediaVideos = manifest.media?.video ?? [];
  const totalMediaImages = mediaImages.length;
  const hasMedia = mediaImages.length > 0 || mediaVideos.length > 0;
  const [detailProgress, setDetailProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [videoLoadingState, setVideoLoadingState] = useState<'idle' | 'loading' | 'ready'>('idle');
  const [loadingMessages, setLoadingMessages] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Diagnostic Logger für Video-Loading
  const startVideoExtraction = () => {
    if (videoLoadingState === 'loading') return;

    setVideoLoadingState('loading');
    setLoadingProgress(0);
    setLoadingMessages([]);

    const messages = [
      'INITIALISIERUNG DER VEO-ENGINE...',
      'DEKODIERUNG DER TEMPORALEN DATEN...',
      'FRAME-SYNTHESE LÄUFT...',
      'FINALE SYSTEMPRÜFUNG...'
    ];

    let currentMessageIndex = 0;
    let progress = 0;

    const updateProgress = () => {
      progress += Math.random() * 15 + 5; // Random progress between 5-20%
      if (progress > 100) progress = 100;
      setLoadingProgress(progress);

      if (currentMessageIndex < messages.length) {
        setLoadingMessages(prev => [...prev, messages[currentMessageIndex]]);
        currentMessageIndex++;
      }

      if (progress < 100) {
        setTimeout(updateProgress, 800 + Math.random() * 400); // 800-1200ms intervals
      } else {
        setVideoLoadingState('ready');
        setTimeout(() => {
          setLoadingMessages([]);
          setLoadingProgress(0);
          setVideoLoadingState('idle');
        }, 2000); // Reset after 2 seconds
      }
    };

    updateProgress();
  };
  const fallbackTarget = useMemo(() => {
    const dt = new Date();
    dt.setFullYear(dt.getFullYear() + 1);
    return dt;
  }, []);
  const criticalTarget = manifest.criticalThreshold
    ? new Date(manifest.criticalThreshold)
    : fallbackTarget;
  const doomStart = manifest.lastUpdatedISO ? new Date(manifest.lastUpdatedISO) : undefined;

  const pick = (value: LocalizedString | string) => {
    if (typeof value === "string") return value;
    return value[lang] || value.de || value.en || "";
  };

  const glossaryMap = useMemo(() => {
    const entries: Record<string, CrisisGlossaryEntry> = {};
    manifest.glossary.forEach((g) => {
      entries[g.term.toLowerCase()] = g;
    });
    return entries;
  }, [manifest.glossary]);

  type CascadeEntry = {
    slug: string;
    title: LocalizedString;
    severity: number;
    categories: string[];
    summary: LocalizedString;
  };

  const cascadeEntries = useMemo<CascadeEntry[]>(() => {
    return (manifest.triggers ?? [])
      .map((slug) => {
        const target = MANIFEST_LOOKUP[slug];
        if (!target) return null;
        return {
          slug,
          title: target.title,
          severity: target.severity,
          categories: (target.categories as string[]) || [],
          summary: target.summary,
        };
      })
      .filter((entry): entry is CascadeEntry => Boolean(entry));
  }, [manifest.triggers]);

  const interdependencyNodes = manifest.categories.map((category) => ({
    category,
    connections: cascadeEntries.filter((entry) =>
      entry.categories.some((cat) => cat.toLowerCase() === category.toLowerCase()),
    ),
  }));

  const noConnectionsText =
    lang === "de"
      ? "Keine direkten Rückkopplungen dokumentiert."
      : "No direct feedback loops documented.";

  const cascadeCountLabel =
    manifest.triggers && manifest.triggers.length > 0
      ? manifest.triggers.length.toString().padStart(2, "0")
      : "00";
  const destabilizesLabel = lang === "de" ? "destabilisiert" : "destabilizes";
  const cascadeSummaryText =
    lang === "de"
      ? `${cascadeCountLabel} Kaskaden dokumentiert.`
      : `${cascadeCountLabel} triggers documented.`;
  const loadSummaryText = lang === "de" ? "STATUS • SYSTEMISCHE FRAGILITÄT" : "STATUS • SYSTEMIC FRAGILITY";

  const systemicLoadValue = Math.min(100, Math.max(0, manifest.systemicLoad ?? 0));

  const renderText = (text: string) => {
    if (!text) return null;
    const orderedTerms = manifest.glossary
      .map((g) => g.term)
      .sort((a, b) => b.length - a.length);

    let parts: (string | React.ReactNode)[] = [text];
    orderedTerms.forEach((term) => {
      const regex = new RegExp(`(${escapeRegExp(term)})`, "gi");
      parts = parts.flatMap((chunk, idx) => {
        if (typeof chunk !== "string") return chunk;
        return chunk.split(regex).map((piece, innerIdx) => {
          if (piece.toLowerCase() === term.toLowerCase()) {
            const entry = glossaryMap[term.toLowerCase()];
            return (
              <button
                key={`${term}-${idx}-${innerIdx}`}
                onClick={() => entry && onGlossaryClick(entry)}
                className="text-accent hover:underline decoration-1 underline-offset-4 cursor-pointer font-medium px-1 transition-all"
              >
                [{piece}]
              </button>
            );
          }
          return piece;
        });
      });
    });
    return parts;
  };

  const missingGlossaryTerms = useMemo(() => {
    const text = (
      [
        manifest.title.de,
        manifest.title.en,
        manifest.summary.de,
        manifest.summary.en,
        manifest.diagnosis.de,
        manifest.diagnosis.en,
        manifest.mechanisms.de,
        manifest.mechanisms.en,
        manifest.signals.map((s) => `${s.label.de} ${s.label.en} ${s.value} ${s.source || ""}`).join(" "),
        manifest.qa
          ? manifest.qa
              .map((q) => `${q.question?.de || ""} ${q.question?.en || ""} ${q.answer?.de || ""} ${q.answer?.en || ""}`)
              .join(" ")
          : "",
        manifest.archetypes
          .map((a) => `${a.name.de} ${a.name.en} ${a.description.de} ${a.description.en}`)
          .join(" "),
      ].join(" ")
    ).toLowerCase();
    return manifest.glossary
      .map((g) => g.term)
      .filter((term) => !text.includes(term.toLowerCase()));
  }, [manifest]);

  const horizonLabel = {
    immediate: { de: "Akut", en: "Immediate" },
    mid: { de: "Mittelfrist", en: "Mid term" },
    long: { de: "Langfrist", en: "Long term" },
  }[manifest.timeHorizon];

  const categoryList = manifest.categories.join(" / ");
  const determineTrend = (value: number, high = 70, low = 35): "up" | "down" | "stable" => {
    if (value >= high) return "up";
    if (value <= low) return "down";
    return "stable";
  };

  const baseIndicatorItems = useMemo<IndicatorDatum[]>(() => {
    const severityTrend = determineTrend(manifest.severity);
    const volatilityTrend = determineTrend(manifest.volatility, 65, 30);
    const loadValue = manifest.systemicLoad ?? 0;
    const loadTrend = determineTrend(loadValue, 60, 25);
    const triggersCount = manifest.triggers?.length ?? 0;

    return [
      {
        id: "severity",
        label: lang === "de" ? "SYSTEMISCHE SCHWELLE" : "SYSTEMIC THRESHOLD",
        value: manifest.severity,
        trend: severityTrend,
        interpretation: lang === "de"
          ? `Schwere verteilt sich über ${categoryList}.`
          : `Severity disperses across ${categoryList}.`,
      },
      {
        id: "volatility",
        label: lang === "de" ? "RAUM-ZEIT-DRIFT" : "SPACE-TIME DRIFT",
        value: `${manifest.volatility}%`,
        trend: volatilityTrend,
        interpretation: lang === "de"
          ? "Kurzfristige Impulse verschieben die Koordinaten."
          : "Short-term impulses shift the coordinates.",
      },
      {
        id: "systemic-load",
        label: lang === "de" ? "SYSTEMBELASTUNG" : "SYSTEMIC LOAD",
        value: loadValue,
        trend: loadTrend,
        interpretation: lang === "de"
          ? "Lastverteilung bleibt nahe kritischem Level."
          : "Load remains near critical thresholds.",
      },
      {
        id: "triggers",
        label: lang === "de" ? "KASKADEN DICHTE" : "CASCADE DENSITY",
        value: `${triggersCount}`,
        trend: triggersCount > 2 ? "up" : triggersCount === 0 ? "stable" : "down",
        interpretation: lang === "de"
          ? "Kaskadenpunkte dokumentiert, die systemweit resonieren."
          : "Documented pressure points reverberate across the system.",
      },
    ];
  }, [lang, manifest, categoryList]);

  const dataIndicatorItems = useMemo<IndicatorDatum[]>(() => {
    const relevantMappings = indicatorMappings
      .filter((mapping) => mapping.crisisSlug === manifest.slug)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    return relevantMappings
      .map((mapping) => {
        const indicator = oecdIndicators.find((entry) => entry.id === mapping.indicatorId);
        if (!indicator) return null;

        const label =
          lang === "de"
            ? indicator.label.de || indicator.label.en
            : indicator.label.en || indicator.label.de;

        const descriptionParts = [];
        if (indicator.description?.[lang]) {
          descriptionParts.push(indicator.description[lang]);
        } else if (indicator.description?.de && indicator.description?.en) {
          descriptionParts.push(indicator.description.de);
        }
        if (indicator.dimensions) {
          descriptionParts.push(
            ...Object.entries(indicator.dimensions).map(([key, value]) => `${key}: ${value}`)
          );
        }
        descriptionParts.push(`score ${mapping.score}`);

        const trend: IndicatorDatum["trend"] = mapping.score >= 4 ? "up" : mapping.score >= 3 ? "stable" : "down";
        return {
          id: `oecd-${indicator.id}`,
          label: `${label}`,
          value: indicator.value ?? "—",
          trend,
          interpretation: descriptionParts.filter(Boolean).join(" • "),
        };
      })
      .filter(Boolean) as IndicatorDatum[];
  }, [lang, manifest.slug]);

  const indicatorItems = [...baseIndicatorItems, ...dataIndicatorItems];

  const orderedSlugs = contentIndex.crises.map((entry) => entry.slug);
  const currentIndex = orderedSlugs.indexOf(manifest.slug);
  const prevSlug = currentIndex > 0 ? orderedSlugs[currentIndex - 1] : null;
  const nextSlug =
    currentIndex >= 0 && currentIndex < orderedSlugs.length - 1
      ? orderedSlugs[currentIndex + 1]
      : null;
  const getSlugTitle = (slug: string | null) => {
    if (!slug) return null;
    const entry = contentIndex.crises.find((item) => item.slug === slug);
    return entry
      ? lang === "de"
        ? entry.title.de
        : entry.title.en || entry.title.de
      : slug;
  };
  const prevTitle = getSlugTitle(prevSlug);
  const nextTitle = getSlugTitle(nextSlug);

  const evidenceEntries = useMemo<EvidenceEntry[]>(() => {
    const entries: EvidenceEntry[] = [];
    (manifest.timeline ?? []).forEach((event, idx) => {
      entries.push({
        id: `T-${String(idx + 1).padStart(3, "0")}`,
        title: `${event.year} • ${event.event}`,
        url: event.description
          ? `archiv://${manifest.slug}/timeline/${idx + 1}`
          : `#${manifest.slug}`,
        sourceType: "dataset",
      });
    });
    (manifest.signals ?? []).slice(0, 3).forEach((signal, idx) => {
      entries.push({
        id: `S-${String(idx + 1).padStart(3, "0")}`,
        title: pick(signal.label),
        url: signal.source ? `archiv://${manifest.slug}/signals/${idx + 1}` : `#${manifest.slug}`,
        sourceType: signal.source ? "report" : "other",
      });
    });
    return entries;
  }, [manifest]);

  const liveEvidenceItems = useMemo<LiveEvidenceItem[]>(() => {
    const results: Array<LiveEvidenceItem & { score: number }> = [];
    const citations = manifest.citations ?? [];
    citations.forEach((citation, idx) => {
      results.push({
        id: String(idx + 1).padStart(3, "0"),
        title: citation.label.toUpperCase(),
        url: citation.url || `archiv://${manifest.slug}/evidence/${idx + 1}`,
        source: citation.note,
        timestamp: manifest.lastUpdatedISO ? manifest.lastUpdatedISO.split("T")[0] : undefined,
        score: 30 - idx,
      });
    });

    (manifest.timeline ?? []).forEach((event, idx) => {
      results.push({
        id: String(results.length + idx + 1).padStart(3, "0"),
        title: event.event.toUpperCase(),
        url: event.description ? event.description : `#${manifest.slug}`,
        source: event.location,
        timestamp: event.year,
        score: 20 - idx,
      });
    });

    (manifest.signals ?? []).slice(0, 5).forEach((signal, idx) => {
      const label = typeof signal.label === "string" ? signal.label : pick(signal.label);
      results.push({
        id: String(results.length + idx + 1).padStart(3, "0"),
        title: `${label.toUpperCase()} DETECTED`,
        url: `#${manifest.slug}`,
        source: signal.source,
        timestamp: signal.value,
        score: 10 - idx,
      });
    });

    const uniqueByUrl = new Map<string, LiveEvidenceItem & { score: number }>();
    results.forEach((item) => {
      const key = `${item.url}-${item.title}`;
      const existing = uniqueByUrl.get(key);
      if (!existing || item.score > existing.score) {
        uniqueByUrl.set(key, item);
      }
    });

    const sorted = Array.from(uniqueByUrl.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ score, ...rest }) => rest);

    if (sorted.length < 5) {
      const filler = {
        id: String(sorted.length + 1).padStart(3, "0"),
        title: "SYSTEM NETSCAN ACTIVE",
        url: `#${manifest.slug}`,
        source: "AUTOMATED SCAN",
        timestamp: manifest.lastUpdatedISO ? manifest.lastUpdatedISO.split("T")[0] : undefined,
      };
      sorted.push(filler);
    }

    return sorted;
  }, [manifest]);

  const moduleLabels = {
    de: {
      indicators: "KENNDATEN",
      evidence: "EVIDENZPROTOKOLL",
    },
    en: {
      indicators: "INDICATORS",
      evidence: "EVIDENCE LOG",
    },
  }[lang];

  const info = {
    de: {
      indices: "Indizes",
      metrics: "Kenndaten",
      signals: "Signale",
      diagnosis: "Diagnose",
      mechanisms: "Mechanismen",
      archetypes: "Archetypen",
      glossary: "Glossar",
      related: "Verwandte Krisen",
      version: "Version",
      updated: "Letzte Aktualisierung",
      issues: "Schema-Validierungsfehler",
      citations: "Quellen",
      draft: "Entwurf",
      archived: "Archiviert",
      timeline: "Chronologie",
      qa: "Basale Diagnostik // W-Fragen",
      relatedSystems: "RELATED SYSTEMS",
      systemicLoad: "Systemische Belastung",
      cascading: "Kaskadeneffekte",
      interdependency: "Interdependency Graph",
      definition: "Definition"
    },
    en: {
      indices: "Indices",
      metrics: "Key metrics",
      signals: "Signals",
      diagnosis: "Diagnosis",
      mechanisms: "Mechanisms",
      archetypes: "Archetypes",
      glossary: "Glossary",
      related: "Related crises",
      version: "Version",
      updated: "Last updated",
      issues: "Schema validation issues",
      citations: "Citations",
      draft: "Draft",
      archived: "Archived",
      timeline: "Timeline",
      qa: "Basal diagnostics // W-questions",
      relatedSystems: "Related Systems",
      systemicLoad: "Systemic Load",
      cascading: "Cascading Risks",
      interdependency: "Interdependency Graph",
      definition: "Definition"
    },
  }[lang];

  const basalQaEntries = useMemo(() => {
    const base = manifest.qa ? [...manifest.qa] : [];
    const hasResponsibility = base.some((item) => {
      const question = item.question?.de?.toLowerCase() ?? "";
      return question.includes("wer ist") || question.includes("who is");
    });

    if (!hasResponsibility) {
      const categoryList = manifest.categories.join(" / ");
      base.push({
        question: {
          de: "Wer ist betroffen / verantwortlich?",
          en: "Who is affected / responsible?",
        },
        answer: {
          de: `Betroffen sind kommunale Netze, Versorgungsketten, soziale Bewegungen und Kontrollapparate, die ${categoryList} operationalisieren; Verantwortung tragen die Entscheidungskammern, strategischen Infrastrukturebenen und Technologielogiken, die diese Kategorien stabilisieren.`,
          en: `Affected are municipal grids, supply chains, social movements, and apparatuses of control that operationalise ${categoryList}; responsibility rests with decision chambers, infrastructural layers, and technological logics reinforcing those categories.`,
        },
      });
    }

    return base;
  }, [manifest]);

  const baseUrl =
    typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : "";
  const shareLink = baseUrl ? `${baseUrl}#${manifest.slug}` : manifest.slug;
  const shareCopyText = `${pick(manifest.title)} — ${pick(manifest.summary)} // ${shareLink}`;

  const handleShare = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: pick(manifest.title),
          text: pick(manifest.summary),
          url: shareLink,
        });
        setShareStatus(lang === "de" ? "Link geteilt" : "Link shared");
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareCopyText);
      } else {
        throw new Error("Clipboard unavailable");
      }
      setShareStatus(lang === "de" ? "Link kopiert" : "Link copied");
    } catch (error) {
      setShareStatus(lang === "de" ? "Teilen fehlgeschlagen" : "Share failed");
      console.error("Share error", error);
    }
  };

  useEffect(() => {
    if (!shareStatus || typeof window === "undefined") return;
    const timer = window.setTimeout(() => setShareStatus(null), 2500);
    return () => window.clearTimeout(timer);
  }, [shareStatus]);

  useEffect(() => {
    setImagesLoaded(0);
  }, [manifest.slug, totalMediaImages]);

  useEffect(() => {
    setDetailProgress(20);
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setDetailProgress(45), 120));
    timers.push(
      window.setTimeout(() => setDetailProgress(totalMediaImages ? 70 : 100), 360),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [manifest.slug, totalMediaImages]);

  const handleMediaImageLoad = () => {
    if (!totalMediaImages) return;
    setImagesLoaded((prev) => Math.min(totalMediaImages, prev + 1));
  };

  const mediaProgress = totalMediaImages === 0 ? 100 : Math.round((imagesLoaded / totalMediaImages) * 100);
  const mediaPhaseWeight = totalMediaImages ? 30 : 0;
  const overallProgress = Math.min(100, detailProgress + (mediaProgress / 100) * mediaPhaseWeight);
  const showProgress = overallProgress < 100;
  const progressSubtitle = totalMediaImages
    ? `${imagesLoaded}/${totalMediaImages} visuals ready`
    : "Manifest ready";
  const progressStages = ["Manifest", totalMediaImages ? "Media" : undefined].filter(
    (stage): stage is string => Boolean(stage),
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pb-32 animate-fade-in">
      <div className="flex justify-between items-center mb-16 flex-wrap gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          <button
            onClick={onBack}
            className="mono text-[10px] uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all flex items-center gap-3"
          >
            <span>←</span> Kanon
          </button>
          <div className="mono text-[9px] uppercase tracking-[0.3em] text-white/30">
            {info.version}: {manifest.version}
          </div>
          {manifest.status === "draft" && (
            <span className="mono text-[9px] uppercase tracking-[0.3em] text-white px-2 py-1 border border-accent bg-accent/20">
              {info.draft}
            </span>
          )}
          {manifest.status === "locked" && (
            <span className="mono text-[9px] uppercase tracking-[0.3em] text-white/60 px-2 py-1 border border-white/20">
              {info.archived}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="mono text-[9px] uppercase tracking-[0.3em] text-white/30">
            {info.updated}: {manifest.lastUpdatedISO.split("T")[0]}
          </div>
          <button
            onClick={handleShare}
            className="mono text-[9px] uppercase tracking-[0.3em] border border-white/20 px-4 py-2 hover:border-white/40 transition-all"
          >
            {lang === "de" ? "TEILEN / SPEICHERN" : "SHARE / SAVE"}
          </button>
          {shareStatus && (
            <span className="mono text-[9px] uppercase tracking-[0.3em] text-white/40">
              {shareStatus}
            </span>
          )}
        </div>
      </div>

      {showProgress && (
        <div className="mb-6">
          <LoadingProgressBar
            progress={overallProgress}
            label={`${manifest.slug.toUpperCase()} // MANIFEST LOAD`}
            subtitle={progressSubtitle}
            stages={progressStages}
          />
        </div>
      )}

      <header className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20 border-b border-white/5 pb-12">
        <div className="lg:col-span-8 space-y-6">
        <div className="flex flex-wrap gap-3">
          {manifest.categories.map((cat) => {
            const color = CATEGORY_COLORS[cat as CrisisCategory] || COLORS.default;
            return (
              <button
                key={cat}
                className="relative group overflow-hidden rounded px-3 py-1 border border-white/10 bg-black/30"
                style={{ borderColor: `${color.base}40` }}
              >
                <span
                  className="mono text-[9px] uppercase tracking-[0.3em] font-black transition-colors duration-500"
                  style={{ color: color.text }}
                >
                  {CATEGORY_LABELS[lang][cat as keyof typeof CATEGORY_LABELS["de"]] || cat}
                </span>
                <span
                  className="absolute left-0 bottom-0 h-[2px] w-full transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"
                  style={{ background: `linear-gradient(90deg, ${color.base}, ${color.accent})` }}
                />
                <span
                  className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <h2 className="text-[8vw] md:text-[6vw] font-black uppercase leading-[0.85] tracking-tighter">
            {pick(manifest.title)}
          </h2>
        </div>
          <div className="border border-white/10 bg-white/[0.02] p-6 max-w-3xl">
            <div className="mono text-[9px] uppercase tracking-[0.4em] text-white/40 mb-3">
              {info.definition}
            </div>
            <p className="text-xl md:text-2xl font-light leading-relaxed text-white/70 space-y-1">
              {renderText(pick(manifest.summary))}
            </p>
          </div>
        </div>

        <div className="lg:col-span-4 grid grid-cols-3 gap-4 border border-white/10 p-4 bg-white/[0.02]">
          <div className="col-span-1">
            <div className="mono text-[8px] uppercase tracking-[0.3em] text-white/40 mb-2">
              {lang === "de" ? "Schwere" : "Severity"}
            </div>
            <div className="text-3xl font-black">{manifest.severity}</div>
            <div className="w-full h-1 bg-white/10 mt-2">
              <div className="h-full bg-white" style={{ width: `${manifest.severity}%` }} />
            </div>
          </div>
          <div className="col-span-1">
            <div className="mono text-[8px] uppercase tracking-[0.3em] text-white/40 mb-2">
              {lang === "de" ? "Volatilität" : "Volatility"}
            </div>
            <div className="text-3xl font-black">{manifest.volatility}</div>
            <div className="w-full h-1 bg-white/10 mt-2">
              <div className="h-full bg-white/60" style={{ width: `${manifest.volatility}%` }} />
            </div>
          </div>
          <div className="col-span-1">
            <div className="mono text-[8px] uppercase tracking-[0.3em] text-white/40 mb-2">Horizon</div>
            <div className="text-lg font-black uppercase tracking-wide">{pick(horizonLabel)}</div>
          </div>
          {manifest.signals.slice(0, 3).map((signal, idx) => (
            <div key={`${signal.value}-${idx}`} className="col-span-3 border-t border-white/10 pt-3">
              <div className="mono text-[8px] uppercase tracking-[0.3em] text-white/40 mb-1">
                {info.metrics}
              </div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="mono text-[9px] uppercase tracking-[0.3em] text-white/60">{pick(signal.label)}</div>
                  {signal.source && <div className="mono text-[8px] text-white/30">{signal.source}</div>}
                </div>
                <div className="mono text-[11px] font-black text-white text-right">{signal.value}</div>
              </div>
            </div>
          ))}
        </div>
      </header>

      {liveEvidenceItems.length > 0 && (
        <section className="mb-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-[1px] bg-white/10 flex-1" />
            <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/40">
              {moduleLabels.evidence}
            </span>
            <div className="h-[1px] bg-white/10 flex-1" />
          </div>
          <LiveEvidenceGrid items={liveEvidenceItems} />
        </section>
      )}

      <div className="mb-10 border border-white/5 bg-white/[0.01] p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="mono text-[9px] uppercase tracking-[0.4em] text-white/40">{info.systemicLoad}</div>
            <div className="text-4xl font-black tracking-tight text-white">{systemicLoadValue}</div>
            <div className="w-full h-1 bg-white/10">
              <div className="h-full bg-gradient-to-r from-red-500 to-red-400" style={{ width: `${systemicLoadValue}%` }} />
            </div>
          </div>
          <p className="text-sm text-white/50 max-w-3xl">
            {pick(manifest.summary)} {" "}
            {manifest.categories.includes("Systemic Fragility") ? (
              <span className="text-red-500 font-semibold">Systemic Fragility mode engaged.</span>
            ) : (
              <span className="text-white/40">Systemic fragility outlines how {pick(manifest.title)} feeds into wider loads.</span>
            )}
          </p>
        </div>
      </div>

      {issues && issues.length > 0 && (
        <div className="border border-red-500/40 bg-red-500/10 text-red-100 p-4 mb-10 space-y-2">
          <div className="mono text-[10px] uppercase tracking-[0.3em]">{info.issues}</div>
          {issues.flatMap((issue) =>
            issue.errors.map((err, idx) => (
              <div key={`${issue.slug}-${idx}`} className="text-xs">
                <span className="mono text-[9px] text-red-200">{err.instancePath || "/"}</span> —{" "}
                {err.message}
              </div>
            )),
          )}
        </div>
      )}

      <section className="mb-16 space-y-6">
        <div className="border border-white/10 bg-black/30 p-4">
          <div className="mono text-[9px] uppercase tracking-[0.5em] text-white/40 mb-3">
            {moduleLabels.indicators}
          </div>
          <IndicatorsPanel indicators={indicatorItems} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
        <div className="lg:col-span-7 space-y-8">
          <h3 className="mono text-[10px] uppercase tracking-[0.4em] text-white/40">{info.diagnosis}</h3>
          <div className="text-lg md:text-xl font-light leading-relaxed text-white/70 space-y-4">
            {renderText(pick(manifest.diagnosis))}
          </div>
          <h4 className="mono text-[10px] uppercase tracking-[0.4em] text-white/40">{info.mechanisms}</h4>
          <div className="text-base md:text-lg font-light leading-relaxed text-white/60 space-y-3">
            {renderText(pick(manifest.mechanisms))}
          </div>
        </div>

        <div className="lg:col-span-5 border border-white/10 p-6 space-y-6 bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <h3 className="mono text-[10px] uppercase tracking-[0.4em] text-white/40">{info.signals}</h3>
            <div className="w-16 h-[1px] bg-white/10" />
          </div>
          <div className="space-y-4">
            {manifest.signals.map((signal, idx) => (
              <div key={idx} className="flex justify-between items-start gap-3">
                <div>
                  <div className="mono text-[9px] uppercase tracking-[0.3em] text-white/60">
                    {renderText(pick(signal.label))}
                  </div>
                  {signal.source && <div className="mono text-[8px] text-white/30">{signal.source}</div>}
                </div>
                <div className="mono text-[11px] font-black text-white">{signal.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {cascadeEntries.length > 0 && (
        <section className="mb-16 border border-white/5 bg-white/[0.01] p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] bg-white/10 flex-grow" />
            <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">{info.cascading}</span>
            <div className="h-[1px] bg-white/10 flex-grow" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cascadeEntries.map((entry) => (
              <article key={entry.slug} className="border border-white/10 p-4 bg-white/[0.01] hover:border-white/40 transition-all">
                <h4 className="text-xl font-black uppercase tracking-tight">{pick(entry.title)}</h4>
                <div className="mono text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3">
                  Severity {entry.severity} • {entry.categories.join(", ")}
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{renderText(pick(entry.summary))}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="mono text-[8px] uppercase tracking-[0.3em] text-white/50">Trigger</span>
                  <span className="mono text-[8px] uppercase tracking-[0.3em] text-red-500">{entry.slug}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {missingGlossaryTerms.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] bg-white/10 flex-grow" />
            <span className="mono text-[9px] uppercase tracking-[0.3em] text-white/40">Glossar-Links</span>
            <div className="h-[1px] bg-white/10 flex-grow" />
          </div>
          <div className="flex flex-wrap gap-3">
            {missingGlossaryTerms.map((term, idx) => (
              <button
                key={`${term}-${idx}`}
                onClick={() => {
                  const entry = manifest.glossary.find((g) => g.term.toLowerCase() === term.toLowerCase());
                  if (entry) onGlossaryClick(entry);
                }}
                className="mono text-[9px] uppercase tracking-[0.3em] border border-white/15 px-3 py-2 hover:border-accent hover:text-accent transition-all"
              >
                [{term}]
              </button>
            ))}
          </div>
        </section>
      )}

      {manifest.qa && manifest.qa.length > 0 && (
        <section className="mb-16 border border-white/5 bg-white/[0.01] p-12">
          <div className="mb-10">
            <h3 className="mono text-[10px] uppercase tracking-[0.5em] text-white/20 font-black border-b border-white/10 pb-4">
              <span className="block">{info.qa}</span>
              <span className="mono text-[8px] uppercase tracking-[0.6em] text-white/40 mt-1">BASAL DIAGNOSTIK</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {basalQaEntries.map((item, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-[13px] font-black uppercase tracking-[0.3em] border-l-2 border-red-500 pl-4 text-red-500">
                  {renderText(pick(item.question))}
                </h4>
                <p className="text-white/60 text-lg font-light leading-relaxed">
                  {renderText(pick(item.answer))}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-16 border border-white/5 bg-white/[0.01] p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] bg-white/10 flex-grow" />
          <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">{info.interdependency}</span>
          <div className="h-[1px] bg-white/10 flex-grow" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interdependencyNodes.map((node) => {
            const categoryLabel =
              CATEGORY_LABELS[lang][node.category as CrisisCategory] || node.category;
            return (
              <div key={node.category} className="border border-white/10 bg-black/40 p-4">
                <div className="mono text-[9px] uppercase tracking-[0.4em] text-white/40 mb-3">
                  {categoryLabel}
                </div>
                {node.connections.length === 0 ? (
                  <p className="text-white/50 text-sm leading-relaxed">
                    {noConnectionsText}
                  </p>
                ) : (
                  <ul className="space-y-2 text-sm text-white/60">
                    {node.connections.map((entry) => (
                      <li key={entry.slug} className="flex justify-between gap-4 items-center">
                        <span>{pick(entry.title)}</span>
                        <span className="mono text-[8px] uppercase tracking-[0.3em] text-white/30">
                          Severity {entry.severity}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 text-[9px] uppercase tracking-[0.3em] text-white/30">
                  {node.connections.length} {destabilizesLabel}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 text-[9px] uppercase tracking-[0.4em] text-white/30">
          <span>{cascadeSummaryText}</span>
          <span>
            {loadSummaryText} // {systemicLoadValue}%
          </span>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] bg-white/10 flex-grow" />
          <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">{info.archetypes}</span>
          <div className="h-[1px] bg-white/10 flex-grow" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {manifest.archetypes.map((arch, idx) => (
            <div key={idx} className="border border-white/10 p-6 bg-white/[0.02] hover:border-white/40 transition-all">
              <div className="mono text-[9px] uppercase tracking-[0.3em] text-white/40 mb-2">
                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
              </div>
              <h4 className="text-xl font-black uppercase tracking-tight mb-3">{pick(arch.name)}</h4>
              <p className="text-white/60 leading-relaxed text-sm">{renderText(pick(arch.description))}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16 border-t border-white/10 pt-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] bg-white/10 flex-grow" />
          <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">{info.glossary}</span>
          <div className="h-[1px] bg-white/10 flex-grow" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {manifest.glossary.map((entry, idx) => (
            <button
              key={idx}
              onClick={() => onGlossaryClick(entry)}
              className="text-left border border-white/10 p-4 hover:border-white/40 transition-all bg-white/[0.02]"
            >
              <div className="mono text-[9px] uppercase tracking-[0.3em] text-white/40 mb-2">{entry.term}</div>
              <p className="text-white/70 text-sm leading-relaxed">{pick(entry.definition)}</p>
              {entry.archetypeLink && (
                <div className="mono text-[8px] text-white/30 mt-2">Archetype: {entry.archetypeLink}</div>
              )}
            </button>
          ))}
        </div>
      </section>

      {evidenceEntries.length > 0 && (
        <section className="mb-16 border border-white/10 bg-black/30 p-4">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-[1px] bg-white/10 flex-grow" />
            <span className="mono text-[9px] uppercase tracking-[0.5em] text-white/40">
              {moduleLabels.evidence}
            </span>
            <div className="h-[1px] bg-white/10 flex-grow" />
          </div>
          <EvidenceLog items={evidenceEntries} />
        </section>
      )}

      {manifest.citations && manifest.citations.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] bg-white/10 flex-grow" />
            <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">{info.citations}</span>
            <div className="h-[1px] bg-white/10 flex-grow" />
          </div>
          <ul className="space-y-4">
            {manifest.citations.map((c, idx) => (
              <li
                key={idx}
                className="border border-white/10 bg-white/[0.02] p-4 rounded-sm hover:border-white/30 transition-all"
              >
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 text-white/80 font-medium hover:text-accent transition-colors"
                  >
                    <span className="text-base">{c.label}</span>
                    <span className="text-[12px] mono uppercase tracking-[0.3em]">↗</span>
                  </a>
                ) : (
                  <div className="text-white/80 font-medium">{c.label}</div>
                )}
                {c.note && (
                  <div className="mt-2 mono text-[8px] uppercase tracking-[0.4em] text-white/40">
                    — {c.note}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {manifest.timeline && manifest.timeline.length > 0 && (
        <section className="mb-24 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-[1px] bg-white/10 flex-grow" />
            <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">{info.timeline}</span>
            <div className="h-[1px] bg-white/10 flex-grow" />
          </div>
          <HistoricalTimeline events={manifest.timeline} />
        </section>
      )}

      {hasMedia && (
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] bg-white/10 flex-grow" />
            <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">Media</span>
            <div className="h-[1px] bg-white/10 flex-grow" />
          </div>

          {/* Video Section - ARCHIV_AUFZEICHNUNG */}
          {mediaVideos.length > 0 && (
            <div className="mb-8">
              <div className="grid grid-cols-1 gap-6">
                {mediaVideos.map((src: string, idx: number) => (
                  <div key={`video-${src}-${idx}`} className="border border-white/10">
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/30">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${true ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="mono text-[10px] uppercase tracking-[0.4em] text-white/60">
                          OBSERVATION_FEED // ARCHIV_AUFZEICHNUNG
                        </span>
                      </div>
                      <div className="mono text-[10px] uppercase tracking-[0.3em] text-white/40 tabular-nums">
                        {new Date().toISOString().split('T')[0]} {new Date().toISOString().split('T')[1].split('.')[0]}
                      </div>
                    </div>

                    {/* Video Container */}
                    <div className="relative overflow-hidden aspect-video bg-black/50">
                      {/* Scanlines Overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-10"
                        style={{
                          backgroundImage: `repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 2px,
                            rgba(255,255,255,0.1) 2px,
                            rgba(255,255,255,0.1) 4px
                          )`
                        }}
                      ></div>

                      {/* Grain Overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-5"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                        }}
                      ></div>

                      <video
                        src={src}
                        controls
                        className="absolute inset-0 w-full h-full object-contain"
                        poster={src.replace('.mp4', '_vid_0.png')}
                        style={{
                          filter: 'grayscale(100%) contrast(120%) brightness(80%)'
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>

                      {/* Hover Brightness Effect */}
                      <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                    </div>

                    {/* Diagnostic Logger */}
                    {videoLoadingState === 'loading' && (
                      <div className="p-4 border-t border-white/10 bg-black/40">
                        <div className="space-y-2 mb-4">
                          {loadingMessages.map((message, idx) => (
                            <div key={idx} className="mono text-[9px] uppercase tracking-[0.3em] text-green-400">
                              {message}
                            </div>
                          ))}
                        </div>
                        <div className="w-full h-1 bg-white/20">
                          <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${loadingProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Extraction Button */}
                    {videoLoadingState !== 'loading' && (
                      <div className="p-4 border-t border-white/10 bg-black/20">
                        <button
                          onClick={startVideoExtraction}
                          className="w-full px-6 py-3 border border-white/20 text-white/80 hover:border-white hover:text-white hover:bg-white/5 transition-all duration-300 mono text-[10px] uppercase tracking-[0.4em] font-medium"
                        >
                          BEOBACHTUNG EXTRAHIEREN
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images Section */}
          {mediaImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaImages.map((src: string, idx: number) => (
                <div
                  key={`${src}-${idx}`}
                  className="relative overflow-hidden border border-white/10 bg-white/[0.03] aspect-[4/3] group"
                >
                  <img
                    src={src}
                    alt={`${manifest.slug} media ${idx + 1}`}
                    onLoad={handleMediaImageLoad}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
                  <div className="absolute bottom-2 left-2 mono text-[9px] uppercase tracking-[0.3em] text-white/60">
                    Visual placeholder
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="border-t border-white/10 pt-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] bg-white/10 flex-grow" />
          <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">{info.related}</span>
          <div className="h-[1px] bg-white/10 flex-grow" />
        </div>
        {related.length === 0 ? (
          <div className="mono text-[9px] uppercase tracking-[0.3em] text-white/20">Keine verwandten Einträge</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map((item) => (
              <div key={item.slug} className="border border-white/10 p-4 hover:border-white/40 transition-all">
                <div className="mono text-[8px] uppercase tracking-[0.3em] text-white/30 mb-2">
                  {item.categories.join(", ")}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-black uppercase tracking-tight">{item.title}</h4>
                  <span className="mono text-[9px] text-white/40">Severity {item.severity}</span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  {getSummarySentence(item.summary)}
                </p>
                <button
                  onClick={() => (window.location.hash = item.slug)}
                  className="mt-3 mono text-[9px] uppercase tracking-[0.3em] text-white/60 hover:text-white transition-all"
                >
                  {lang === "de" ? "Öffnen" : "Open"} →
                </button>
              </div>
            ))}
          </div>
       )}
      </section>

      {manifest.keywords && manifest.keywords.length > 0 && (
        <section className="border border-white/10 p-6 bg-black/50 mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] bg-white/10 flex-grow" />
            <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">
              {info.relatedSystems}
            </span>
            <div className="h-[1px] bg-white/10 flex-grow" />
          </div>
          <div className="flex flex-wrap gap-4">
            {manifest.keywords.map((keyword) => (
              <button
                key={keyword}
                onClick={() => {
                  onKeywordClick?.(keyword);
                  window.location.hash = `keyword/${encodeURIComponent(keyword)}`;
                }}
                className="mono text-[9px] uppercase tracking-[0.4em] px-4 py-3 border border-white/10 transition-all duration-500 hover:border-accent hover:text-accent"
              >
                {keyword}
              </button>
            ))}
          </div>
          <p className="mono text-[8px] uppercase tracking-[0.5em] text-white/30 mt-6">
            Click to access the corresponding archetype dossier.
          </p>
        </section>
      )}

      {/* Collaborative Annotations Section */}
      <section className="border-t border-white/10 pt-12 mt-16">
        <AnnotationSystem
          crisis={record.manifest}
          lang={lang}
        />
      </section>

      <section className="mt-12 mb-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <button
          onClick={() => prevSlug && (window.location.hash = prevSlug)}
          disabled={!prevSlug}
          className={`mono text-[10px] uppercase tracking-[0.3em] border border-white/20 px-6 py-3 transition-all ${
            prevSlug ? "hover:bg-white hover:text-black" : "text-white/40 border-white/10 cursor-not-allowed"
          }`}
        >
          {lang === "de" ? "Vorherige Krise" : "Previous crisis"}
          {prevTitle && (
            <span className="block text-[12px] font-light tracking-[0.2em] text-white/60 mt-2">{prevTitle}</span>
          )}
        </button>
        <button
          onClick={() => nextSlug && (window.location.hash = nextSlug)}
          disabled={!nextSlug}
          className={`mono text-[10px] uppercase tracking-[0.3em] border border-white/20 px-6 py-3 transition-all ${
            nextSlug ? "hover:bg-white hover:text-black" : "text-white/40 border-white/10 cursor-not-allowed"
          }`}
        >
          {lang === "de" ? "Nächste Krise" : "Next crisis"}
          {nextTitle && (
            <span className="block text-[12px] font-light tracking-[0.2em] text-white/60 mt-2">{nextTitle}</span>
          )}
        </button>
      </section>
    </div>
  );
};
