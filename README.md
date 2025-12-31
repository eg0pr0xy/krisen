
# KRISEN — KANON
### Ein digitales Archiv systemischer Endlichkeit

<!-- Deployment trigger -->

**KRISEN** ist ein transdisziplinäres Forschungsprojekt und digitales Archiv, das die multiplen, sich überschneidenden Krisen des 21. Jahrhunderts dokumentiert. Es dient als "Kanon der Endlichkeit", der ökologische, soziale, politische und technologische Zerfallsprozesse diagnostiziert und visualisiert.

---

## 1. Designphilosophie
Das Projekt folgt einer **brutalistischen, minimalistischen Ästhetik**, inspiriert durch das Schweizer Grafikdesign der Moderne.

- **Monochromie:** Reduktion auf Schwarz, Weiß und ein akzentuiertes Signalrot (Swiss Red).
- **Typografie:** Kontrast zwischen einer extrem fetten Grotesk-Schrift (Inter Black) für Schlagzeilen und einer präzisen Monospaced-Schrift (JetBrains Mono) für technische Daten.
- **Materialität:** Digitaler "Grain"-Effekt simuliert die Textur physischer Archivmaterialien und alter Filmaufnahmen.
- **Kinetik:** Subtile Animationen (D3.js & GSAP) spiegeln die Instabilität und Entropie der untersuchten Systeme wider.

---

## 2. Technische Architektur
Die Anwendung ist eine hochperformante Single-Page-Application (SPA) mit vollständig lokaler Content-Pipeline.

- **Frontend:** React 19 + Vite, GSAP für Mikroanimationen, D3 optional für Visualisierungen.
- **Content-Layer:** `import.meta.glob` indexiert alle Manifeste unter `content/crises/**/manifest.{de,en}.json`.
- **Validierung:** Ajv prüft jedes Manifest gegen `src/content/schema/crisisManifest.schema.json` (Fehler landen direkt im UI).
- **Offline-Fähigkeit:** Alle Inhalte liegen als Dateien im Repo; Index kann zusätzlich im `localStorage` gecacht werden.
- **Keine Laufzeit-Generierung:** AI/Generierung findet nur via CLI-Skripte statt, niemals im Browser.

----

## 3. Datenstruktur & Permanenz
Pfadstruktur je Krise:
```
content/
  crises/
    <slug>/
      manifest.de.json
      manifest.en.json
      media/ (optional)
```

Pflichtfelder: `id`, `slug`, `title {de,en}`, `summary {de,en}`, `categories (Materie|Existenz|Macht|Kontrolle|Gefühl)`, `tags`, `severity 0-100`, `volatility 0-100`, `timeHorizon`, `signals[]`, `diagnosis {de,en}`, `mechanisms {de,en}`, `archetypes[]`, `glossary[]`, `related[]`, `lastUpdatedISO`, `version`.  
Statusfelder: `status` (`missing|draft|locked`), `generatedBy { provider, model?, seed?, generatedAtISO? }`, optional `editNotes[]`, `lockReason`.  
Optional: `citations[]`, `media {images,audio,video}`.

Der aktuelle Kanon enthält 108 Einträge im Index (`content/crises/index.json`) und 18 voll ausgefüllte Beispielkrisen (Status: `locked`).

----

## 4. Bedienung
- **Navigation:** Filterung nach Kategorien (Materie, Existenz, Macht, Kontrolle, Gefühl).
- **Diagnose:** Klick auf eine Krisen-Kachel öffnet das lokale Manifest.
- **Glossar:** Markierte Begriffe öffnen rechts eine Glossar-Drawer mit Übersetzungen und Archetyp-Referenzen.
- **Sprachwechsel:** Nahtloses Umschalten zwischen Deutsch und Englisch ohne Datenverlust.
- **Fehlende Einträge:** Bei unbekanntem `slug` wird ein CLI-Kommando zum Generieren angezeigt (nur Kopieren, kein Auto-Run).

----

## 5. Lebenszyklus & Arbeitsabläufe
- **missing:** Noch kein Manifest vorhanden. Sichtbar im UI als fehlend; CLI-Kommando zum Generieren wird angeboten.
- **draft:** Generiert und editierbar. Generator aktualisiert nur mit `--fill-missing` oder `--force`.
- **locked:** Finalisiert. Generator verweigert Änderungen ohne `--force`. Lock-Grund optional (`lockReason`).

### Inhalt validieren
```
npm run validate:content
```

### Neue Krise generieren (deterministischer Platzhalter)
```
npm run generate:crisis -- <slug> [--seed=42] [--fill-missing] [--force]
```

### Related-Felder per Tag-Overlap setzen
```
npm run extend:related
```

### Kanon bulk-seeden (nur fehlende Einträge)
```
npm run seed:canon
```

### Build
```
npm run build
```

