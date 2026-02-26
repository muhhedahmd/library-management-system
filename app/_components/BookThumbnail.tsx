"use client";

import { useMemo } from "react";

interface BookThumbnailProps {
  title: string;
  author?: string;
  description?: string | null;
  tag?: string;
  className?: string;
}

// ── Palette ────────────────────────────────────────────────────────────────
// Each palette: [gradientFrom, gradientTo, accentLine, textColor, tagBg, tagText]
const PALETTES = [
  ["#1e3a5f", "#2d6a9f", "#4a9fd4", "#e8f4fc", "#4a9fd4", "#fff"],      // deep blue
  ["#2d1b4e", "#6b3fa0", "#a855f7", "#f3e8ff", "#a855f7", "#fff"],      // violet
  ["#1a3a2a", "#2d6b4a", "#4ade80", "#e8fdf0", "#4ade80", "#052e16"],   // forest
  ["#4a1515", "#9b2c2c", "#f87171", "#fff5f5", "#f87171", "#fff"],      // crimson
  ["#1a2e4a", "#1e4d7b", "#38bdf8", "#e0f7ff", "#38bdf8", "#fff"],      // sky
  ["#2d2a1a", "#7a6520", "#fbbf24", "#fffbeb", "#fbbf24", "#1a1200"],   // amber
  ["#1a1a2e", "#16213e", "#e94560", "#ffe4e9", "#e94560", "#fff"],      // dark rose
  ["#0f2027", "#203a43", "#2c5364", "#e8f4f8", "#4ecdc4", "#fff"],      // teal dark
  ["#2a0a3a", "#5b1a8a", "#c084fc", "#faf5ff", "#c084fc", "#fff"],      // purple mist
  ["#0a2a1a", "#134d3a", "#10b981", "#ecfdf5", "#10b981", "#fff"],      // emerald
] as const;

// ── Decorative SVG patterns (inline, no external deps) ────────────────────
type PatternId = "lines" | "dots" | "waves" | "crosses" | "triangles" | "hex";

function Pattern({
  id,
  color,
  opacity = 0.12,
}: {
  id: PatternId;
  color: string;
  opacity?: number;
}) {
  const patterns: Record<PatternId, JSX.Element> = {
    lines: (
      <pattern id="p" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="20" y2="20" stroke={color} strokeWidth="1" strokeOpacity={opacity} />
        <line x1="20" y1="0" x2="0" y2="20" stroke={color} strokeWidth="1" strokeOpacity={opacity} />
      </pattern>
    ),
    dots: (
      <pattern id="p" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
        <circle cx="8" cy="8" r="1.5" fill={color} fillOpacity={opacity} />
      </pattern>
    ),
    waves: (
      <pattern id="p" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
        <path d="M0 10 Q10 0 20 10 Q30 20 40 10" stroke={color} strokeWidth="1.5" fill="none" strokeOpacity={opacity} />
      </pattern>
    ),
    crosses: (
      <pattern id="p" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <line x1="10" y1="4" x2="10" y2="16" stroke={color} strokeWidth="1" strokeOpacity={opacity} />
        <line x1="4" y1="10" x2="16" y2="10" stroke={color} strokeWidth="1" strokeOpacity={opacity} />
      </pattern>
    ),
    triangles: (
      <pattern id="p" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <polygon points="12,4 22,20 2,20" fill="none" stroke={color} strokeWidth="1" strokeOpacity={opacity} />
      </pattern>
    ),
    hex: (
      <pattern id="p" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
        <polygon points="14,2 24,8 24,20 14,26 4,20 4,8" fill="none" stroke={color} strokeWidth="1" strokeOpacity={opacity} />
      </pattern>
    ),
  };
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>{patterns[id]}</defs>
      <rect width="100%" height="100%" fill="url(#p)" />
    </svg>
  );
}

// ── Seeded hash — deterministic per title ─────────────────────────────────
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

