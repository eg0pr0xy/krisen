import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "./schema/crisisManifest.schema.json";
import {
  CATEGORY_ORDER,
  CrisisCategory,
  CrisisIndexItem,
  CrisisManifest,
  CrisisRecord,
  CrisisValidationIssue,
  Language,
  LocalizedString,
} from "./types";

type ManifestRegistry = Record<string, Partial<Record<Language, CrisisRecord>>>;

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true, strict: false });
addFormats(ajv);
const validate = ajv.compile<CrisisManifest>(schema as any);

const manifestModules = import.meta.glob("../../content/crises/**/manifest.{de,en}.json", {
  eager: true,
});

const CATEGORY_NORMALIZATION: Record<string, CrisisCategory> = {
  materie: "Materie",
  matter: "Materie",
  existenz: "Existenz",
  existence: "Existenz",
  macht: "Macht",
  power: "Macht",
  kontrolle: "Kontrolle",
  control: "Kontrolle",
  gefühl: "Gefühl",
  gefuehl: "Gefühl",
  affect: "Gefühl",
  "systemic fragility": "Systemic Fragility",
  "systemische fragilität": "Systemic Fragility",
};

const registry: ManifestRegistry = {};
const issues: CrisisValidationIssue[] = [];
function normalizeCategory(value: string): CrisisCategory {
  const key = value.toLowerCase();
  return CATEGORY_NORMALIZATION[key] ?? (value as CrisisCategory);
}

function pickLangValue(field: LocalizedString, lang: Language): string {
  return field[lang] ?? field.de ?? field.en ?? "";
}

Object.entries(manifestModules).forEach(([path, mod]) => {
  const manifest = ((mod as any).default ?? mod) as CrisisManifest;
  const langMatch = path.match(/manifest\.(de|en)\.json$/);
  const lang = (langMatch?.[1] as Language) || "de";
  const slugMatch = path.match(/content\/crises\/([^/]+)\//);
  const slug = slugMatch?.[1];
  if (!slug) return;

  const normalizedManifest: CrisisManifest = {
    ...manifest,
    categories: (manifest.categories || []).map((c) => normalizeCategory(c)),
  };

  const valid = validate(normalizedManifest);
  const validationErrors = valid ? null : validate.errors ? [...validate.errors] : null;

  if (!registry[slug]) {
    registry[slug] = {};
  }

  registry[slug][lang] = {
    slug,
    lang,
    manifest: normalizedManifest,
    validationErrors,
  };

  if (validationErrors?.length) {
    issues.push({ slug, lang, errors: validationErrors });
  }
});

const contentVersion = Object.values(registry)
  .flatMap((entry) =>
    Object.values(entry).map(
      (record) => `${record?.manifest.slug}@${record?.manifest.version}-${record?.manifest.lastUpdatedISO}`,
    ),
  )
  .filter(Boolean)
  .sort()
  .join("|");

function hashString(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

const contentVersionHash = `${hashString(contentVersion).slice(0, 8)}-${Object.keys(registry).length}`;

function toIndexItem(record: CrisisRecord, lang: Language): CrisisIndexItem {
  return {
    slug: record.manifest.slug,
    id: record.manifest.id,
    title: pickLangValue(record.manifest.title, lang),
    summary: pickLangValue(record.manifest.summary, lang),
    categories: record.manifest.categories.map((c) => normalizeCategory(String(c))),
    tags: record.manifest.tags,
    severity: record.manifest.severity,
    volatility: record.manifest.volatility,
    timeHorizon: record.manifest.timeHorizon,
    lastUpdatedISO: record.manifest.lastUpdatedISO,
    version: record.manifest.version,
    status: record.manifest.status,
    systemicLoad: record.manifest.systemicLoad,
  };
}

function getRecord(slug: string, lang: Language): CrisisRecord | null {
  const entry = registry[slug];
  if (!entry) return null;
  return entry[lang] || entry.de || entry.en || null;
}

export function getAllCrises(lang: Language): CrisisIndexItem[] {
  const items: CrisisIndexItem[] = [];
  Object.values(registry).forEach((entry) => {
    const record = entry[lang] || entry.de || entry.en;
    if (record) items.push(toIndexItem(record, lang));
  });

  return items.sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getCrisis(slug: string, lang: Language): CrisisRecord | null {
  return getRecord(slug, lang);
}

export function getRelated(slug: string, lang: Language): CrisisIndexItem[] {
  const base = getRecord(slug, lang);
  if (!base) return [];
  return base.manifest.related
    .map((relatedSlug) => getRecord(relatedSlug, lang))
    .filter((item): item is CrisisRecord => Boolean(item))
    .map((record) => toIndexItem(record, lang));
}

export function getManifestMap(): Record<string, CrisisManifest> {
  const map: Record<string, CrisisManifest> = {};
  Object.entries(registry).forEach(([slug, localized]) => {
    const record = localized.de || localized.en;
    if (record) map[slug] = record.manifest;
  });
  return map;
}

export function getValidationIssues(): CrisisValidationIssue[] {
  return issues;
}

export const getContentVersion = () => contentVersionHash;
export const getContentCount = () => Object.keys(registry).length;
