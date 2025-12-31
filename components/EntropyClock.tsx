import React, { useEffect, useRef, useState } from "react";

const pad = (value: number, digits: number) => String(value).padStart(digits, "0");

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = pad(date.getHours(), 2);
  const minutes = pad(date.getMinutes(), 2);
  const seconds = pad(date.getSeconds(), 2);
  const millis = pad(date.getMilliseconds(), 3);
  return `${hours}:${minutes}:${seconds}:${millis}`;
};

export const EntropyClock: React.FC = () => {
  const [now, setNow] = useState(() => Date.now());
  const [glitch, setGlitch] = useState(false);
  const prevSecond = useRef(Math.floor(Date.now() / 1000));

  useEffect(() => {
    let rafId: number;
    const loop = () => {
      setNow(Date.now());
      rafId = window.requestAnimationFrame(loop);
    };
    loop();
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const currentSecond = Math.floor(now / 1000);
    if (currentSecond !== prevSecond.current) {
      prevSecond.current = currentSecond;
      setGlitch(true);
      const timer = window.setTimeout(() => setGlitch(false), 100);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [now]);

  return (
    <div className="flex flex-col items-end gap-1 text-right">
      <span className="mono text-[7px] uppercase tracking-[0.5em] text-red-500">
        SYSTEMIC ENTROPY
      </span>
      <span
        className={`mono text-xs font-tabular uppercase tracking-[0.2em] ${glitch ? "text-red-500 animate-entropy-glitch" : "text-slate-100"}`}
      >
        {formatTime(now)}
      </span>
    </div>
  );
};
