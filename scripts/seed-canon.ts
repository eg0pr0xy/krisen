import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { CrisisManifest, Language } from "../types";
import schema from "../src/content/schema/crisisManifest.schema.json";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true, strict: false });
addFormats(ajv);
const validate = ajv.compile<CrisisManifest>(schema as any);

const canonPath = path.join(process.cwd(), "content", "canon.json");
if (!fs.existsSync(canonPath)) {
  console.error("Missing content/canon.json");
  process.exit(1);
}

const canon = JSON.parse(fs.readFileSync(canonPath, "utf-8")) as { items: { slug: string }[] };
const contentRoot = path.join(process.cwd(), "content", "crises");

const report = {
  created: [] as string[],
  skippedDraft: [] as string[],
  skippedLocked: [] as string[],
  invalid: [] as string[],
};

function manifestExists(slug: string, lang: Language) {
  return fs.existsSync(path.join(contentRoot, slug, `manifest.${lang}.json`));
}

function loadManifest(slug: string, lang: Language): CrisisManifest | null {
  const p = path.join(contentRoot, slug, `manifest.${lang}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf-8")) as CrisisManifest;
}

function validateManifest(slug: string, lang: Language, manifest: CrisisManifest) {
  const ok = validate(manifest);
  if (!ok) {
    report.invalid.push(`${slug}:${lang}`);
    console.error(`Invalid manifest ${slug}:${lang}`, validate.errors);
  }
}

canon.items.forEach((item) => {
  const slug = item.slug;
  const de = loadManifest(slug, "de");
  if (de) {
    if (de.status === "locked") {
      report.skippedLocked.push(slug);
      return;
    }
    report.skippedDraft.push(slug);
    return;
  }

  // missing -> create via generate-crisis with default seed/provider none
  try {
    execSync(`npm run generate:crisis -- ${slug}`, { stdio: "inherit" });
    const created = loadManifest(slug, "de");
    if (created) {
      validateManifest(slug, "de", created);
      const en = loadManifest(slug, "en");
      if (en) validateManifest(slug, "en", en);
      report.created.push(slug);
    }
  } catch (err) {
    console.error(`Failed generating ${slug}`, err);
    report.invalid.push(slug);
  }
});

console.log("Seed report:");
console.log(`Created: ${report.created.length}`);
console.log(`Skipped draft: ${report.skippedDraft.length}`);
console.log(`Skipped locked: ${report.skippedLocked.length}`);
console.log(`Invalid: ${report.invalid.length}`);
