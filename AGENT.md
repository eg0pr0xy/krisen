# AGENT PROTOKOLL — KRISEN‑KANON

## Kontext
Du bist Teil eines transdisziplinären Archivprojekts. Ziel ist ein offline-fähiges, lokal versioniertes Krisenarchiv mit systemtheoretischer, sprachlich präziser Diagnose. Inhalte kommen ausschließlich aus den `content/crises/**/manifest.{de,en}.json`-Dateien. KI-generierte Texte entstehen nur durch CLI‑Werkzeuge (`generate-crisis`, `extend:related`, `seed:canon`) und werden anschließend manuell gepflegt.

## Arbeitsprinzipien
1. **Lokaler Kanon:** Alle Daten werden als JSON-Dateien im Repository abgelegt; keine Laufzeit-Erzeugung im Browser. Wenn du neue Quellen brauchst, erweitere die manifests per CLI, dokumentiere Zitate als `citations[]` und referenziere sie im README/AGENT.
2. **UI-Module:** Visuals nutzen D3/GSAP und lesen aus dem deterministischen Index (`src/generated/contentIndex.ts`). Änderungen hier müssen backwards-compatible sein und dürfen vorhandene Layouts nicht zerstören.
3. **Live-Integration:** Wenn externe APIs eingebunden werden (SystemicRiskMatrix, LiveEvidenceGraph), verwende `src/hooks/useLiveIndicator.ts`. Jeder Endpoint braucht Transformationslogik, TTL-Caching und dokumentierte Fallback-Werte – damit das System offline funktioniert.
4. **Glossar & Mechanismen:** Neue Begriffe landen in `content/glossary/` und `catalog.json` (via `scripts/audit-glossary.cjs`). Pflege auch `AGENT.md`/`README.md`, damit das Team jederzeit nachvollziehen kann, was ergänzt wurde.
5. **Testing & Build:** Nach Daten-/Visual-Änderungen: `npm run content:index`, `npm run validate:content`, `npm run build`. Behebe Warnungen oder dokumentiere sie (etwa chunk-size).

## To-Do-Tracker
- [ ] Ergänze weitere Live-APIs (z. B. NOAA, Eurostat, UNHCR) über `useLiveIndicators`.
- [ ] Verlinke jede neue Quelle als separate `citations[]` in den Manifests.
- [ ] Erweitere Glossar & Mechanismen strukturell mit CLI-Skripten und halte `catalog.json` aktuell.
- [ ] Pflege die README/AGENT-Abschnitte, wenn große konzeptionelle Änderungen (z. B. neue Module oder Kategorien) erfolgen.
- [ ] Aktualisiere die OECD-Integration: `node scripts/import-oecd.cjs` lädt den Feed, `node scripts/map-oecd.cjs` generiert daraus `src/generated/indicatorMappings.ts`; checke dann `content/data/oecd/indicators.json` + das resultierende Mapping.

## Mission
Halte das Archiv ehrlich diagnostisch, offline-first und erweitert durch verifizierte Quellen. Nutze die vorhandene Pipeline und dokumentiere jeden Schritt – das ist deine Referenz für kommende Agenten.
