import { createElement } from "react";

// A row is one pixel high. Merge adjacent pixels into runs for a small SVG.
export function PixelSprite({ rows, palette }) {
  const paths = new Map();
  const width = Math.max(...rows.map((row) => row.length));
  const dx = Math.floor((28 - width) / 2);
  const dy = Math.floor((24 - rows.length) / 2);
  rows.forEach((row, y) => {
    for (const match of row.matchAll(/([^.])\1*/g)) {
      const ink = palette[match[1]];
      if (!ink) throw new Error("Missing sprite color " + match[1]);
      const n = match[0].length;
      const run = `M${dx + match.index} ${dy + y}h${n}v1h-${n}z`;
      paths.set(ink, (paths.get(ink) || "") + run);
    }
  });
  return createElement("g", { shapeRendering: "crispEdges" },
    [...paths].map(([fill, d]) => createElement("path", { key: fill, fill, d })));
}
