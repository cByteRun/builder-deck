// Original sprites on integer grids. Separate layers keep each pose legible at 1× and 2×.
function sensor(x, y) {
  return `<g transform="translate(${x} ${y})" class="sensor">
    <path fill="#611c27" d="M1 0h4v1h1v4H5v1H1V5H0V1h1z"/>
    <path fill="#d9383a" d="M1 1h4v3H4v1H1z"/>
    <path fill="#ff2a2a" d="M2 1h3v2H2z"/><path fill="#ffe8d9" d="M2 1h2v1H2z"/>
  </g>`;
}

const heart =
  '<path fill="#ff5353" d="M0 1h1V0h2v1h1V0h2v1h1v2H6v1H5v1H4v1H3V5H2V4H1V3H0z"/>';
export const heroSprite = `<svg viewBox="0 0 48 44" shape-rendering="crispEdges" aria-hidden="true">
  <path fill="#0e0c0c" d="M10 41h29v2H10z"/>
  <g class="sprite">
    <path fill="#121113" d="M14 31h17v2h5v3h3v5h-8v-2H16v2H8v-4h3v-3h3z"/>
    <path fill="#373234" d="M12 35h5v5h-6v-3h1zm18-2h4v2h2v5h-7z"/>
    <path fill="#5c1d24" d="M13 29h18v2h5v3h4v2h4v3h-7v-2h-5v4h-4v-5h-9v-2h-6z"/>
    <path fill="#7a262e" d="M14 29h17v2h3v2H18v-1h-4zm17 5h5v2h4v1h-6v-1h-3z"/>
    <path fill="#a44347" d="M16 30h11v1H16zm3 3h9v1h-9z"/>
    <g class="head">
      <path fill="#50494a" d="M4 19h2v-7h3V8h6V6h6V4h-2V2h5v2h5v1h7V3h4v7h-2v3h3v3h3v3h-4v6h-2v3h-4v3h-6v3H15v-2h-5v-3H7v-4H4z"/>
      <path fill="#232120" d="M5 19h2v-6h3V9h5V7h8V4h2v2h11V5h3v4h-3v4h4v4h3v1h-4v7h-2v3h-5v3h-6v2H15v-2h-4v-3H8v-4H5z"/>
      <path fill="#b9a9a5" d="M10 20h25v6h-2v3h-4v2H17v-1h-3v-2h-3z"/>
      <path fill="#f5f2eb" d="M12 21h21v5h-2v2h-3v2H18v-1h-3v-2h-2z"/>
      <path fill="#141312" d="M8 17h4v-3h20v1h4v9h-3v2h-9v-1h-4v2h-8v-2H9v-3H8z"/>
      <path fill="#301b23" d="M11 19h9v5h-8v-1h-1zm13-2h10v6h-9z"/>
      <g class="visor-eyes" fill="#ff3b30">
        <path d="M12 20h2v-1h5v2h-3v2h-3v-1h-1zm13-2h6v1h2v2h-3v1h-3v-2h-2z"/>
        <path fill="#ffe1d5" d="M15 20h2v1h-2zm12-1h2v1h-2z"/>
      </g>
      <path fill="#5b4145" d="M22 27h4v-1h3v1h-2v1h-5z"/><path fill="#fff" d="M26 27h1v2h-1z"/>
      <path fill="#343133" d="M7 16h3v-5h5V8h7V6h8v1h5v3h-4v3h-5v3h-3v5h-2v3h-2v-5h-3v-4h-3v2h-2v3H8v3H6v-4h1z"/>
      <path fill="#141312" d="M10 16h3v-4h6v-2h7v2h-4v4h2v3h-2v6h-2v-3h-2v-5h-3v-3h-2v4h-3v3H8v-2h2zM30 9h4v3h-2v3h-3v-2h1z"/>
      <path fill="#716767" d="M10 13h1v-2h3v1h-2v2h-2zm8-5h4v1h-4zm14-1h4v1h-4z"/>
      ${sensor(5, 13)}${sensor(12, 7)}${sensor(25, 6)}${sensor(33, 10)}
    </g>
  </g>
  <g class="hearts" transform="translate(39 3)">${heart}</g>
  <path class="wake-flash" fill="#ffd3ba" d="M41 7h2v5h-2zm0 6h2v2h-2z"/>
</svg>`;

// Cyber-cat sidekick. Alternating paw silhouettes are hand-drawn walk frames.
export const roverSprite = `<svg viewBox="0 0 36 25" shape-rendering="crispEdges" aria-hidden="true">
  <g class="rover-body">
    <path fill="#50494a" d="M2 11h3v4h3v1h3v-3h5v-2h4V4h2v1h3v2h4V5h3v9h2v4h-3v2h-4v2H11v-2H7v-2H4v-2H2z"/>
    <path fill="#232120" d="M3 12h1v4h4v1h4v-3h7v-2h2V6h2v1h2v2h5V7h1v6h2v4h-3v2h-6v2H12v-2H8v-1H5v-2H3z"/>
    <g class="cat-head"><path fill="#141312" d="M20 11h4V9h6v2h3v6H20z"/>
    <path fill="#f5f2eb" d="M22 16h10v2h-3v2h-6v-2h-1z"/>
    <path class="cat-eyes" fill="#ff3b30" d="M21 13h4v2h-3v-1h-1zm7-1h4v2h-4z"/>
    <path fill="#ffd1bd" d="M22 13h1v1h-1zm7-1h1v1h-1z"/>
    <path fill="#d9383a" d="M20 8h3v2h-3zm5-1h3v2h-3z"/></g>
    <path fill="#7a262e" d="M18 15h3v3h5v2h-7v-2h-3v1h-5v-2h5v-1h2z"/>
    <path fill="#b54a50" d="M12 17h5v1h-5zm8 1h3v1h-3z"/>
    <g class="paws paw-a" fill="#a49a98"><path d="M10 20h4v2h-2v1H9v-2h1zm12 0h3v1h3v2h-5z"/></g>
    <g class="paws paw-b" fill="#a49a98"><path d="M12 20h3v1h3v2h-4v-1h-2zm11 0h3v2h-2v1h-4v-2h3z"/></g>
  </g>
  <g class="hearts" transform="translate(8 1)">${heart}</g>
</svg>`;
