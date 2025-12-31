import type { ErrorObject } from "ajv";

export type Language = "de" | "en";

export type CrisisCategory =
  | "Materie"
  | "Existenz"
  | "Macht"
  | "Kontrolle"
  | "Gefühl"
  | "Systemic Fragility";
export const CATEGORY_ORDER: CrisisCategory[] = [
  "Materie",
  "Existenz",
  "Macht",
  "Kontrolle",
  "Gefühl",
  "Systemic Fragility",
];

export const CATEGORY_LABELS: Record<Language, Record<CrisisCategory, string>> = {
  de: {
    Materie: "Materie",
    Existenz: "Existenz",
    Macht: "Macht",
    Kontrolle: "Kontrolle",
    Gefühl: "Gefühl",
    "Systemic Fragility": "Systemische Fragilität",
  },
  en: {
    Materie: "Matter",
    Existenz: "Existence",
    Macht: "Power",
    Kontrolle: "Control",
    Gefühl: "Affect",
    "Systemic Fragility": "Systemic Fragility",
  },
};

export type LocalizedString = { de: string; en: string };

export type TimeHorizon = "immediate" | "mid" | "long";

export interface CrisisSignal {
  label: LocalizedString;
  value: string;
  source?: string;
}

export interface CrisisArchetype {
  name: LocalizedString;
  description: LocalizedString;
}

export interface CrisisGlossaryEntry {
  term: string;
  definition: LocalizedString;
  archetypeLink?: string;
}

export interface CrisisCitation {
  label: string;
  url?: string;
  note?: string;
}

export interface CrisisMedia {
  images?: string[];
  audio?: string[];
  video?: string[];
}

export interface CrisisTimelineItem {
  year: string;
  location?: string;
  event: string;
  description?: string;
}

export interface CrisisManifest {
  id: string;
  slug: string;
  title: LocalizedString;
  summary: LocalizedString;
  categories: CrisisCategory[] | string[];
  tags: string[];
  keywords?: string[];
  qa?: { question: LocalizedString; answer: LocalizedString }[];
  severity: number;
  volatility: number;
  timeHorizon: TimeHorizon;
  signals: CrisisSignal[];
  diagnosis: LocalizedString;
  mechanisms: LocalizedString;
  archetypes: CrisisArchetype[];
  glossary: CrisisGlossaryEntry[];
  triggers?: string[];
  related: string[];
  lastUpdatedISO: string;
  version: string;
  criticalThreshold?: string;
  status: "missing" | "draft" | "locked";
  generatedBy: {
    provider: "none" | "gemini" | "manual";
    model?: string;
    seed?: string;
    generatedAtISO?: string;
  };
  editNotes?: string[];
  lockReason?: string;
  citations?: CrisisCitation[];
  media?: CrisisMedia;
  systemicLoad?: number;
  timeline?: CrisisTimelineItem[];
}

export interface CrisisIndexItem {
  slug: string;
  id: string;
  title: string;
  summary: string;
  categories: CrisisCategory[];
  tags: string[];
  severity: number;
  volatility: number;
  timeHorizon: TimeHorizon;
  lastUpdatedISO: string;
  version: string;
  status: CrisisManifest["status"];
  systemicLoad?: number;
}

export interface CrisisRecord {
  slug: string;
  lang: Language;
  manifest: CrisisManifest;
  validationErrors?: ErrorObject[] | null;
}

export interface CrisisValidationIssue {
  slug: string;
  lang: Language;
  errors: ErrorObject[];
}
