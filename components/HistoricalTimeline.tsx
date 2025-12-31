import { useEffect, useMemo, useRef, useState } from "react";
import { axisBottom, scaleLinear, select } from "d3";

export type TimelineEvent = {
  year: string;
  location?: string;
  event: string;
  description?: string;
};

type HistoricalTimelineProps = {
  events: TimelineEvent[];
};

const MICRO_GLITCH = "animate-glitch-soft";

export function HistoricalTimeline({ events }: HistoricalTimelineProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [active, setActive] = useState<TimelineEvent | null>(events[0] ?? null);

  const parsedEvents = useMemo(() => {
    return [...events]
      .map((entry, index) => ({
        ...entry,
        yearValue: Number.parseInt(entry.year, 10) || 0,
        index,
      }))
      .sort((a, b) => a.yearValue - b.yearValue || a.index - b.index);
  }, [events]);

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!parsedEvents.length) {
      svg.selectAll("*").remove();
      return;
    }

    const width = Math.max(600, parsedEvents.length * 120);
    const height = 140;

    const minYear = Math.min(...parsedEvents.map((e) => e.yearValue));
    const maxYear = Math.max(...parsedEvents.map((e) => e.yearValue));
    const domainStart = minYear - 1;
    const domainEnd = maxYear + 1;

    const xScale = scaleLinear().domain([domainStart, domainEnd]).range([40, width - 40]);

    svg.attr("viewBox", `0 0 ${width} ${height}`);
    svg.selectAll("*").remove();

    svg
      .append("line")
      .attr("x1", xScale(domainStart - 0.5))
      .attr("x2", xScale(domainEnd + 0.5))
      .attr("y1", height / 2)
      .attr("y2", height / 2)
      .attr("stroke", "rgba(255,255,255,0.2)")
      .attr("stroke-width", 1);

    const axis = axisBottom(xScale).ticks(Math.min(parsedEvents.length, 10)).tickFormat((d) => `${d}`); 
    svg
      .append("g")
      .attr("transform", `translate(0, ${height / 2 + 20})`)
      .call(axis)
      .selectAll("text")
      .attr("class", "mono text-[9px]")
      .style("fill", "rgba(255,255,255,0.6)");

    svg
      .selectAll("circle")
      .data(parsedEvents)
      .join("circle")
      .attr("cx", (d) => xScale(d.yearValue))
      .attr("cy", height / 2)
      .attr("r", 10)
      .attr("fill", "transparent")
      .attr("stroke", "rgba(255,255,255,0.3)")
      .attr("stroke-width", 1.25)
      .attr("class", "transition-all duration-300")
      .on("mouseenter", (_, datum) => setActive(datum))
      .on("focus", (_, datum) => setActive(datum))
      .on("mouseleave", () => setActive(parsedEvents[0] ?? null));

    svg
      .selectAll("circle::after")
      .attr("pointer-events", "none");

    svg
      .selectAll("circle")
      .attr("filter", "none");
  }, [parsedEvents]);

  if (!parsedEvents.length) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-start">
      <div className="border border-white/10 bg-white/[0.02] p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="mono text-[8px] uppercase tracking-[0.5em] text-white/30">
            HISTORICAL TIMELINE
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <svg ref={svgRef} className="w-full h-[160px]" role="img" aria-label="Chronological timeline of events" />
      </div>
      <div className="border border-white/10 bg-white/[0.01] p-6 flex flex-col gap-4">
        <div className="text-[10px] uppercase tracking-[0.4em] mono text-white/40">
          Focused year
        </div>
        {active && (
          <div className="space-y-3">
            <div className="mono text-[12px] uppercase tracking-[0.4em] text-accent">
              {active.year}
            </div>
            <div className="text-xl font-black uppercase text-white">{active.event}</div>
            {active.location && (
              <div className="mono text-[9px] uppercase tracking-[0.3em] text-white/50">
                {active.location}
              </div>
            )}
            {active.description && (
              <p className="text-sm leading-relaxed text-white/70">{active.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