const PATTERN_IDS: PatternId[] = ["lines", "dots", "waves", "crosses", "triangles", "hex"];

// ── Component ─────────────────────────────────────────────────────────────
export function BookThumbnail({
  title,
  author,
  description,
  tag,
  className = "",
}: BookThumbnailProps) {
  const { palette, patternId, initials } = useMemo(() => {
    const seed = hashStr(title + (author ?? ""));
    const palette = PALETTES[seed % PALETTES.length];
    const patternId = PATTERN_IDS[(seed >> 4) % PATTERN_IDS.length];

    // Get 1-2 initials from title
    const words = title.trim().split(/\s+/);
    const initials =
      words.length === 1
        ? words[0].slice(0, 2).toUpperCase()
        : (words[0][0] + words[1][0]).toUpperCase();

    return { palette, patternId, initials };
  }, [title, author]);

  const [from, to, accent, textColor, tagBg, tagText] = palette;

  // Truncate helpers
  const shortTitle = title.length > 40 ? title.slice(0, 38) + "…" : title;
  const shortDesc = description
    ? description.length > 70
      ? description.slice(0, 68) + "…"
      : description
    : null;
  const shortAuthor = author
    ? author.length > 28
      ? author.slice(0, 26) + "…"
      : author
    : null;
  const shortTag = tag
    ? tag.length > 20
      ? tag.slice(0, 18) + "…"
      : tag
    : null;

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      style={{
        background: `linear-gradient(145deg, ${from} 0%, ${to} 100%)`,
      }}
    >
      {/* Decorative pattern */}
      <Pattern id={patternId} color={accent} opacity={0.15} />

      {/* Accent bar — top */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: accent }}
      />

      {/* Decorative large initials — background watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden
      >
        <span
          className="font-black leading-none"
          style={{
            fontSize: "clamp(5rem, 25cqi, 9rem)",
            color: accent,
            opacity: 0.08,
            letterSpacing: "-0.05em",
          }}
        >
          {initials}
        </span>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-[10%]">
        {/* Top: tag pill */}
        {shortTag && (
          <div className="flex">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full leading-tight"
              style={{ background: tagBg, color: tagText }}
            >
              {shortTag}
            </span>
          </div>
        )}

        {/* Middle: accent line + initials circle */}
        <div className="flex items-center gap-2 my-auto">
          <div
            className="w-1 rounded-full flex-shrink-0"
            style={{ background: accent, height: "clamp(40px, 20%, 64px)" }}
          />
          <div
            className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
            style={{
              width: "clamp(36px, 20%, 52px)",
              height: "clamp(36px, 20%, 52px)",
              background: `${accent}33`,
              border: `1.5px solid ${accent}66`,
              color: accent,
              fontSize: "clamp(0.75rem, 4cqi, 1.1rem)",
            }}
          >
            {initials}
          </div>
        </div>

        {/* Bottom: title + author + description */}
        <div className="flex flex-col gap-1">
          {/* Description snippet */}
          {shortDesc && (
            <p
              className="leading-tight line-clamp-2"
              style={{
                color: textColor,
                opacity: 0.55,
                fontSize: "clamp(0.55rem, 2.5cqi, 0.7rem)",
              }}
            >
              {shortDesc}
            </p>
          )}

          {/* Title */}
          <h3
            className="font-bold leading-tight line-clamp-3"
            style={{
              color: textColor,
              fontSize: "clamp(0.7rem, 4cqi, 1rem)",
            }}
          >
            {shortTitle}
          </h3>

          {/* Author */}
          {shortAuthor && (
            <p
              className="font-medium leading-none mt-0.5"
              style={{
                color: accent,
                fontSize: "clamp(0.55rem, 2.5cqi, 0.72rem)",
              }}
            >
              {shortAuthor}
            </p>
          )}
        </div>
      </div>

      {/* Accent bar — bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: `${accent}66` }}
      />
    </div>
  );
}