----

## 6. Krise manuell hinzufügen
1. Ordner `content/crises/<slug>/` anlegen.
2. `manifest.de.json` und `manifest.en.json` nach Schema ausfüllen.
3. Optional Medien unter `content/crises/<slug>/media/` ablegen.
4. `npm run validate:content` ausführen; bei Fehlern Pfade im UI prüfen.
5. `npm run extend:related` für konsistente `related[]`-Felder.
6. Bei finaler Qualität: `status` auf `locked` setzen und optional `lockReason` notieren.

----

## 7. Vision
Dieses Archiv ist kein statisches Dokument, sondern ein lebendes System. Es soll das Bewusstsein für die systemische Natur unserer Zeit schärfen – trocken, diagnostisch und frei von Moralisierung.

> *"Alle Krisen sind systemisch verknüpft."*

----
**Entwickelt als Demonstration moderner Web-Technologie und offline-first Inhaltsgenerierung.**

----
## 8. Echtzeit & Live-Monitoring
Die App bleibt lokal-first, aber mit `useLiveIndicator`/`useSystemicRiskMatrix` verbinden wir optional offene APIs (CO₂-Tracker, globale Temperatur, Weltbank-Arbeitslosigkeit) mit deterministischen Fallbacks:

- **Feature Flag:** `useMockData` legt fest, ob simulierte Werte oder echte Endpunkte angezeigt werden.
- **Caching:** Die Hooks speichern API-Antworten mit TTL im `localStorage`, damit bei fehlender Verbindung zuletzt funktionierende Werte angezeigt werden.
- **Erweiterbarkeit:** Neue Indikatoren werden über `LiveIndicatorConfig` definiert (Endpoint + Transform + Fallback), so bleibt die Footer-Komponente reproduzierbar und dokumentiert zugleich jede Quelle als `citations[]`.

## 9. OECD‑Datenpipeline & Indikator-Mapping
Die App nutzt lokale OECD-Daten, um möglichst viele systemische Krisen direkt mit indikatorbasierten Messungen zu verbinden:

- Daten beschaffen:
  ```
  npm run data:oecd
  ```
  Dieses Skript lädt die SDMX-Antwort (JSON) unter `content/data/oecd/raw.json` bzw. `content/data/oecd/indicators.json` und bleibt lokal versioniert (Node 18+ vorausgesetzt).

- Mapping erzeugen:
  ```
  npm run data:map
  ```
  Das Mapping-Skript wertet jedes Manifest aus, matched die Keywords mit den OECD-Indikatoren via Score und schreibt `src/generated/indicatorMappings.ts` (→ `indicatorMappings` + `oecdIndicators`). Die generierten Module füttern `CrisisDetail` und die unteren Visualisierungen.

- Workflows:
  * Sample-Daten für den Build liegen bereits unter `content/data/oecd/indicators.json`.
  * Jeder neue Import (z. B. realer SDMX-Antwort) muss danach durch `npm run data:map` aktualisiert werden.
  * Die UI zeigt alle relevanten Indikatoren pro Krise in `IndicatorsPanel` sowie im Footer‑Ticker (SystemicRiskMatrix) mit Quellenangaben.

Damit bleibt der gesamte Mapping-Prozess offline reproduzierbar, deterministisch und erweiterbar – exakt die geforderte Pipeline.

## 10. Agenturnotizen
- **Datenpipeline:** Inhalte entstehen ausschließlich via CLI (`generate:crisis`, `extend:related`, `validate:content`, `seed:canon`). Nur dieser Weg erzeugt valide, versionierte Manifest-Daten.
- **Glossar & Mechanismen:** Neue Begriffe legen wir in `content/glossary/` + `catalog.json` an (ggf. `scripts/audit-glossary.cjs` nutzen). Diese Datasources müssen dann auch in der README/AGENT dokumentiert werden.
- **Glossar-Sync:** Nach jeder Änderung an Glossardateien `npm run glossary:sync` ausführen, damit der Katalog aktuell bleibt.
- **Visualisierung:** `CrisisNetwork` gruppiert Knoten nach Kategorien (Saturn-Ringe), `LiveEvidenceGrid` protokolliert aktuelle Ereignisse, `SystemicRiskMatrix` mixt Live-/Fallback-Indikatoren, `ObservationsFeed` simuliert Scans. Alle neuen Module bleiben D3/GSAP-basiert und greifen nur auf lokale/gedachte Streams.
- **Maintainability:** Keine Runtime-AI; alle Entscheidungen dokumentieren (status `draft` → `locked`), `citations[]` und `evidence` unterscheiden realistische Quellen von Live-Protokollen.

----
**Diese Zeilen gelten als Ausgangspunkt für jede:n neue:n Agent:in – halte dich an die Pipeline und erweitere nur über die dokumentierten Hooks.**
