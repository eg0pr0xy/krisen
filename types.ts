export {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type CrisisArchetype,
  type CrisisCategory,
  type CrisisCitation,
  type CrisisGlossaryEntry,
  type CrisisIndexItem,
  type CrisisManifest,
  type CrisisMedia,
  type CrisisRecord,
  type CrisisSignal,
  type CrisisValidationIssue,
  type Language,
  type LocalizedString,
  type TimeHorizon,
} from "./src/content/types";

// Backwards-compatible aliases for legacy imports
export type Category = import("./src/content/types").CrisisCategory;
export type Crisis = import("./src/content/types").CrisisIndexItem;

// Legacy analysis constructs retained for compatibility
export interface Metric {
  label: string;
  value: number;
}

export interface TimelineEvent {
  year: string;
  location: string;
  event: string;
  description: string;
}

export interface Symptom {
  title: string;
  description: string;
}

export interface KeywordArchetype {
  id: string;
  title: string;
  etymology: string;
  scientificPerspective: string;
  socioCulturalLens: string;
  manifestation: string;
  visualPrompt: string;
  imageUrl?: string;
}

export interface CrisisManifesto {
  definition: string;
  philosophicalDiscourse: string;
  scientificAnalysis: string;
  qa: {
    question: string;
    answer: string;
  }[];
  symptoms: Symptom[];
  consequences: string;
  callToAction: string;
  philosophicalFragment: string;
  historicalContext: string;
  historicalTimeline: TimelineEvent[];
  sociopsychologicalAnalysis: string;
  keywords: string[];
  statisticalData: {
    label: string;
    value: string;
    trend: "up" | "down" | "stable";
    isVerified?: boolean;
    interpretation: string;
  }[];
  visualizationData: Metric[];
  visualPrompt: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  lastUpdated?: string;
}

export interface IndicatorDescriptor {
  id: string;
  label: {
    de: string;
    en: string;
  };
  description?: {
    de?: string;
    en?: string;
  };
  value?: string | number;
  unit?: string;
  timestamp?: string;
  dimensions?: Record<string, string>;
  source?: string;
}

export interface IndicatorMapping {
  crisisSlug: string;
  indicatorId: string;
  score: number;
  roles: Array<"primary" | "secondary">;
}
