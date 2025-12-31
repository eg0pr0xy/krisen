import React, { useMemo } from "react";
import {
  useLiveIndicators,
  LiveIndicatorConfig,
  LiveIndicatorStatus,
} from "../src/hooks/useLiveIndicator";

export type SystemicRiskSource = {
  id: string;
  label: string;
  unit: string;
  value: number;
  baseline?: number;
  trend?: "up" | "down" | "stable";
};

interface SystemicRiskMatrixProps {
  dataSources?: SystemicRiskSource[];
  useMockData?: boolean;
}

type InternalSystemicRiskSource = SystemicRiskSource & { trend: "up" | "down" | "stable" };

const DEFAULT_SOURCES: SystemicRiskSource[] = [
  { id: "co2", label: "ATMOSPHERIC CO₂", unit: "ppm", value: 422.0, baseline: 410 },
  { id: "temp", label: "GLOBAL TEMP ANOMALY", unit: "°C", value: 1.23, baseline: 1.0 },
  { id: "vix", label: "VIX VOLATILITY", unit: "pts", value: 19.2, baseline: 18 },
  { id: "energy", label: "ENERGY PRICE INDEX", unit: "pts", value: 178.4, baseline: 165 },
];

const formatTimestamp = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(
    date.getUTCHours(),
  )}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
};

export const useSimulatedSystemicRisk = (sources: SystemicRiskSource[], useMockData: boolean) => {
  const baseSources = useMemo(
    () =>
      sources.map((source) => ({
        ...source,
        value: Number(source.value.toFixed(2)),
        trend: source.trend ?? "stable",
      })),
    [sources],
  );

  const [data, setData] = React.useState<InternalSystemicRiskSource[]>(baseSources);
  const [timestamp, setTimestamp] = React.useState(() => formatTimestamp(new Date()));

  React.useEffect(() => {
    if (!useMockData) {
      setData(baseSources);
      return;
    }

    let mounted = true;
    let handle: number;

    const update = () => {
      setData((prev) =>
        prev.map((source) => {
          const variance = source.baseline ? source.baseline * 0.003 : source.value * 0.002;
          const delta = (Math.random() - 0.5) * variance;
          const nextValue = Number((source.value + delta).toFixed(2));
          const trend: "up" | "down" | "stable" =
            delta > 0.02 ? "up" : delta < -0.02 ? "down" : "stable";
          return {
            ...source,
            value: nextValue,
            trend,
          };
        }),
      );

      if (!mounted) return;
      const delay = 3000 + Math.random() * 4000;
      handle = window.setTimeout(update, delay);
    };

    handle = window.setTimeout(update, 1500);

    return () => {
      mounted = false;
      window.clearTimeout(handle);
    };
  }, [baseSources, useMockData]);

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setTimestamp(formatTimestamp(new Date()));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return { sources: data, timestamp };
};

