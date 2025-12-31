import fs from "fs";
import path from "path";
import { CrisisManifest } from "../types";

const contentRoot = path.join(process.cwd(), "content", "crises");

function readManifest(slug: string): CrisisManifest | null {
  const dePath = path.join(contentRoot, slug, "manifest.de.json");
  const enPath = path.join(contentRoot, slug, "manifest.en.json");
  const file = fs.existsSync(dePath) ? dePath : enPath;
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as CrisisManifest;
}

function writeManifest(slug: string, manifest: CrisisManifest, lang: "de" | "en") {
  const target = path.join(contentRoot, slug, `manifest.${lang}.json`);
  fs.writeFileSync(target, JSON.stringify(manifest, null, 2), "utf-8");
}

const slugs = fs.readdirSync(contentRoot).filter((p) => fs.statSync(path.join(contentRoot, p)).isDirectory());
const manifests: Record<string, CrisisManifest> = {};

slugs.forEach((slug) => {
  const manifest = readManifest(slug);
  if (manifest) manifests[slug] = manifest;
});

function similarity(a: CrisisManifest, b: CrisisManifest) {
  const tagOverlap = a.tags.filter((t) => b.tags.includes(t)).length;
  const categoryOverlap = a.categories.filter((c) => b.categories.includes(c)).length;
  return tagOverlap * 2 + categoryOverlap;
}

Object.entries(manifests).forEach(([slug, manifest]) => {
  const scores = Object.entries(manifests)
    .filter(([other]) => other !== slug)
    .map(([other, otherManifest]) => ({ slug: other, score: similarity(manifest, otherManifest) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
    .slice(0, 6)
    .map((s) => s.slug);

  manifest.related = scores;
  const dePath = path.join(contentRoot, slug, "manifest.de.json");
  const enPath = path.join(contentRoot, slug, "manifest.en.json");

  if (fs.existsSync(dePath)) writeManifest(slug, manifest, "de");
  if (fs.existsSync(enPath)) writeManifest(slug, manifest, "en");
  console.log(`Updated related for ${slug}: ${scores.join(", ")}`);
});
