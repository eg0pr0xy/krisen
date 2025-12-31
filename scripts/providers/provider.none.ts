import { CrisisManifest, CrisisCategory, Language, LocalizedString, TimeHorizon } from "../../types";

export interface GenerationContext {
  slug: string;
  lang: Language;
  seed?: number;
}

const numericSeed = (input: string | number | undefined): number => {
  if (typeof input === "number" && Number.isFinite(input)) return Math.abs(input);
  const str = String(input ?? "seed");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
};

export const deterministicValue = (seed: string | number | undefined, modulus = 97) => {
  const base = numericSeed(seed);
  const a = 1103515245;
  const c = 12345;
  const m = 2 ** 31;
  const next = (a * base + c) % m;
  return next % modulus;
};

const BASE_CATEGORIES: CrisisCategory[] = ["Materie", "Existenz", "Macht", "Kontrolle", "Gefühl"];
const HORIZONS: TimeHorizon[] = ["immediate", "mid", "long"];

const localized = (de: string, en?: string): LocalizedString => ({ de, en: en ?? de });

export function generatePlaceholderManifest(ctx: GenerationContext): CrisisManifest {
  const baseSeed = deterministicValue(ctx.seed ?? ctx.slug);
  const category = BASE_CATEGORIES[baseSeed % BASE_CATEGORIES.length];
  const severity = 40 + (baseSeed % 50);
  const volatility = 30 + ((baseSeed * 3) % 60);
  const horizon = HORIZONS[baseSeed % HORIZONS.length];
  const day = (baseSeed % 28) + 1;
  const isoDate = new Date(Date.UTC(2025, 0, day)).toISOString();

  const title = localized(ctx.slug.replace(/-/g, " ").toUpperCase(), ctx.slug.replace(/-/g, " "));
  const summary = localized(
    `${ctx.slug} zeigt eine strukturelle Störung in ${category}.`,
    `${ctx.slug} exposes a structural disturbance in ${category}.`,
  );

  return {
    id: ctx.slug,
    slug: ctx.slug,
    title,
    summary,
    categories: [category],
    tags: [`seed-${baseSeed}`, category.toLowerCase(), "placeholder"],
    severity,
    volatility,
    timeHorizon: horizon,
    signals: [
      { label: localized("Basis-Signal", "Baseline signal"), value: `${50 + (baseSeed % 30)}%` },
      { label: localized("Drift", "Drift"), value: `${baseSeed % 9}σ` },
    ],
    diagnosis: localized(
      "Deterministische Platzhalterdiagnose. Struktur bleibt ausfüllbar.",
      "Deterministic placeholder diagnosis. Structure remains fillable.",
    ),
    mechanisms: localized(
      "Mechanismus folgt einem einfachen Seed-Generator; ersetzt später echte Beobachtungen.",
      "Mechanism follows a simple seed generator; replace with real observation later.",
    ),
    archetypes: [
      {
        name: localized("Attraktor", "Attractor"),
        description: localized(
          "Reduziert Vielschichtigkeit auf einen stabilen Punkt.",
          "Reduces complexity to a stable point.",
        ),
      },
      {
        name: localized("Driftzone", "Drift Zone"),
        description: localized(
          "Langsamer Parameter-Shift ohne sofortigen Alarm.",
          "Slow parameter shift without immediate alarm.",
        ),
      },
    ],
    glossary: [
      { term: "Placeholder", definition: localized("Temporärer Füllwert.", "Temporary fill value.") },
      { term: "Seed", definition: localized("Deterministischer Startwert.", "Deterministic starting value.") },
    ],
    related: [],
    lastUpdatedISO: isoDate,
    version: "0.1.0",
    citations: [{ label: "Local generator" }],
    media: {},
  };
}
