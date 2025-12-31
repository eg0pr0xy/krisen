import React, { useEffect, useMemo, useState } from "react";

type DateLike = string | number | Date;

const parseDate = (value?: DateLike): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const formatDuration = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${hours}:${pad(minutes)}:${pad(seconds)}`;
};

interface DoomClockProps {
  target: DateLike;
  start?: DateLike;
  size?: number;
  label?: string;
  className?: string;
}

const useNow = (interval = 1000) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const handle = window.setInterval(() => setNow(Date.now()), interval);
    return () => window.clearInterval(handle);
  }, [interval]);
  return now;
};

const computeProgress = (start?: Date, target?: Date, now?: number) => {
  if (!target) return 0;
  const startTime = start ? start.getTime() : now ?? Date.now();
  const targetTime = target.getTime();
  if (targetTime <= startTime) return 1;
  const elapsed = Math.max(0, (now ?? Date.now()) - startTime);
  return Math.min(1, elapsed / (targetTime - startTime));
};

export const CompactDoomClock: React.FC<DoomClockProps> = ({
  target,
  start,
  size = 68,
  label,
  className = "",
}) => {
  const now = useNow(1000);
  const targetDate = parseDate(target) || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  const startDate = parseDate(start) || new Date(now);
  const remaining = Math.max(0, targetDate.getTime() - now);
  const progress = computeProgress(startDate, targetDate, now);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - progress * circumference;
  const timeText = label ? label : `T–${formatDuration(remaining)}`;

  const gradientId = React.useMemo(
    () => `doom-gradient-${Math.random().toString(36).slice(2, 7)}`,
    [],
  );

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 text-[9px] uppercase tracking-[0.4em] text-white/60 ${className}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={4}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={4}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-[8px] text-white/70">{timeText}</span>
    </div>
  );
};

export const DoomClock: React.FC<DoomClockProps & { description?: string }> = ({
  target,
  start,
  size = 110,
  label,
  className = "",
  description,
}) => {
  const now = useNow(1000);
  const targetDate = parseDate(target) || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  const startDate = parseDate(start) || new Date(now);
  const remaining = Math.max(0, targetDate.getTime() - now);
  const progress = computeProgress(startDate, targetDate, now);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - progress * circumference;
  const timeText = label ? label : `T–${formatDuration(remaining)}`;

  const gradientId = React.useMemo(
    () => `doom-gradient-${Math.random().toString(36).slice(2, 7)}`,
    [],
  );

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={6}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={6}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">{timeText}</div>
      {description && <p className="text-[9px] text-white/50 text-center">{description}</p>}
    </div>
  );
};
