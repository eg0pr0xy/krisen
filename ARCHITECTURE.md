# KRISEN — KANON Architecture Overview
This repo is a Vite + React SPA that renders a local-first crisis archive. No server runtime is required—everything is statically bundled and fed from `content/` JSON files.

## Entry Points
- `index.tsx` bootstraps the app by rendering `App.tsx`.
- `App.tsx` handles the main archive flow: language storage, filters, routing via hash, `TOC` modal, and rendering either the aggregate views or a single `CrisisDetail`.
- `Layout.tsx` wraps every screen with the brutalist header/footer and the global `EntropyClock`/`SystemicRiskMatrix` widgets.

## Content Pipeline
- Crisis manifests live under `content/crises/<slug>/manifest.{de,en}.json`.
- `src/content/loadCrises.ts` uses `import.meta.glob` (Vite build-time) and `ajv` schema validation located in `src/content/schema/crisisManifest.schema.json`.
- The loader normalizes categories, builds per-lang registries, exposes `getAllCrises`, `getCrisis`, `getRelated`, and also computes a content version hash.
- `scripts/validate-content.ts` (invoked manually via `npm run validate:content`) re-runs schema validation plus extra checks (non-empty glossary, related/links existence, glossary reference usage).

## UI Structure
- `App.tsx`: main archive grid, filters (`CrisisFilters`), network, monitoring, educational modules, detail view orchestration.
- `App.tsx`: main archive grid, filters (`CrisisFilters`), network, monitoring, educational modules, detail view orchestration; the big “Archiv des Zerfalls” hero is now gated to the grid view so alternative views (e.g. the network overview) start directly with the interactive modules.
- `components/CrisisDetail.tsx`: renders facets (severity/volatility), signals, glossary links, related systems, evidence log, citations, timeline, etc.
- `components/CrisisGrid.tsx`, `CrisisFilters.tsx`, `CrisisNetwork.tsx`, `LiveEvidenceGrid.tsx`, `EvidenceLog.tsx`, `IndicatorsPanel.tsx`, `ObservationsFeed.tsx`, `EntropyClock.tsx`, `SystemicRiskMatrix.tsx`: all modularized units used across the archive experience.
- `components/CrisisNetwork.tsx`: now draws elliptical anchor zones per category, steers nodes toward those clusters with tuned forces, and surfaces cross-category connection stats so the “Polykrise” structure is readable instead of a chaotic blob.
- `components/GlossaryDrawer.tsx` and `KeywordDetail` support the glossary mention flow.

## Content Conventions
- URLs use hash routing (e.g., `#krieg`), allowing deep links to crisis detail without a router.
- LocalStorage caches the index per language/version cycle.
- Most UI behavior (scroll to top, share, glossary lookup) is handled client-side within `App.tsx` and `CrisisDetail`.

## Next Steps
The roadmap includes replacing the flat crisis directory with a taxonomy-driven schema, CLI tooling for scaffolding/validation/index generation, and new index/detail/mechanism/taxonomy views to scale to 120+ canonical crisis entries.
