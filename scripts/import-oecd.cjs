#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");

const OECD_URL =
  process.env.OECD_URL ||
  "https://sdmx.oecd.org/public/rest/data/OECD.ELS.IMD,DSD_MIG@DF_MIG,1.0/.W.A.B11._T...?startPeriod=2012&dimensionAtObservation=AllDimensions";

async function main() {
  if (typeof fetch === "undefined") {
    console.error(
      "The global fetch API is not available. Please run this script with Node 18+ or install a fetch polyfill."
    );
    process.exit(1);
  }

  const dir = path.join(__dirname, "../content/data/oecd");
  let text;
  try {
    const response = await fetch(OECD_URL, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch OECD data: ${response.status} ${response.statusText}`);
    }

    text = await response.text();
  } catch (error) {
    console.warn(
      "OECD import failed, falling back to existing sample data.",
      error instanceof Error ? error.message : error
    );
    text = await fs.readFile(path.join(dir, "indicators.json"), "utf8").catch(() => "[]");
  }
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "raw.json"), text, "utf8");

  try {
    const parsed = JSON.parse(text);
    await fs.writeFile(path.join(dir, "indicators.json"), JSON.stringify(parsed, null, 2), "utf8");
  } catch (err) {
    console.warn("Unable to parse OECD response as JSON; saved raw output only.");
  }

  console.log("OECD feed saved to content/data/oecd/");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
