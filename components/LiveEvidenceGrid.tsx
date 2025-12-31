import React from "react";

export type LiveEvidenceItem = {
  id: string;
  title: string;
  url: string;
  source?: string;
  timestamp?: string;
};

interface LiveEvidenceGridProps {
  items: LiveEvidenceItem[];
}

export const LiveEvidenceGrid: React.FC<LiveEvidenceGridProps> = ({ items }) => {
  if (!items.length) return null;
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, idx) => (
        <a
          key={item.id + idx}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="group border border-white/5 bg-white/5 px-4 py-4 flex flex-col gap-4 hover:border-red-500 hover:bg-white/10 transition-colors duration-200"
        >
          <div className="flex justify-between items-start">
            <span className="mono text-[8px] uppercase tracking-[0.3em] text-white/40">
              RADAR_TARGET // {item.id}
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition-all duration-150 text-[16px] text-white">
              ↗
            </span>
          </div>

          <h3 className="text-[14px] font-semibold uppercase leading-tight text-slate-50">
            {item.title}
          </h3>

          <div className="flex items-center justify-between">
            <span className="mono text-[9px] uppercase tracking-[0.3em] text-red-500 border border-red-500 px-2 py-[2px]">
              LIVE_NOW
            </span>
            {item.timestamp && (
              <span className="mono text-[8px] uppercase tracking-[0.3em] text-white/40">
                {item.timestamp}
              </span>
            )}
          </div>

          {item.source && (
            <div className="mono text-[8px] uppercase tracking-[0.3em] text-white/30">
              {item.source}
            </div>
          )}
        </a>
      ))}
    </div>
  );
};
