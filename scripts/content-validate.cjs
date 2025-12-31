const fs = require("fs");
const path = require("path");
const { validateCrisis } = require("./content-schemas.cjs");

const root = process.cwd();
const crisesDir = path.join(root, "content", "crises");

const readManifestFiles = (dir) => {
  if (!fs.existsSync(dir)) return [];
  const manifests = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      manifests.push(...readManifestFiles(target));
      continue;
    }
    if (entry.isFile() && entry.name.startsWith("manifest.") && entry.name.endsWith(".json")) {
      manifests.push({
        path: target,
        data: JSON.parse(fs.readFileSync(target, "utf-8")),
      });
    }
  }
  return manifests;
};

let hasErrors = false;
const manifests = readManifestFiles(crisesDir);
manifests.forEach(({ path: filePath, data }) => {
  const validation = validateCrisis(data);
  if (!validation.valid) {
    console.error(`❌ Crisis schema failure in ${filePath}:`);
    validation.errors.forEach((err) => {
      console.error(`  ${err.instancePath || err.dataPath}: ${err.message}`);
    });
    hasErrors = true;
  }
});

if (hasErrors) {
  console.error("Validation failed.");
  process.exit(1);
}

console.log("All new content validated successfully.");
