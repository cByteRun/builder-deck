const icons = {
  github:
    '<path fill="currentColor" stroke="none" d="M12 1a11 11 0 0 0-3.48 21.44c.55.1.75-.24.75-.53v-2.06c-3.06.67-3.7-1.3-3.7-1.3-.5-1.28-1.22-1.62-1.22-1.62-1-.68.08-.67.08-.67 1.1.08 1.68 1.14 1.68 1.14.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.69-1.47-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.91 0 0 .92-.3 3.02 1.12a10.4 10.4 0 0 1 5.5 0c2.1-1.42 3.02-1.12 3.02-1.12.6 1.51.22 2.63.11 2.91.7.77 1.13 1.75 1.13 2.95 0 4.23-2.58 5.16-5.03 5.43.4.35.75 1.02.75 2.07v3.01c0 .3.2.64.76.53A11 11 0 0 0 12 1Z"/>',
  linkedin:
    '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7.5 10v7m3.5 0v-7m0 3c0-4 6-4 6 0v4"/><circle cx="7.5" cy="7" r=".75" fill="currentColor"/>',
  astana: '<path d="m12 2 9 18h-5l-4-9-4 9H3z"/>',
  superteam:
    '<path d="M3 16h12l-3 3H1zm4-6h13l-3 3H4zm5-6h11l-3 3H9z" fill="currentColor" stroke="none"/>',
  x: '<path d="M3 3h4.4L21 21h-4.5zM20 3l-6.8 7.7M4 21l6.6-7.4"/>',
  instagram:
    '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1" fill="currentColor"/>',

  brand:
    '<path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5M9 3l6 18M3 15l18-6" stroke-width="2.4"/>',
  layers: '<path d="m3 8 9-5 9 5-9 5zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
  bomb: '<path d="M4 5h16v9l-6 6H4zM14 20v-6h6"/>',
  shelf:
    '<path d="M3 20h18M7 16h10M10 12v4h4v-4M7 4h10v4a5 5 0 0 1-10 0zM7 6H3v2a4 4 0 0 0 5 4M17 6h4v2a4 4 0 0 1-5 4"/>',
  sandbox:
    '<path d="M5 4h4v4H5zM15 4h4v4h-4zM5 15h4v4H5zM15 15h4v4h-4zM10 6h4M7 9v5M17 9v5M10 17h4"/>',
  tokens:
    '<path d="M3 4h7v7H3zM15 4h6v7h-6zM3 15h7v6H3z"/><circle cx="18" cy="18" r="3"/>',
  css: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 17"/>',
  moon: '<path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  enter: '<path d="M19 5v7H5m5-5-5 5 5 5"/>',
  check:
    '<path d="m12 2 2.5 2.5 3.5.3.8 3.4 2.2 2.8-1.8 3.2-.4 3.5-3.4 1.1L12 21l-3.2-2.2-3.5-1.1-.4-3.5L3 11l2.2-2.8L6 4.8l3.5-.3Z"/><path d="m8 11 3 3 5-6"/>',
  hand: '<path d="m4 3 5 17 3-7 7-3z"/>',
  shuffle:
    '<path d="M3 6h3c5 0 7 12 12 12h3m-4-4 4 4-4 3M3 18h3c2 0 3-2 5-4m2-4c2-3 3-4 5-4h3m-4-3 4 3-4 4"/>',
  reset: '<path d="M4 5v6h6m-6 0a8 8 0 1 1 2 7"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
  terminal: '<path d="m4 6 6 6-6 6m9 0h7"/>',
  folder: '<path d="M3 6h7l2 3h9v11H3z"/>',
};
function icon(k) {
  return (
    '<svg class="ui" viewBox="0 0 24 24" aria-hidden="true">' +
    icons[k] +
    "</svg>"
  );
}
const dims = {
  hack: [201, 147],
  sol: [202, 154],
  decent: [207, 111],
  coffee: [183, 138],
  sana: [186, 55],
  icpc: [186, 55],
  ship: [127, 55],
  cli: [209, 37],
  think: [136, 37],
  crab: [60, 40],
  cat: [54, 36],
};
const steam = `<path d="M64 4h4v6h4v8h-4v5h-3v-8h3v-4h-4Z" fill="#a7856f" class="steam"/><path d="M84 8h4v6h4v8h-4v5h-3v-8h3v-4h-4Z" fill="#a7856f" class="steam"/><path d="M106 1h4v6h4v8h-4v5h-3v-8h3v-4h-4Z" fill="#a7856f" class="steam"/>`;
function art(k) {
  const [w, h] = dims[k];
  return (
    '<svg class="art" aria-hidden="true" viewBox="0 0 ' +
    w +
    " " +
    h +
    '" width="' +
    w +
    '" height="' +
    h +
    '" shape-rendering="crispEdges"><use href="./assets/stickers/builder-sprites.svg#art-' +
    k +
    '"/>' +
    (k === "coffee" ? steam : "") +
    "</svg>"
  );
}

export { icon, art };
