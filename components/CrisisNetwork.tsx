import React, { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { CrisisIndexItem } from "../types";
import type { CrisisManifest } from "../src/content/types";
import polyRelations from "../content/relations/polycrisis.json";

type LinkType = "trigger" | "related" | "shared" | "polycrisis";

interface NetworkNode extends CrisisIndexItem {
  manifest?: CrisisManifest;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface NetworkLink {
  source: string;
  target: string;
  value: number;
  type: LinkType;
  directional: boolean;
}

interface PolycrisisEdge {
  source: string;
  target: string;
  type: string;
}

interface Props {
  crises: CrisisIndexItem[];
  manifestMap: Record<string, CrisisManifest>;
  onNodeClick?: (crisis: CrisisIndexItem) => void;
}

const CATEGORY_ORDER: string[] = [
  "Materie",
  "Existenz",
  "Macht",
  "Kontrolle",
  "Gefühl",
  "Systemic Fragility",
];

const categoryAngles: Record<string, number> = {
  Materie: -Math.PI / 2,
  Existenz: -Math.PI / 3,
  Macht: 0,
  Kontrolle: Math.PI / 3,
  Gefühl: Math.PI / 2,
  "Systemic Fragility": (2 * Math.PI) / 3,
};

const categoryColors: Record<string, string> = {
  Materie: "#ef4444",
  Existenz: "#f97316",
  Macht: "#eab308",
  Kontrolle: "#22c55e",
  Gefühl: "#3b82f6",
  "Systemic Fragility": "#a855f7",
};

const linkTypeDescriptions: Record<LinkType, string> = {
  trigger: "Trigger-Pfade",
  related: "Explizite Verknüpfungen",
  shared: "Thematische Kopplungen",
  polycrisis: "Polykrisen-Hubs",
};

const linkTypeColors: Record<LinkType, string> = {
  trigger: "rgba(248, 113, 113, 0.9)",
  related: "rgba(245, 158, 11, 0.65)",
  shared: "rgba(255, 255, 255, 0.4)",
  polycrisis: "rgba(148, 163, 184, 0.85)",
};

const HUB_SLUG = "autokratie";
const HUB_COLOR = "#ff1f5d";

const buildLinkKey = (link: NetworkLink) =>
  link.directional
    ? `${link.source}->${link.target}`
    : [link.source, link.target].sort().join("|");

const computePath = (
  source: string,
  target: string,
  nodes: NetworkNode[],
  links: NetworkLink[]
) => {
  if (!source || !target || source === target) return { nodes: new Set<string>(), links: new Set<string>(), path: [] as string[] };

  const adjacency = new Map<string, Set<{ next: string; key: string }>>();
  links.forEach((link) => {
    const push = (from: string, to: string) => {
      const key = buildLinkKey(link);
      if (!adjacency.has(from)) adjacency.set(from, new Set());
      adjacency.get(from)!.add({ next: to, key });
    };
    push(link.source, link.target);
    push(link.target, link.source);
  });

  const queue: string[] = [source];
  const parents = new Map<string, string | null>();
  parents.set(source, null);

  while (queue.length) {
    const current = queue.shift()!;
    if (current === target) break;
    const neighbors = adjacency.get(current);
    if (!neighbors) continue;
    neighbors.forEach(({ next }) => {
      if (!parents.has(next)) {
        parents.set(next, current);
        queue.push(next);
      }
    });
  }

  if (!parents.has(target)) return { nodes: new Set<string>(), links: new Set<string>(), path: [] as string[] };

  const path: string[] = [];
  let cursor: string | null = target;
  while (cursor) {
    path.push(cursor);
    cursor = parents.get(cursor) ?? null;
  }
  path.reverse();

  const highlightNodes = new Set(path);
  const highlightLinks = new Set<string>();
  for (let i = 0; i < path.length - 1; i += 1) {
    const a = path[i];
    const b = path[i + 1];
    links.forEach((link) => {
      const directionMatch = link.directional && link.source === a && link.target === b;
      const undirectedMatch =
        !link.directional &&
        (link.source === a && link.target === b || link.source === b && link.target === a);
      if (directionMatch || undirectedMatch) {
        highlightLinks.add(buildLinkKey(link));
      }
    });
  }

  return { nodes: highlightNodes, links: highlightLinks, path };
};

const CrisisNetwork: React.FC<Props> = ({ crises, manifestMap, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [activeLinkTypes, setActiveLinkTypes] = useState<LinkType[]>([
    "trigger",
    "related",
    "shared",
    "polycrisis",
  ]);
  const [highlightSource, setHighlightSource] = useState("");
  const [highlightTarget, setHighlightTarget] = useState("");

  const polyEdges = useMemo<PolycrisisEdge[]>(() => polyRelations as PolycrisisEdge[], []);

  const nodesWithManifest = useMemo<NetworkNode[]>(() =>
    crises.map((crisis) => ({
      ...crisis,
      manifest: manifestMap[crisis.slug],
      id: crisis.slug,
    }))
  , [crises, manifestMap]);

  const baseLinks = useMemo<NetworkLink[]>(() => {
    const map = new Map<string, NetworkLink>();
    const slugSet = new Set(nodesWithManifest.map((node) => node.slug));

    const addLink = (source: string, target: string, type: LinkType, value = 1, directional = false) => {
      if (!source || !target) return;
      if (!slugSet.has(source) || !slugSet.has(target)) {
        return;
      }
      const key = directional ? `${source}->${target}` : [source, target].sort().join("|");
      const existing = map.get(key);
      if (existing) {
        existing.value += value;
      } else {
        map.set(key, { source, target, value, type, directional });
      }
    };

    nodesWithManifest.forEach((node) => {
      const manifest = node.manifest;
      if (!manifest) return;
      (manifest.triggers ?? []).forEach((target) => {
        addLink(node.slug, target, "trigger", 3, true);
      });
      (manifest.related ?? []).forEach((target) => {
        addLink(node.slug, target, "related", 1, false);
      });
    });

    polyEdges.forEach((edge) => {
      addLink(edge.source, edge.target, "polycrisis", 2, false);
    });

    nodesWithManifest.forEach((source) => {
      nodesWithManifest.forEach((target) => {
        if (source.slug === target.slug) return;
        const sharedCats = source.categories.filter((cat) => target.categories.includes(cat));
        if (sharedCats.length > 0) {
          addLink(source.slug, target.slug, "shared", sharedCats.length * 0.5, false);
        }
      });
    });

    return Array.from(map.values());
  }, [nodesWithManifest]);

  const filteredData = useMemo(() => {
    const links = baseLinks.filter((link) => activeLinkTypes.includes(link.type));
    const nodeIds = new Set(links.flatMap((link) => [link.source, link.target]));
    const nodes =
      nodeIds.size > 0
        ? nodesWithManifest.filter((node) => nodeIds.has(node.slug))
        : nodesWithManifest;
    return { nodes, links };
  }, [activeLinkTypes, baseLinks, nodesWithManifest]);

  const highlight = useMemo(
    () => computePath(highlightSource, highlightTarget, nodesWithManifest, baseLinks),
    [highlightSource, highlightTarget, nodesWithManifest, baseLinks]
  );

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1200;
    const height = 800;
    const center = { x: width / 2, y: height / 2 };
    const orbitRadius = Math.min(width, height) / 3.1;
    const categoryCenters: Record<string, { x: number; y: number }> = {};
    CATEGORY_ORDER.forEach((category, index) => {
      const angle = (index / CATEGORY_ORDER.length) * Math.PI * 2 - Math.PI / 2;
      categoryCenters[category] = {
        x: center.x + Math.cos(angle) * orbitRadius,
        y: center.y + Math.sin(angle) * orbitRadius,
      };
    });

    const ringRadiusMap: Record<string, number> = CATEGORY_ORDER.reduce((acc, category, index) => {
      acc[category] = 100 + index * 40;
      return acc;
    }, {} as Record<string, number>);

    const getRingRadius = (node: NetworkNode) => {
      const base = ringRadiusMap[node.categories[0]] ?? 110;
      return base + (node.severity - 50) * 0.5;
    };

    const g = svg.append("g");
    const clusterGroup = g.append("g").attr("class", "clusters");
    clusterGroup
      .selectAll("circle")
      .data(CATEGORY_ORDER)
      .join("circle")
      .attr("cx", (category) => categoryCenters[category]?.x ?? center.x)
      .attr("cy", (category) => categoryCenters[category]?.y ?? center.y)
      .attr("r", (category) => ringRadiusMap[category])
      .attr("fill", (category) => categoryColors[category] ?? "#ffffff")
      .attr("opacity", 0.05)
      .attr("stroke", "#ffffff11");

    clusterGroup
      .selectAll("line")
      .data(CATEGORY_ORDER)
      .join("line")
      .attr("x1", center.x)
      .attr("y1", center.y)
      .attr("x2", (category) => categoryCenters[category]?.x ?? center.x)
      .attr("y2", (category) => categoryCenters[category]?.y ?? center.y)
      .attr("stroke", "#ffffff0d")
      .attr("stroke-width", 1);

    const clusterLabels = clusterGroup
      .selectAll("text")
      .data(CATEGORY_ORDER)
      .join("text")
      .attr("x", (category) => categoryCenters[category]?.x ?? center.x)
      .attr("y", (category) => categoryCenters[category]?.y ?? center.y)
      .attr("fill", "#ffffffa6")
      .attr("font-size", 9)
      .attr("text-anchor", "middle")
      .attr("dy", -12)
      .text((category) => category);

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 3])
      .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoomBehavior);
    zoomRef.current = zoomBehavior;

    filteredData.nodes.forEach((node) => {
      const baseCenter = categoryCenters[node.categories[0]] ?? center;
      const jitter = Math.random() * Math.PI * 2;
      const radius = (ringRadiusMap[node.categories[0]] ?? 110) * 0.4;
      node.x = baseCenter.x + Math.cos(jitter) * radius;
      node.y = baseCenter.y + Math.sin(jitter) * radius;
    });

    const simulation = d3
      .forceSimulation(filteredData.nodes)
      .force(
        "link",
        d3
          .forceLink(filteredData.links)
          .id((d: any) => d.slug)
          .distance((d: any) => 180 - Math.min(60, d.value * 15))
          .strength((d: any) => Math.min(0.2, 0.08 + d.value * 0.015))
      )
      .force(
        "charge",
        d3.forceManyBody().strength(-800).distanceMax(800).distanceMin(80)
      )
      .force("center", d3.forceCenter(center.x, center.y).strength(0.02))
      .force(
        "radial",
        d3
          .forceRadial(
            (d: NetworkNode) => getRingRadius(d),
            (d: NetworkNode) => categoryCenters[d.categories[0]]?.x ?? center.x,
            (d: NetworkNode) => categoryCenters[d.categories[0]]?.y ?? center.y
          )
          .strength(0.65)
      )
      .force("collision", d3.forceCollide().radius((d: any) => 30 + d.severity / 6).iterations(5))
      .alphaTarget(0.005)
      .alphaDecay(0.002)
      .alpha(0.5); // Start with much higher energy

    const link = g
      .append("g")
      .attr("stroke-linecap", "round")
      .selectAll("line")
      .data(filteredData.links)
      .join("line")
      .attr("stroke", (d) =>
        highlight.links.has(buildLinkKey(d)) ? "#facc15" : linkTypeColors[d.type]
      )
      .attr("stroke-width", (d) =>
        highlight.links.has(buildLinkKey(d)) ? Math.max(3, Math.sqrt(d.value) * 2) : Math.max(1.5, Math.sqrt(d.value))
      )
      .attr("stroke-opacity", (d) =>
        highlight.links.has(buildLinkKey(d)) ? 0.95 : d.type === "shared" ? 0.35 : 0.75
      );

    const node = g
      .append("g")
      .selectAll("circle")
      .data(filteredData.nodes)
      .join("circle")
      .attr("r", (d) => {
        const isHub = d.slug === HUB_SLUG;
        return isHub ? 14 + d.severity / 16 : 8 + d.severity / 22;
      })
      .attr("fill", (d) => {
        const isHub = d.slug === HUB_SLUG;
        if (highlight.nodes.has(d.slug)) {
          return "#facc15";
        }
        if (isHub) {
          return HUB_COLOR;
        }
        return categoryColors[d.categories[0]] ?? "#6b7280";
      })
      .attr("stroke", (d) => (d.slug === HUB_SLUG ? "#ffc0d6" : "#ffffff"))
      .attr("stroke-width", (d) => (d.slug === HUB_SLUG ? 3 : 1.5))
      .style("cursor", "pointer");

    const dragHandler = d3
      .drag<SVGCircleElement, NetworkNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.2).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(dragHandler)
      .on("click", (_event, d) => {
        onNodeClick && onNodeClick(d);
      })
      .on("mouseover", function (event, d) {
        const tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0,0,0,0.9)")
          .style("color", "white")
          .style("padding", "8px 12px")
          .style("border-radius", "4px")
          .style("font-family", "JetBrains Mono")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("z-index", "1000")
          .html(`
            <div style="font-weight:bold;margin-bottom:4px;">${d.title}</div>
            <div>${d.severity}/100 Severity</div>
            <div>${d.volatility}/100 Volatility</div>
          `);

        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`);
      })
      .on("mouseout", function () {
        d3.selectAll(".tooltip").remove();
      });

    const labels = g
      .append("g")
      .selectAll("text")
      .data(filteredData.nodes)
      .join("text")
      .text((d) => {
        if (d.slug === HUB_SLUG) {
          return `${d.title} · HUB`;
        }
        if (d.title.length > 15) {
          return `${d.title.substring(0, 12)}...`;
        }
        return d.title;
      })
      .attr("font-family", "JetBrains Mono")
      .attr("font-size", "10px")
      .attr("fill", "#ffffff")
      .attr("text-anchor", "middle")
      .attr("dy", -14)
      .style("pointer-events", "none")
      .style("opacity", 0.9);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

      labels.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
    });

    node.on("dblclick", (_event, d) => {
      d.fx = null;
      d.fy = null;
    });

    return () => {
      simulation.stop();
      d3.selectAll(".tooltip").remove();
    };
  }, [filteredData, highlight, onNodeClick]);

  const toggleLinkType = (type: LinkType) => {
    setActiveLinkTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const nodeOptions = useMemo(
    () =>
      nodesWithManifest
        .map((node) => ({ value: node.slug, label: node.title }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [nodesWithManifest]
  );

  const nodeLabel = (slug: string) => nodesWithManifest.find((node) => node.slug === slug)?.title ?? slug;

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-4 mb-6">
        { (["trigger","related","shared","polycrisis"] as LinkType[]).map((type) => (
          <button
            key={type}
            onClick={() => toggleLinkType(type)}
            className={`mono text-[10px] uppercase tracking-[0.3em] px-4 py-1 border border-white/20 ${
              activeLinkTypes.includes(type) ? "bg-white text-black" : "text-white/60 hover:bg-white/10"
            }`}
          >
            {linkTypeDescriptions[type]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex flex-col gap-1">
          <span className="mono text-[8px] uppercase tracking-[0.5em] text-white/40">Highlight</span>
          <select
            className="mono text-[11px] bg-black border border-white/20 px-3 py-2 text-white"
            value={highlightSource}
            onChange={(e) => setHighlightSource(e.target.value)}
          >
            <option value="">Quell-Krise</option>
            {nodeOptions.map((option) => (
              <option key={`from-${option.value}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <span className="mono text-[8px] uppercase tracking-[0.5em] text-white/40">&nbsp;</span>
          <select
            className="mono text-[11px] bg-black border border-white/20 px-3 py-2 text-white"
            value={highlightTarget}
            onChange={(e) => setHighlightTarget(e.target.value)}
          >
            <option value="">Ziel-Krise</option>
            {nodeOptions.map((option) => (
              <option key={`to-${option.value}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            setHighlightSource("");
            setHighlightTarget("");
          }}
          className="mono text-[10px] uppercase tracking-[0.3em] px-4 py-2 border border-white/20 hover:bg-white hover:text-black"
        >
          Clear Path
        </button>
        {highlight.path.length > 1 && (
          <div className="mono text-[11px] text-white/60">
            Path: {highlight.path.map((slug, index) => (
              <span key={`${slug}-${index}`}>
                {nodeLabel(slug)}
                {index < highlight.path.length - 1 ? " → " : ""}
              </span>
            ))}
          </div>
        )}
        {!highlight.path.length && (highlightSource || highlightTarget) && (
          <div className="mono text-[11px] text-red-400">
            Kein Pfad gefunden.
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="flex items-center gap-2">
            <span
              aria-hidden
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="mono text-[9px] uppercase tracking-[0.2em] text-white/60">
              {category}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col text-white/60 text-[10px] uppercase tracking-[0.2em] border border-red-500/40 bg-black/40 px-4 py-3 mb-6">
        <span className="text-red-400">AUTOKRATIE</span>
        <span className="font-light text-[9px] text-white/40 mt-1">
          Polykrisen-Hub • Biopolitik · Algorithmische Steuerung · Prekarisierung
        </span>
      </div>

      <div className="border border-white/10 bg-white/[0.01] p-6 relative">
        <svg
          ref={svgRef}
          viewBox="0 0 1200 800"
          className="w-full h-auto"
          style={{ minHeight: "600px" }}
        />
      </div>

      <div className="mt-4 mono text-[10px] uppercase tracking-[0.3em] text-white/40">
        Klick auf Knoten für Details • Filter link-type • Drag & Zoom aktiv
      </div>
    </div>
  );
};

export { CrisisNetwork };
