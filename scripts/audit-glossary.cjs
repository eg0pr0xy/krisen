const fs = require("fs");
const path = require("path");

const contentRoot = path.join(process.cwd(), "content", "crises");

const manifests = fs
  .readdirSync(contentRoot)
  .filter((slug) => fs.existsSync(path.join(contentRoot, slug)) && fs.statSync(path.join(contentRoot, slug)).isDirectory())
  .flatMap((slug) =>
    ["manifest.de.json", "manifest.en.json"]
      .map((file) => {
        const manifestPath = path.join(contentRoot, slug, file);
        if (!fs.existsSync(manifestPath)) return null;
        try {
          const data = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
          return { slug, manifest: data };
        } catch (error) {
          console.error(`Could not parse ${manifestPath}:`, error);
          return null;
        }
      })
      .filter(Boolean)
  );

const glossaryMap = new Map();
const warnings = [];

manifests.forEach(({ slug, manifest }) => {
  if (!Array.isArray(manifest.glossary)) return;
  manifest.glossary.forEach((entry) => {
    if (!entry || !entry.term) return;
    const key = entry.term.trim().toLowerCase();
    if (!key) return;
    const definition = {
      de: entry.definition?.de?.trim() || "",
      en: entry.definition?.en?.trim() || "",
    };
    if (!definition.de) warnings.push(`Missing German definition for '${entry.term}' in ${slug}`);
    if (!definition.en) warnings.push(`Missing English definition for '${entry.term}' in ${slug}`);
    const existing = glossaryMap.get(key);
    if (existing) {
      const merged = {
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

const glossaryDir = path.join(process.cwd(), "content", "glossary");
if (fs.existsSync(glossaryDir)) {
  const manualFiles = fs
    .readdirSync(glossaryDir)
    .filter((file) => file.endsWith(".json") && file !== "catalog.json");

  manualFiles.forEach((file) => {
    const filePath = path.join(glossaryDir, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      if (!data || !data.term) return;
      const key = data.term.trim().toLowerCase();
      if (!key) return;
      const definition = {
        de: (data.definition_de || data.definition?.de || "").trim(),
        en: (data.definition_en || data.definition?.en || "").trim(),
      };
      if (!definition.de) warnings.push(`Missing German definition for glossary file '${file}'`);
      if (!definition.en) warnings.push(`Missing English definition for glossary file '${file}'`);
      const references = Array.isArray(data.references)
        ? data.references.slice()
        : [];
      const sourceRef = data.source ? [data.source] : [];
      const allRefs = [...new Set([...references, ...sourceRef, file.replace(".json", "")])];
      const existing = glossaryMap.get(key);
      if (existing) {
        const merged = {
          de: existing.definition.de.length >= definition.de.length ? existing.definition.de : definition.de,
          en: existing.definition.en.length >= definition.en.length ? existing.definition.en : definition.en,
        };
        existing.definition = merged;
        allRefs.forEach((ref) => {
          if (ref && !existing.references.includes(ref)) {
            existing.references.push(ref);
          }
        });
      } else {
        glossaryMap.set(key, {
          term: data.term,
          definition,
          references: allRefs.filter(Boolean),
        });
      }
    } catch (error) {
      console.error(`Could not parse glossary file ${filePath}:`, error);
    }
  });
}

const catalogDir = path.join(process.cwd(), "content", "glossary");
if (!fs.existsSync(catalogDir)) {
  fs.mkdirSync(catalogDir, { recursive: true });
}

const catalog = Array.from(glossaryMap.values()).sort((a, b) =>
  a.term.localeCompare(b.term, "de", { sensitivity: "base" }),
);

fs.writeFileSync(
  path.join(catalogDir, "catalog.json"),
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

console.log(`Glossary catalog written with ${catalog.length} entries to ${path.join("content", "glossary", "catalog.json")}`);
if (warnings.length) {
  console.warn("Glossary warnings:");
  warnings.forEach((warning) => console.warn(` - ${warning}`));
}
