import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { chord, ribbon } from 'd3-chord';
import { Metric } from '../types';

interface Props {
  crisisSlug: string;
  data: Metric[];
}

export const AdvancedVisualization: React.FC<Props> = ({ crisisSlug, data }) => {
  const sankeyRef = useRef<SVGSVGElement>(null);
  const chordRef = useRef<SVGSVGElement>(null);
  const networkRef = useRef<SVGSVGElement>(null);

  // Sankey Diagram for Money Flows (Machtmissbrauch)
  useEffect(() => {
    if (!sankeyRef.current || crisisSlug !== 'machtmissbrauch') return;

    const svg = d3.select(sankeyRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;

    // Mock data for money flows - would come from manifest or API
    const sankeyData = {
      nodes: [
        { name: "Steuerzahler" },
        { name: "Regierung" },
        { name: "Lobbygruppen" },
        { name: "Unternehmen" },
        { name: "Privatvermögen" }
      ],
      links: [
        { source: 0, target: 1, value: 100 },
        { source: 1, target: 2, value: 30 },
        { source: 2, target: 3, value: 20 },
        { source: 3, target: 4, value: 15 },
        { source: 1, target: 4, value: 10 }
      ]
    };

    const sankeyGenerator = sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[10, 10], [width - 10, height - 10]]);

    const { nodes, links } = sankeyGenerator(sankeyData as any);

    // Links
    svg.append("g")
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", "rgba(255,255,255,0.3)")
      .attr("stroke-width", d => Math.max(1, d.width))
      .attr("fill", "none");

    // Nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    node.append("rect")
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", "rgba(255,255,255,0.1)")
      .attr("stroke", "rgba(255,255,255,0.3)");

    node.append("text")
      .attr("x", d => d.x0 < width / 2 ? (d.x1 - d.x0) + 6 : -6)
      .attr("y", d => (d.y1 - d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .attr("class", "mono text-[10px] fill-white/60")
      .text(d => d.name);

  }, [crisisSlug]);

  // Chord Diagram for Lobby Connections
  useEffect(() => {
    if (!chordRef.current || crisisSlug !== 'machtmissbrauch') return;

    const svg = d3.select(chordRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;
    const outerRadius = Math.min(width, height) * 0.5 - 40;
    const innerRadius = outerRadius - 20;

    // Mock matrix for lobby connections
    const matrix = [
      [0, 5, 3, 2, 1],
      [5, 0, 4, 3, 2],
      [3, 4, 0, 5, 1],
      [2, 3, 5, 0, 4],
      [1, 2, 1, 4, 0]
    ];

    const chordGenerator = chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending);

    const chords = chordGenerator(matrix);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const ribbonGenerator = ribbon()
      .radius(innerRadius);

    const group = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)
      .datum(chords);

    // Groups
    group.append("g")
      .selectAll("g")
      .data(d => d.groups)
      .join("g")
      .append("path")
      .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("d", arc);

    // Ribbons
    group.append("g")
      .selectAll("path")
      .data(d => d)
      .join("path")
      .attr("d", ribbonGenerator)
      .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      .style("mix-blend-mode", "multiply");

  }, [crisisSlug]);

  // Network Graph for Echo Chambers (Desinformation)
  useEffect(() => {
    if (!networkRef.current || crisisSlug !== 'desinformation') return;

    const svg = d3.select(networkRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;

    // Mock network data for echo chambers
    const nodes = [
      { id: "Quelle", group: 1 },
      { id: "Echo1", group: 2 },
      { id: "Echo2", group: 2 },
      { id: "Echo3", group: 2 },
      { id: "User1", group: 3 },
      { id: "User2", group: 3 },
      { id: "User3", group: 3 }
    ];

    const links = [
      { source: "Quelle", target: "Echo1", value: 1 },
      { source: "Quelle", target: "Echo2", value: 1 },
      { source: "Echo1", target: "Echo2", value: 1 },
      { source: "Echo1", target: "User1", value: 1 },
      { source: "Echo2", target: "User2", value: 1 },
      { source: "Echo3", target: "User3", value: 1 }
    ];

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id(d => (d as any).id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(255,255,255,0.3)")
      .attr("stroke-width", 2);

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 8)
      .attr("fill", d => d3.schemeCategory10[d.group])
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("class", "mono text-[10px] fill-white/60")
      .attr("text-anchor", "middle")
      .attr("dy", -15)
      .text(d => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

  }, [crisisSlug]);

  // Render based on crisis type
  const renderVisualization = () => {
    switch (crisisSlug) {
      case 'machtmissbrauch':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 border border-white/5 bg-white/[0.01]">
              <h4 className="mono text-[12px] uppercase text-white/40 mb-4">GELDFLÜSSE // SANKEY</h4>
              <svg ref={sankeyRef} viewBox="0 0 600 400" className="w-full h-80" />
            </div>
            <div className="p-6 border border-white/5 bg-white/[0.01]">
              <h4 className="mono text-[12px] uppercase text-white/40 mb-4">LOBBY-VERBINDUNGEN // CHORD</h4>
              <svg ref={chordRef} viewBox="0 0 400 400" className="w-full h-80" />
            </div>
          </div>
        );

      case 'desinformation':
        return (
          <div className="p-6 border border-white/5 bg-white/[0.01]">
            <h4 className="mono text-[12px] uppercase text-white/40 mb-4">ECHO CHAMBER NETZWERK</h4>
            <svg ref={networkRef} viewBox="0 0 600 400" className="w-full h-80" />
          </div>
        );

      default:
        return null;
    }
  };

  return renderVisualization();
};
