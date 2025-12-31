import React from "react";

export type IndicatorTrend = "up" | "down" | "stable";

export interface IndicatorDatum {
  id: string;
  label: string;
  value: number | string;
  trend: IndicatorTrend;
  interpretation: string;
}

interface IndicatorsPanelProps {
  indicators: IndicatorDatum[];
}

const TREND_SYMBOLS: Record<IndicatorTrend, string> = {
  up: "↑",
  down: "↓",
  stable: "≈",
};

export const IndicatorsPanel: React.FC<IndicatorsPanelProps> = ({ indicators }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px]">
      {indicators.map((indicator) => (
        <article
          key={indicator.id}
          className="border border-white/10 bg-black px-4 py-4 flex flex-col gap-4"
        >
          <div className="mono text-[7px] uppercase tracking-[0.45em] text-white/40">
            {indicator.label}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[30px] font-black font-tabular leading-tight">{indicator.value}</div>
            <span className="text-[16px] text-red-500 mono tracking-[0.5em]">{`[${TREND_SYMBOLS[indicator.trend]}]`}</span>
          </div>
          <p className="text-[11px] italic text-white/60 leading-snug">{indicator.interpretation}</p>
        </article>
      ))}
    </div>
  );
};
