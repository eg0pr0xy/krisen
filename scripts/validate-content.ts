import fs from "fs";
import path from "path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "../src/content/schema/crisisManifest.schema.json";
import { CrisisManifest } from "../types";

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true, strict: false });
addFormats(ajv);
const validate = ajv.compile<CrisisManifest>(schema as any);

const contentRoot = path.join(process.cwd(), "content", "crises");
let hasErrors = false;

const slugs = fs.readdirSync(contentRoot).filter((p) => fs.statSync(path.join(contentRoot, p)).isDirectory());

const relatedSet = new Set(slugs);

function checkNonEmpty(manifest: CrisisManifest, file: string) {
  const requiredText: (keyof Pick<CrisisManifest, "title" | "summary" | "diagnosis" | "mechanisms">)[] = [
    "title",
    "summary",
    "diagnosis",
    "mechanisms",
  ];
  requiredText.forEach((key) => {
    const value = manifest[key];
    if (typeof value === "object") {
      if (!value.de || !value.en) {
        console.error(`[Empty] ${file}: ${key} missing text`);
        hasErrors = true;
      }
    }
  });
  if (!manifest.signals.length || !manifest.archetypes.length || !manifest.glossary.length) {
    console.error(`[Empty] ${file}: signals/archetypes/glossary must not be empty`);
    hasErrors = true;
  }
}

function checkRelated(manifest: CrisisManifest, file: string) {
  const invalid = manifest.related.filter((slug) => !relatedSet.has(slug));
  if (invalid.length) {
    console.error(`[Related] ${file}: Unknown slugs ${invalid.join(", ")}`);
    hasErrors = true;
  }
}

function checkGlossaryReferences(manifest: CrisisManifest, file: string) {
  const glossaryTerms = manifest.glossary.map((g) => g.term.toLowerCase());
  const text = [
    manifest.title.de,
    manifest.title.en,
    manifest.summary.de,
    manifest.summary.en,
    manifest.diagnosis.de,
    manifest.diagnosis.en,
    manifest.mechanisms.de,
    manifest.mechanisms.en,
    manifest.signals.map((s) => `${s.label.de} ${s.label.en} ${s.value} ${s.source || ""}`).join(" "),
    (manifest as any).qa
      ? (manifest as any).qa
          .map((q: any) => `${q.question?.de || ""} ${q.question?.en || ""} ${q.answer?.de || ""} ${q.answer?.en || ""}`)
          .join(" ")
      : "",
  ]
    .join(" ")
    .toLowerCase();
  glossaryTerms.forEach((term) => {
    if (!text.includes(term.toLowerCase())) {
      console.warn(`[Glossary] ${file}: term '${term}' not referenced in content (best-effort)`);
    }
  });
}

slugs.forEach((slug) => {
  const manifestFiles = ["manifest.de.json", "manifest.en.json"]
    .map((file) => path.join(contentRoot, slug, file))
    .filter((file) => fs.existsSync(file));

  manifestFiles.forEach((file) => {
    const data = JSON.parse(fs.readFileSync(file, "utf-8")) as CrisisManifest;
    const valid = validate(data);
    if (!valid) {
      hasErrors = true;
      console.error(`Validation errors in ${file}:`);
      console.error(validate.errors);
    }
    checkNonEmpty(data, file);
    checkRelated(data, file);
    checkGlossaryReferences(data, file);
  });
});

if (hasErrors) {
  process.exitCode = 1;
  console.error("Content validation failed.");
} else {
  console.log("All manifests valid.");
}
