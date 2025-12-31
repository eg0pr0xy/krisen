import React from "react";

export interface EvidenceEntry {
  id: string;
  title: string;
  url: string;
  sourceType?: "report" | "dataset" | "article" | "other";
}

interface EvidenceLogProps {
  items: EvidenceEntry[];
}

export const EvidenceLog: React.FC<EvidenceLogProps> = ({ items }) => {
  return (
    <div className="border border-white/10 divide-y divide-white/5">
      {items.map((item) => (
        <div
          key={item.id}
          className="group glitch-hover px-4 py-3 flex items-center gap-4 hover:text-white transition-opacity duration-100"
        >
          <div className="flex flex-col text-[9px] mono uppercase tracking-[0.5em] text-white/40">
            <span>{item.id}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium uppercase tracking-[0.3em] text-white/60">
              {item.title}
            </div>
            <a
              href={item.url}
              className="mono text-[11px] text-white/40 truncate block max-w-full"
              target="_blank"
              rel="noreferrer"
            >
              {item.url}
            </a>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[8px] mono tracking-[0.5em] text-red-500">
            [VERIFIED_BY_GROUNDING]
          </div>
        </div>
      ))}
    </div>
  );
};