export const SystemicRiskMatrix: React.FC<SystemicRiskMatrixProps> = ({
  dataSources,
  useMockData = false,
}) => {
  const sources = dataSources && dataSources.length > 0 ? dataSources : DEFAULT_SOURCES;
  const { sources: simulatedSources, timestamp: simulatedTimestamp } = useSimulatedSystemicRisk(
    sources,
    useMockData,
  );

  const indicatorConfigs = useMemo<LiveIndicatorConfig[]>(() => {
    const co2Fallback = {
      value: "421.7 ppm",
      unit: "ppm",
      source: "global-warming.org",
      timestamp: "2024-May",
    };
    const tempFallback = {
      value: "1.24 °C",
      unit: "°C",
      source: "global-warming.org",
      timestamp: "2024",
    };
    const unemploymentFallback = {
      value: "2.9%",
      unit: "%",
      source: "World Bank",
      timestamp: "2023",
    };
    return [
      {
        id: "co2",
        label: "ATMOSPHERIC CO₂",
        endpoint: "https://global-warming.org/api/co2-api",
        cacheTTL: 1800,
        fallback: co2Fallback,
        transform: (payload: any) => {
          const entry = payload?.co2;
          if (!entry) return {};
          const value = `${Number(entry?.average ?? entry?.ppm ?? 0).toFixed(2)} ppm`;
          const month = entry?.month ?? entry?.month_abbrev ?? "01";
          const year = entry?.year ?? entry?.date ?? "";
          const timestamp = year ? `${year}-${month}` : undefined;
          return {
            value,
            unit: "ppm",
            source: entry?.source ?? co2Fallback.source,
            timestamp,
            note: entry?.trend,
          };
        },
      },
      {
        id: "temp",
        label: "GLOBAL TEMP ANOMALY",
        endpoint: "https://global-warming.org/api/temperature-api?start=2020&end=2024",
        cacheTTL: 1800,
        fallback: tempFallback,
        transform: (payload: any) => {
          const series = payload?.result;
          if (!Array.isArray(series) || series.length === 0) return {};
          const latest = series[series.length - 1];
          const mean = Number(latest?.mean ?? latest?.average ?? 0);
          return {
            value: `${mean.toFixed(2)} °C`,
            unit: "°C",
            source: "global-warming.org",
            timestamp: latest?.year ? `${latest?.year}` : undefined,
          };
        },
      },
      {
        id: "unemployment",
        label: "EU UNEMPLOYMENT",
        endpoint:
          "https://api.worldbank.org/v2/country/DE/indicator/SL.UEM.TOTL.ZS?date=2022:2023&format=json&per_page=1",
        cacheTTL: 3600,
        fallback: unemploymentFallback,
        transform: (payload: any) => {
          const entry = Array.isArray(payload) ? payload[1]?.[0] : undefined;
          if (!entry) return {};
          return {
            value: `${(entry?.value ?? 0).toFixed(1)}%`,
            unit: "%",
            source: "World Bank",
            timestamp: entry?.date,
          };
        },
      },
    ];
  }, []);

  const liveIndicators = useLiveIndicators(indicatorConfigs);

  const formatSimulatedValue = (value: number) => value.toFixed(2);

  type TickerRow = {
    id: string;
    label: string;
    value: string;
    unit?: string;
    trend: "up" | "down" | "stable";
    source: string;
    timestamp?: string;
    note?: string;
    status: LiveIndicatorStatus;
  };

  const simulatedTickerData: TickerRow[] = simulatedSources.map((source) => ({
    id: source.id,
    label: source.label,
    value: formatSimulatedValue(source.value),
    unit: source.unit,
    trend: source.trend,
    source: "simulation",
    status: "fallback",
  }));

  const liveTickerData: TickerRow[] = liveIndicators.map((indicator) => ({
    id: indicator.id,
    label: indicator.label,
    value: indicator.value,
    unit: indicator.unit,
    trend:
      indicator.status === "live" ? "up" : indicator.status === "error" ? "down" : "stable",
    source: indicator.source,
    timestamp: indicator.timestamp,
    note: indicator.note,
    status: indicator.status,
  }));

  const tickerData = useMockData ? simulatedTickerData : liveTickerData;
  const tickerList = [...tickerData, ...tickerData];
  const displayTimestamp = React.useMemo(() => {
    if (useMockData) return simulatedTimestamp;
    const liveTs = liveIndicators.find((ind) => ind.timestamp)?.timestamp;
    return liveTs || formatTimestamp(new Date());
  }, [useMockData, simulatedTimestamp, liveIndicators]);

  return (
    <div
      role="status"
      aria-label="Systemic risk matrix live indicators"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 px-4 py-2"
    >
      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-1">
          <span className="mono text-[9px] uppercase tracking-[0.3em] text-white/60">
            SYSTEMIC RISK MATRIX
          </span>
          <span className="text-[8px] text-white/30 tracking-[0.5em]">
            GLOBAL STATUS: MONITORING LIVE SIGNALS
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center whitespace-nowrap gap-8 animate-ticker will-change-transform">
            {tickerList.map((source, idx) => (
              <div
                key={`${source.id}-${source.value}-${idx}`}
                className="flex items-baseline gap-1 border-l border-white/10 pl-4 hover:animate-glitch-soft transition-opacity duration-100"
              >
                <span className="mono text-[8px] uppercase tracking-[0.2em] text-white/40">
                  {source.label}
                </span>
                <span className="text-sm font-semibold text-white font-tabular">{source.value}</span>
                <span className="text-[9px] text-white/40">{source.unit}</span>
                <span className="mono text-[9px] text-red-500 tracking-[0.4em]">
                  {source.trend === "up" ? "[↑]" : source.trend === "down" ? "[↓]" : "[≈]"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mono text-[8px] text-white/20 tracking-[0.3em] font-tabular">
          {displayTimestamp}
        </div>
      </div>
    </div>
  );
};
