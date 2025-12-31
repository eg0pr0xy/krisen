import React, { CSSProperties } from "react";
import { CATEGORY_LABELS, CrisisCategory, CrisisIndexItem, Language } from "../types";

interface CrisisGridProps {
  items: CrisisIndexItem[];
  lang: Language;
  onSelect: (item: CrisisIndexItem) => void;
  onCategory: (category: CrisisCategory | "ALL") => void;
  orderMap: Record<string, number>;
}

const SeverityBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full h-1 bg-white/10 overflow-hidden">
    <div className="h-full bg-white transition-all duration-700" style={{ width: `${value}%` }} />
  </div>
);

const VolatilityGlyph: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 border border-white/20 relative">
      <div
        className="absolute inset-1 bg-white/20"
        style={{ transform: `rotate(${value - 50}deg)` }}
      />
    </div>
    <span className="mono text-[9px] uppercase tracking-[0.3em] text-white/40">{value}</span>
  </div>
);

const summaryClampStyle: CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
};

export const CrisisGrid: React.FC<CrisisGridProps> = ({ items, lang, onSelect, onCategory, orderMap }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-14">
      {items.map((crisis, index) => (
        <div
          key={crisis.slug}
          className="group cursor-pointer border-t border-white/5 pt-8 hover:border-white/40 transition-all duration-700"
          onClick={() => onSelect(crisis)}
        >
          <div className="flex justify-between mb-4 items-center">
            <span className="mono text-[8px] text-white/10">
              {String((orderMap[crisis.slug] ?? index) + 1).padStart(3, "0")}
            </span>
            <div className="flex gap-2 flex-wrap justify-end">
              {crisis.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategory(cat);
                  }}
                  className="mono text-[7px] text-white/30 uppercase tracking-[0.4em] border border-white/10 px-2 py-1 hover:border-white/50 hover:text-white transition-all"
                >
                  {CATEGORY_LABELS[lang][cat]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 mb-4">
            <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight transition-colors duration-500 min-h-[4.5rem] group-hover:text-red-500">
              {crisis.title}
            </h3>
            <p
              className="text-sm text-white/60 leading-snug"
              style={summaryClampStyle}
            >
              {crisis.summary}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex flex-col gap-2 flex-grow pr-4">
              <span className="mono text-[8px] uppercase tracking-[0.3em] text-white/30">Schwere</span>
              <SeverityBar value={crisis.severity} />
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="mono text-[8px] uppercase tracking-[0.3em] text-white/30">Volatil</span>
              <VolatilityGlyph value={crisis.volatility} />
            </div>
          </div>

          <div className="mt-6 mono text-[8px] uppercase tracking-[0.3em] text-white/10 group-hover:text-white/50 transition-all">
            {new Date(crisis.lastUpdatedISO).toISOString().split("T")[0]} // v{crisis.version}
          </div>
        </div>
      ))}
    </div>
  );
};
