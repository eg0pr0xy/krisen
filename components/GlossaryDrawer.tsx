import React from "react";
import { CrisisGlossaryEntry, Language } from "../types";

import glossaryCatalog from "../content/glossary/catalog.json";

type GlossaryCatalogTerm = {
  term: string;
  definition: { de: string; en: string };
};

const glossaryCatalogMap = new Map<string, GlossaryCatalogTerm["definition"]>();
((glossaryCatalog?.terms ?? []) as GlossaryCatalogTerm[]).forEach((entry) => {
  glossaryCatalogMap.set(entry.term.trim().toLowerCase(), entry.definition);
});

interface GlossaryDrawerProps {
  entry: CrisisGlossaryEntry;
  lang: Language;
  onClose: () => void;
}

export const GlossaryDrawer: React.FC<GlossaryDrawerProps> = ({ entry, lang, onClose }) => {
  const fallback = glossaryCatalogMap.get(entry.term.trim().toLowerCase());
  const definition =
    typeof entry.definition === "string"
      ? entry.definition
      : entry.definition?.[lang] || fallback?.[lang] || "";
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-black border-l border-white/20 shadow-2xl h-full overflow-y-auto no-scrollbar animate-slide-in">
        <div className="p-10 md:p-14 space-y-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="mono text-[9px] uppercase tracking-[0.5em] text-white/40 mb-4">Glossar // Atlas</div>
              <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">{entry.term}</h2>
            </div>
            <button
              onClick={onClose}
              className="group flex items-center gap-3 border border-white/10 px-4 py-2 hover:bg-white hover:text-black transition-all"
            >
              <span className="mono text-[10px] uppercase tracking-[0.3em] font-medium">
                {lang === "de" ? "Schließen" : "Close"}
              </span>
              <span className="text-xl group-hover:rotate-90 transition-transform">×</span>
            </button>
          </div>

          <p className="text-lg md:text-xl font-light leading-relaxed text-white/70">
            {definition || (lang === "de" ? "Keine Definition hinterlegt." : "No definition available.")}
          </p>

          {entry.archetypeLink && (
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-white/30 border-t border-white/10 pt-6">
              Archetyp: {entry.archetypeLink}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
