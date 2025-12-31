import React from "react";
import { Language } from "../types";

interface CrisisFiltersProps {
  lang: Language;
  activeFilter: string;
  filters: { id: string; categories: string[]; label: Record<Language, string> }[];
  search: string;
  sort: "index" | "severity" | "volatility" | "alphabetic" | "lastUpdated";
  onFilterChange: (filter: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: CrisisFiltersProps["sort"]) => void;
}

export const CrisisFilters: React.FC<CrisisFiltersProps> = ({
  lang,
  activeFilter,
  filters,
  search,
  sort,
  onFilterChange,
  onSearchChange,
  onSortChange,
}) => {
  const t = {
    de: {
      placeholder: "Tags, Begriffe, Zeitachsen",
      sort: "Sortieren nach",
      options: {
        index: "Numerisch",
        severity: "Schweregrad",
        volatility: "Volatilität",
        alphabetic: "Alphabetisch",
        lastUpdated: "Aktualisiert",
      },
    },
    en: {
      placeholder: "Tags, terms, horizons",
      sort: "Sort by",
      options: {
        index: "Index",
        severity: "Severity",
        volatility: "Volatility",
        alphabetic: "Alphabetic",
        lastUpdated: "Last updated",
      },
    },
  }[lang];

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`mono text-[10px] font-medium uppercase tracking-[0.4em] px-4 py-2 border transition-all duration-500 ${
              activeFilter === filter.id
                ? "bg-white text-black border-white"
                : "text-white/20 border-white/5 hover:border-white/40"
            }`}
          >
            {filter.label[lang]}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-grow w-full">
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.placeholder}
            className="w-full bg-black border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="mono text-[9px] uppercase tracking-[0.3em] text-white/30">{t.sort}</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as CrisisFiltersProps["sort"])}
            className="bg-black border border-white/10 text-white px-4 py-3 text-[12px] uppercase tracking-[0.2em] focus:border-white/40"
          >
            {Object.entries(t.options).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
