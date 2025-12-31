import React, { useEffect, useMemo, useState } from "react";

interface ObservationsFeedProps {
  status: "SIGNAL_ACTIVE" | "NO_SIGNAL" | "LOADING";
  videoUrl?: string;
  onInitialize?: () => void;
}

const CODE_LOGS = ["[DECODING...]", "[FRAME_SYNTHESIS...]", "[ENTROPY_CHECK...]", "[TIMESTAMP_SYNC...]", "[BITRATE_STABILIZED...]"];

const STATUS_META = {
  SIGNAL_ACTIVE: { color: "#22c55e", label: "SIGNAL_ACTIVE" },
  NO_SIGNAL: { color: "#ef4444", label: "NO SIGNAL" },
  LOADING: { color: "#facc15", label: "DIAGNOSTIC" },
} as const;

const formatIsoTimestamp = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(
    date.getUTCHours(),
  )}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
};

export const ObservationsFeed: React.FC<ObservationsFeedProps> = ({ status, videoUrl, onInitialize }) => {
  const [timestamp, setTimestamp] = useState(() => formatIsoTimestamp(new Date()));
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimestamp(formatIsoTimestamp(new Date()));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    let cycle = 0;
    const timeouts: number[] = [];

    const pushLog = () => {
      if (!active || status !== "LOADING") return;
      setLogs((current) => {
        const nextLine = CODE_LOGS[cycle % CODE_LOGS.length];
        cycle += 1;
        const windowed = [...current, nextLine];
        return windowed.length > 5 ? windowed.slice(windowed.length - 5) : windowed;
      });
      const delay = 500 + Math.random() * 900;
      timeouts.push(window.setTimeout(pushLog, delay));
    };

    if (status === "LOADING") {
      setLogs([]);
      pushLog();
    } else {
      setLogs([]);
    }

    return () => {
      active = false;
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [status]);

  const showVideo = status === "SIGNAL_ACTIVE" && videoUrl;
  const isoStatus = STATUS_META[status];

  const handleInitialize = () => {
    if (onInitialize) {
      onInitialize();
    }
  };

  return (
    <section className="border border-white/10 bg-[#020617] p-3">
      <div className="mono text-[8px] uppercase tracking-[0.4em] px-3 py-1 border border-white/5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full pulse-dot`}
            style={{ backgroundColor: isoStatus.color }}
          />
          <span className="text-white/40">{isoStatus.label}</span>
        </div>
        <div className="font-tabular text-[8px] text-white/60">{timestamp}</div>
      </div>

      <div className="relative overflow-hidden border-t border-white/5 mt-2" style={{ minHeight: 220 }}>
        <div className="absolute inset-0 scanlines" aria-hidden="true" />
        <div className="relative flex items-center justify-center min-h-[220px] bg-black">
          {status === "LOADING" && (
            <div className="space-y-1 text-[11px] mono text-white/60 tracking-[0.2em]">
              {logs.map((entry, idx) => (
                <div key={`${entry}-${idx}`} className="text-white/60">
                  <span className="text-amber-400">{entry}</span>
                </div>
              ))}
            </div>
          )}
          {!showVideo && status !== "LOADING" && (
            <button
              onClick={handleInitialize}
              className="glitch-hover mono text-[9px] uppercase tracking-[0.5em] border border-white/60 text-white/80 px-6 py-3 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
            >
              INITIALIZE FEED
            </button>
          )}
          {showVideo && (
            <video
              src={videoUrl}
              controls
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
              aria-label="Observational feed"
            />
          )}
        </div>
      </div>
    </section>
  );
};
