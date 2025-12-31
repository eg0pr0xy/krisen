import { useEffect, useMemo, useState } from "react";

export type LiveIndicatorStatus = "live" | "fallback" | "error";

export type LiveIndicatorValue = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  source: string;
  timestamp?: string;
  note?: string;
  status: LiveIndicatorStatus;
};

export interface LiveIndicatorConfig {
  id: string;
  label: string;
  endpoint?: string;
  fallback: Omit<LiveIndicatorValue, "status">;
  cacheTTL?: number;
  transform?: (payload: any) => Partial<Omit<LiveIndicatorValue, "id" | "label">>;
}

const readCache = (key: string, ttl: number) => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.created > ttl) {
      window.localStorage.removeItem(key);
      return null;
    }
    return parsed.data as LiveIndicatorValue;
  } catch {
    return null;
  }
};

const writeCache = (key: string, value: LiveIndicatorValue) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify({
        created: Date.now(),
        data: value,
      }),
    );
  } catch {
    //
  }
};

export const useLiveIndicator = (config: LiveIndicatorConfig): LiveIndicatorValue => {
  const cacheKey = useMemo(() => `live-indicator:${config.id}`, [config.id]);
  const ttl = (config.cacheTTL ?? 600) * 1000;
  const baseState: LiveIndicatorValue = useMemo(
    () => ({
      id: config.id,
      label: config.label,
      value: config.fallback.value,
      unit: config.fallback.unit,
      source: config.fallback.source,
      timestamp: config.fallback.timestamp,
      note: config.fallback.note,
      status: "fallback" as LiveIndicatorStatus,
    }),
    [config],
  );
  const [state, setState] = useState<LiveIndicatorValue>(baseState);

  useEffect(() => {
    if (!config.endpoint) return;
    if (typeof window === "undefined") return;

    let canceled = false;
    const cached = readCache(cacheKey, ttl);
    if (cached) {
      setState({ ...cached, status: "live" });
      return;
    }

    const fetchIndicator = async () => {
      try {
        const response = await fetch(config.endpoint);
        if (!response.ok) throw new Error("Network error");
        const payload = await response.json();
        const partial = config.transform?.(payload) ?? {};
        const nextState: LiveIndicatorValue = {
          ...baseState,
          ...partial,
          status: "live",
        };
        if (nextState.value) {
          setState(nextState);
          writeCache(cacheKey, nextState);
        }
      } catch (err) {
        if (canceled) return;
        setState((prev) => ({ ...prev, status: "error" }));
      }
    };

    fetchIndicator();

    return () => {
      canceled = true;
    };
  }, [cacheKey, config.endpoint, config.fallback, config.transform, ttl, baseState]);

  return state;
};

export const useLiveIndicators = (configs: LiveIndicatorConfig[]) => configs.map((config) => useLiveIndicator(config));
