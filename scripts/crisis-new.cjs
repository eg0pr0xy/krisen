const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const getArg = (name) => {
  const flag = `--${name}`;
  const idx = args.indexOf(flag);
  if (idx === -1) return null;
  return args[idx + 1];
};

const id = getArg("id");
const title = getArg("title");

if (!id || !title) {
  console.error("Usage: npm run crisis:new -- --id <slug> --title <Title>");
  process.exit(1);
}

const dir = path.join(process.cwd(), "content", "crises");
const filePath = path.join(dir, `${id}.json`);

if (fs.existsSync(filePath)) {
  console.error(`Crisis '${id}' already exists at ${filePath}`);
  process.exit(1);
}

const now = new Date().toISOString();

const template = {
  id,
  title_de: title,
  short_definition_de: "",
  long_analysis_de: "",
  layer: "structural",
  facets: {
    time_scale: "medium",
    reversibility: "partially_reversible",
    visibility: "latent",
    distribution: "selective",
    system_function: "destabilizing",
  },
  tags: ["placeholder"],
  relations: {
    causes: [],
    amplifies: [],
    is_symptom_of: [],
    linked_mechanisms: [],
  },
  signals: {
    bullets: [""],
  },
  q_and_a: [
    { q: "", a: "" },
    { q: "", a: "" },
    { q: "", a: "" },
    { q: "", a: "" },
  ],
  glossary_refs: [],
  created_at: now,
  updated_at: now,
  status: "draft",
};

fs.writeFileSync(filePath, JSON.stringify(template, null, 2));
console.log(`New crisis scaffold created at ${filePath}. Please fill in the fields.`);
