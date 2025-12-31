import fs from "fs";
import path from "path";
import { CrisisManifest } from "../types";

const contentRoot = path.join(process.cwd(), "content", "crises");

type LocalizedString = { de: string; en: string };

interface GlossaryCatalogEntry {
  term: string;
  definition: LocalizedString;
  references: string[];
}

const manifests = fs
  .readdirSync(contentRoot)
  .filter((slug) => fs.statSync(path.join(contentRoot, slug)).isDirectory())
  .flatMap((slug) =>
    ["manifest.de.json", "manifest.en.json"].map((file) => {
      const manifestPath = path.join(contentRoot, slug, file);
      if (!fs.existsSync(manifestPath)) return null;
      try {
        const data = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as CrisisManifest;
        return { slug, manifest: data };
      } catch (error) {
        console.error(`Could not parse ${manifestPath}:`, error);
        return null;
      }
    }).filter(Boolean) as { slug: string; manifest: CrisisManifest }[]
  );

const glossaryMap = new Map<string, GlossaryCatalogEntry>();
const warnings: string[] = [];

manifests.forEach(({ slug, manifest }) => {
  manifest.glossary.forEach((entry) => {
    const key = entry.term.trim().toLowerCase();
    if (!key) return;
    const existing = glossaryMap.get(key);
    const definition: LocalizedString = {
      de: entry.definition?.de?.trim() ?? "",
      en: entry.definition?.en?.trim() ?? "",
    };
    if (!definition.de) warnings.push(`Missing German definition for '${entry.term}' in ${slug}`);
    if (!definition.en) warnings.push(`Missing English definition for '${entry.term}' in ${slug}`);
    if (existing) {
      // prefer longest definitions (heuristic)
      const merged: LocalizedString = {
        de: existing.definition.de.length >= definition.de.length ? existing.definition.de : definition.de,
        en: existing.definition.en.length >= definition.en.length ? existing.definition.en : definition.en,
      };
      existing.definition = merged;
      if (!existing.references.includes(slug)) {
        existing.references.push(slug);
      }
    } else {
      glossaryMap.set(key, {
        term: entry.term,
        definition,
        references: [slug],
      });
    }
  });
});

const catalog: GlossaryCatalogEntry[] = Array.from(glossaryMap.values()).sort((a, b) =>
  a.term.localeCompare(b.term, "de", { sensitivity: "base" }),
);

const catalogDir = path.join(process.cwd(), "content", "glossary");
if (!fs.existsSync(catalogDir)) {
  fs.mkdirSync(catalogDir, { recursive: true });
}

const outputPath = path.join(catalogDir, "catalog.json");
fs.writeFileSync(
  outputPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      count: catalog.length,
      terms: catalog,
    },
    null,
    2,
  ),
);

console.log(`Glossary catalog written with ${catalog.length} entries to ${outputPath}`);
if (warnings.length) {
  console.warn("Glossary warnings:");
  warnings.forEach((warning) => console.warn(` - ${warning}`));
}
