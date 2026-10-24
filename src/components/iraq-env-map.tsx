// Stylized schematic map of Iraq with environmental hazard hotspots.
// Self-drawn SVG (no external map provider) — positions are normalized 0..100.
import { useMemo, useState } from "react";
import { GOVERNORATES, HAZARD_META, SEVERITY_META, type EnvHotspot, type EnvHazardType } from "@/lib/env-data";

// Simplified Iraq silhouette (viewBox 0 0 100 100).
const IRAQ_PATH =
  "M28 4 L40 2 L52 5 L60 8 L66 14 L70 20 L68 26 L72 32 L70 40 L74 48 L72 56 L76 62 L72 70 L68 78 L62 88 L56 92 L50 88 L44 84 L38 78 L30 74 L22 68 L16 60 L12 50 L10 40 L14 30 L18 22 L22 14 Z";

export function IraqEnvMap({
  hotspots,
  activeTypes,
  onSelect,
  selectedId,
  height = 420,
}: {
  hotspots: EnvHotspot[];
  activeTypes: Set<EnvHazardType>;
  onSelect?: (h: EnvHotspot) => void;
  selectedId?: string | null;
  height?: number;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const visible = useMemo(
    () => hotspots.filter((h) => activeTypes.has(h.type)),
    [hotspots, activeTypes]
  );

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-background" style={{ height }}>
      <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="خريطة العراق — الترصد البيئي">
        <defs>
          <radialGradient id="hzGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Land */}
        <path d={IRAQ_PATH} fill="var(--color-muted)" stroke="var(--color-border-strong)" strokeWidth="0.4" />

        {/* Governorate labels */}
        {GOVERNORATES.map((g) => (
          <text key={g.name} x={g.x} y={g.y} textAnchor="middle" fontSize="2.6" fill="var(--color-muted-foreground)" style={{ pointerEvents: "none" }}>
            {g.name}
          </text>
        ))}

        {/* Hotspots */}
        {visible.map((h) => {
          const meta = HAZARD_META[h.type];
          const r = 1.6 + SEVERITY_META[h.severity].weight * 0.55;
          const isSel = selectedId === h.id || hovered === h.id;
          return (
            <g key={h.id} style={{ cursor: onSelect ? "pointer" : "default", color: meta.color }}
              onClick={() => onSelect?.(h)}
              onMouseEnter={() => setHovered(h.id)}
              onMouseLeave={() => setHovered(null)}>
              <circle cx={h.x} cy={h.y} r={r * 3.2} fill="url(#hzGlow)" />
              <circle cx={h.x} cy={h.y} r={isSel ? r * 1.35 : r} fill={meta.color} stroke="var(--color-surface)" strokeWidth="0.35" opacity={isSel ? 1 : 0.9}>
                {h.severity === "critical" && (
                  <animate attributeName="r" values={`${r};${r * 1.5};${r}`} dur="1.6s" repeatCount="indefinite" />
                )}
              </circle>
              {isSel && (
                <circle cx={h.x} cy={h.y} r={r * 2.1} fill="none" stroke={meta.color} strokeWidth="0.3" strokeDasharray="1 1" />
              )}
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {hovered && (() => {
        const h = visible.find((x) => x.id === hovered);
        if (!h) return null;
        const meta = HAZARD_META[h.type];
        return (
          <div className="pointer-events-none absolute rounded-xl border border-border bg-surface/95 px-3 py-2 text-[11px] shadow-[var(--shadow-elevated)] backdrop-blur"
            style={{ right: `${100 - h.x}%`, top: `${h.y}%`, transform: "translate(50%, -110%)" }}>
            <div className="font-semibold text-foreground">{h.title}</div>
            <div className="text-muted-foreground">{meta.label} · {h.governorate} · {SEVERITY_META[h.severity].label}</div>
          </div>
        );
      })()}

      {/* Legend */}
      <div className="absolute bottom-2 right-2 flex flex-wrap gap-1.5 rounded-xl border border-border bg-surface/90 px-2.5 py-2 backdrop-blur">
        {(Object.keys(HAZARD_META) as EnvHazardType[]).map((k) => (
          <span key={k} className="inline-flex items-center gap-1 text-[9.5px] text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: HAZARD_META[k].color }} />
            {HAZARD_META[k].label}
          </span>
        ))}
      </div>
    </div>
  );
}
