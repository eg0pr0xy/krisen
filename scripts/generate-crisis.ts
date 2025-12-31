import fs from "fs";
import path from "path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "../src/content/schema/crisisManifest.schema.json";
import { CrisisManifest, Language, LocalizedString } from "../types";
import { generatePlaceholderManifest, GenerationContext } from "./providers/provider.none";
import { generateWithGemini } from "./providers/provider.gemini";

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true, strict: false });
addFormats(ajv);
const validate = ajv.compile<CrisisManifest>(schema as any);

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const seedArg = args.find((a) => a.startsWith("--seed"));
const providerArg = args.find((a) => a.startsWith("--provider")) || "--provider=none";
const force = args.includes("--force");
const fillMissing = args.includes("--fill-missing");

if (!slug) {
  console.error("Usage: npm run generate:crisis -- <slug> [--seed=123] [--force] [--fill-missing] [--provider=none|gemini]");
  process.exit(1);
}

const seed = seedArg ? seedArg.split("=")[1] : slug;
const provider = providerArg.split("=")[1] as "none" | "gemini";
const contentRoot = path.join(process.cwd(), "content", "crises", slug);
fs.mkdirSync(contentRoot, { recursive: true });

const languages: Language[] = ["de", "en"];

async function buildManifest(lang: Language): Promise<CrisisManifest> {
  const ctx: GenerationContext = { slug, lang, seed };
  if (provider === "gemini") {
    return generateWithGemini(ctx);
  }
  return generatePlaceholderManifest(ctx);
}

function mergeLocalized(incoming: LocalizedString, existing?: LocalizedString): LocalizedString {
  if (!existing) return incoming;
  return {
    de: existing.de || incoming.de,
    en: existing.en || incoming.en,
  };
}

function mergeManifest(incoming: CrisisManifest, existing: CrisisManifest): CrisisManifest {
  return {
    ...existing,
    title: mergeLocalized(incoming.title, existing.title),
    summary: mergeLocalized(incoming.summary, existing.summary),
    categories: existing.categories?.length ? existing.categories : incoming.categories,
    tags: existing.tags?.length ? existing.tags : incoming.tags,
    severity: existing.severity ?? incoming.severity,
    volatility: existing.volatility ?? incoming.volatility,
    timeHorizon: existing.timeHorizon ?? incoming.timeHorizon,
    signals: existing.signals?.length ? existing.signals : incoming.signals,
    diagnosis: mergeLocalized(incoming.diagnosis, existing.diagnosis),
    mechanisms: mergeLocalized(incoming.mechanisms, existing.mechanisms),
    archetypes: existing.archetypes?.length ? existing.archetypes : incoming.archetypes,
    glossary: existing.glossary?.length ? existing.glossary : incoming.glossary,
    related: existing.related ?? incoming.related,
    lastUpdatedISO: existing.lastUpdatedISO || incoming.lastUpdatedISO,
    version: existing.version || incoming.version,
    status: existing.status || "draft",
    generatedBy: existing.generatedBy || incoming.generatedBy,
    citations: existing.citations?.length ? existing.citations : incoming.citations,
    media: existing.media || incoming.media,
    editNotes: existing.editNotes,
    lockReason: existing.lockReason,
  };
}

function writeManifest(lang: Language, manifest: CrisisManifest) {
  const target = path.join(contentRoot, `manifest.${lang}.json`);
  fs.writeFileSync(target, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`Wrote ${target}`);
}

function validateOrExit(manifest: CrisisManifest, fileLabel: string) {
  const valid = validate(manifest);
  if (!valid) {
    console.error(`Validation failed for ${fileLabel}`);
    console.error(validate.errors);
    process.exit(1);
  }
}

async function run() {
  for (const lang of languages) {
    const target = path.join(contentRoot, `manifest.${lang}.json`);
    const generatedAtISO = new Date().toISOString();
    const generatedBase = await buildManifest(lang);
    const baseManifest: CrisisManifest = {
      ...generatedBase,
      status: "draft",
      generatedBy: {
        provider,
        seed,
        generatedAtISO,
      },
    };

    if (!fs.existsSync(target)) {
      validateOrExit(baseManifest, target);
      writeManifest(lang, baseManifest);
      continue;
    }

    const existing = JSON.parse(fs.readFileSync(target, "utf-8")) as CrisisManifest;
    if (existing.status === "locked" && !force) {
      console.error(`Refused: ${target} is locked. Use --force to override.`);
      continue;
    }
    if (existing.status === "draft" && !fillMissing && !force) {
      console.log(`Skipped ${target}: draft exists. Use --fill-missing or --force to modify.`);
      continue;
    }

    const merged = force ? { ...baseManifest, status: existing.status || "locked" } : mergeManifest(baseManifest, existing);
    validateOrExit(merged, target);
    writeManifest(lang, merged);
  }
}

run();
