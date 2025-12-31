#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");

const indicatorsPath = path.join(__dirname, "../content/data/oecd/indicators.json");
const crisesDir = path.join(__dirname, "../content/crises");
const generatedDir = path.join(__dirname, "../src/generated");

const tokenize = (text) => {
  if (!text || typeof text !== "string") {
    return [];
  }
  return text
    .toLowerCase()
    .split(/[^a-z0-9äöüß]+/)
    .filter(Boolean)
    .map((token) =>
      token
        .replace(/ä/g, "a")
        .replace(/ö/g, "o")
        .replace(/ü/g, "u")
        .replace(/ß/g, "ss")
    );
};

async function collectManifests(dir) {
  const manifests = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      manifests.push(...(await collectManifests(entryPath)));
    } else if (entry.isFile() && entry.name === "manifest.de.json") {
      manifests.push(entryPath);
    }
  }
  return manifests;
}

function gatherCrisisKeywords(manifestDe, manifestEn) {
  const texts = [
    manifestDe.title?.de,
    manifestEn?.title?.en,
    manifestDe.summary?.de,
    manifestEn?.summary?.en,
    manifestDe.diagnosis,
    manifestEn?.diagnosis,
    manifestDe.mechanisms,
    manifestEn?.mechanisms,
    manifestDe.summary?.de,
    manifestDe.summary?.en,
    [...(manifestDe.tags ?? [])].join(" "),
    manifestDe.categories?.join(" "),
  ];
  (manifestDe.glossary ?? []).forEach((entry) => {
    texts.push(entry.term);
  });
  (manifestDe.qa ?? []).forEach((qa) => {
    texts.push(qa.question?.de, qa.question?.en, qa.answer?.de, qa.answer?.en);
  });
  return new Set(texts.flatMap((text) => tokenize(text)));
}

async function main() {
  const rawIndicators = JSON.parse(await fs.readFile(indicatorsPath, "utf8"));
  const indicators = Array.isArray(rawIndicators) ? rawIndicators : [];

  const manifestPaths = await collectManifests(crisesDir);
  const crisisDefinitions = await Promise.all(
    manifestPaths.map(async (manifestPath) => {
      const manifestDe = JSON.parse(await fs.readFile(manifestPath, "utf8"));
      const manifestEnPath = path.join(path.dirname(manifestPath), "manifest.en.json");
      let manifestEn = {};
      try {
        manifestEn = JSON.parse(await fs.readFile(manifestEnPath, "utf8"));
      } catch {
        manifestEn = {};
      }
      const slug = path.basename(path.dirname(manifestPath));
      const keywords = gatherCrisisKeywords(manifestDe, manifestEn);
      return { slug, manifest: manifestDe, keywords };
    })
  );

  const mappingEntries = [];

  crisisDefinitions.forEach(({ slug, manifest, keywords }) => {
    indicators.forEach((indicator) => {
      const indicatorKeywords = new Set([
        ...tokenize(indicator.label?.de),
        ...tokenize(indicator.label?.en),
        ...tokenize(indicator.description?.de),
        ...tokenize(indicator.description?.en),
        ...Object.values(indicator.dimensions ?? {}).flatMap((value) => tokenize(value)),
      ]);

      const matches = [...indicatorKeywords].filter((word) => keywords.has(word));
      let score = matches.length;
      if (manifest.categories?.some((cat) => indicatorKeywords.has(cat.toLowerCase()))) {
        score += 1;
      }
      if (manifest.tags?.some((tag) => indicatorKeywords.has(tag.toLowerCase()))) {
        score += 1;
      }

      if (score >= 2) {
        mappingEntries.push({
          crisisSlug: slug,
          indicatorId: indicator.id,
          score,
          roles: score >= 4 ? ["primary"] : ["secondary"],
        });
      }
    });
  });

  mappingEntries.sort((a, b) => b.score - a.score || a.crisisSlug.localeCompare(b.crisisSlug));

  const indicatorDescriptors = indicators.map((indicator) => ({
    id: indicator.id,
    label: indicator.label,
    description: indicator.description,
    value: indicator.value,
    unit: indicator.unit,
    timestamp: indicator.timestamp,
    dimensions: indicator.dimensions,
    source: indicator.source,
  }));

  await fs.mkdir(generatedDir, { recursive: true });

  const output = `import type { IndicatorDescriptor, IndicatorMapping } from "../types";

export const oecdIndicators: IndicatorDescriptor[] = ${JSON.stringify(indicatorDescriptors, null, 2)};

export const indicatorMappings: IndicatorMapping[] = ${JSON.stringify(mappingEntries, null, 2)};
`;

  await fs.writeFile(path.join(generatedDir, "indicatorMappings.ts"), output, "utf8");
  console.log("Generated indicatorMappings.ts with", mappingEntries.length, "relations.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
