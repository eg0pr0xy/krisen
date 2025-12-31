
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import gsap from 'gsap';
import { Metric, CrisisManifesto } from '../types';
import { fetchExternalData } from '../services/externalDataService';
import { AdvancedVisualization } from './AdvancedVisualization';

interface Props {
  data: Metric[];
  statisticalData?: CrisisManifesto['statisticalData'];
  crisisSlug?: string;
}

export const CrisisVisualization: React.FC<Props> = ({ data, statisticalData, crisisSlug }) => {
  const barRef = useRef<SVGSVGElement>(null);
  const waveRef = useRef<SVGSVGElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [tickerValue, setTickerValue] = useState("00.000000");
  const [externalData, setExternalData] = useState<Metric[]>([]);
  const [isLoadingExternal, setIsLoadingExternal] = useState(false);

  // Kinetic Bar Chart with D3 + GSAP
  useEffect(() => {
    if (!barRef.current || !data.length) return;
    const svg = d3.select(barRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 160 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);
    const y = d3.scaleBand().domain(data.map(d => d.label)).range([0, innerHeight]).padding(0.2);

    // Bars
    const barGroups = g.selectAll(".bar-group")
      .data(data)
      .enter().append("g")
      .attr("class", "bar-group");

    barGroups.append("rect")
      .attr("y", d => y(d.label)!)
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", 0) // Start at zero for animation
      .attr("fill", "rgba(255,255,255,0.1)")
      .attr("class", "metric-bar");

    barGroups.append("text")
      .attr("x", -10)
      .attr("y", d => y(d.label)! + y.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("class", "mono text-[8px] fill-white/40 uppercase tracking-widest")
      .text(d => d.label);

    // GSAP Animation Sequence
    gsap.to(svg.selectAll(".metric-bar").nodes(), {
      width: (i, target) => x(data[i].value),
      duration: 1.5,
      stagger: 0.1,
      ease: "expo.out",
      delay: 0.5
    });

    // Add jitter animation
    data.forEach((_, i) => {
      gsap.to(svg.selectAll(".metric-bar").nodes()[i], {
        opacity: 0.6,
        duration: 0.1,
        repeat: -1,
        yoyo: true,
        delay: Math.random(),
        ease: "none"
      });
    });

  }, [data]);

  // Entropy Waveform with D3
  useEffect(() => {
    if (!waveRef.current) return;
    const svg = d3.select(waveRef.current);
    svg.selectAll("*").remove();
    
    const width = 600;
    const height = 100;
    const points = 50;
    const dataPoints = d3.range(points).map(() => Math.random() * 50 + 25);
    
    const x = d3.scaleLinear().domain([0, points - 1]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    
    const line = d3.line<number>()
      .x((_, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveBasis);

    const path = svg.append("path")
      .datum(dataPoints)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      .attr("d", line);

    // Animation loop
    const update = () => {
      dataPoints.shift();
      dataPoints.push(Math.random() * 60 + 20);
      path.attr("d", line);
      requestAnimationFrame(update);
    };
    const animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Load external data
  useEffect(() => {
    if (crisisSlug) {
      setIsLoadingExternal(true);
      fetchExternalData(crisisSlug)
        .then(setExternalData)
        .catch(console.error)
        .finally(() => setIsLoadingExternal(false));
    }
  }, [crisisSlug]);

  // Ticker Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerValue((Math.random() * 100).toFixed(6).padStart(9, '0'));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Primary Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Primary Bar Visualization */}
        <div className="lg:col-span-8 p-10 border border-white/5 bg-white/[0.01] relative overflow-hidden">
          <div className="flex justify-between items-start mb-12">
            <div className="flex flex-col">
              <span className="mono text-[8px] uppercase tracking-[0.4em] text-white/20 mb-2">ARCHIVE_MOD_01 // KINETIC_BARS</span>
              <h4 className="mono text-[10px] uppercase text-white/40 tracking-[0.2em] font-medium">Systemic Pressure Indices</h4>
            </div>
            <div className="mono text-[24px] font-black text-white/5 select-none">{tickerValue}</div>
          </div>

          <div className="w-full h-[300px] flex items-center justify-center">
            <svg ref={barRef} viewBox="0 0 600 300" className="w-full h-full overflow-visible" />
          </div>
        </div>

        {/* Waveform & Secondary Indices */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-10 border border-white/5 bg-white/[0.01] relative flex-grow overflow-hidden">
             <span className="mono text-[8px] uppercase tracking-[0.4em] text-white/20 mb-4 block">ENTROPY_OSCILLATOR</span>
             <div className="w-full h-[100px]">
               <svg ref={waveRef} viewBox="0 0 600 100" className="w-full h-full overflow-visible" />
             </div>
             <div className="mt-8 border-t border-white/5 pt-6">
               <div className="grid grid-cols-2 gap-4">
                 {statisticalData?.slice(0, 4).map((d, i) => (
                   <div key={i} className="flex flex-col">
                     <span className="mono text-[7px] text-white/20 uppercase truncate">{d.label}</span>
                     <span className="mono text-lg font-black tracking-tighter">{d.value}</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>

          <div ref={tickerRef} className="p-6 border border-white/5 bg-black overflow-hidden flex items-center justify-center">
             <div className="mono text-[11px] text-white/40 tracking-[0.5em] whitespace-nowrap animate-ticker">
               {tickerValue} — SYSTEM_INTEGRITY: NORMAL — DATA_POINT_ALPHA: {Math.random().toFixed(4)} — LATENCY: 24MS — {tickerValue}
             </div>
             <style>{`
               @keyframes ticker {
                 0% { transform: translateX(50%); }
                 100% { transform: translateX(-50%); }
               }
               .animate-ticker { animation: ticker 15s linear infinite; }
             `}</style>
          </div>
        </div>
      </div>

      {/* Advanced Visualizations */}
      {crisisSlug && (
        <div className="mt-8">
          <AdvancedVisualization crisisSlug={crisisSlug} data={data} />
        </div>
      )}
    </div>
  );
};
