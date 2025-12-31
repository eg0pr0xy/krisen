import React from 'react';

interface LoadingProgressBarProps {
  progress: number;
  label: string;
  subtitle?: string;
  stages?: string[];
}

export const LoadingProgressBar: React.FC<LoadingProgressBarProps> = ({ progress, label, subtitle, stages }) => {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.4em] text-white/40">
        <span className="mono">{label}</span>
        <span className="mono text-[8px] text-white/30">{safeProgress.toFixed(0)}%</span>
      </div>
      <div className="w-full h-[2px] bg-white/10 overflow-hidden relative rounded-full">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-white to-red-500 transition-all duration-500"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
      {subtitle && <p className="mono text-[8px] uppercase tracking-[0.3em] text-white/30">{subtitle}</p>}
      {stages && (
        <div className="flex flex-wrap gap-2 text-[7px] uppercase tracking-[0.4em] text-white/20">
          {stages.map((stage) => (
            <span key={stage} className="px-2 py-1 border border-white/10 rounded-sm">{stage}</span>
          ))}
        </div>
      )}
    </div>
  );
};
